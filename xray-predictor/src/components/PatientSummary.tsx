import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Languages, Volume2 } from 'lucide-react'
import type { PredictionResponse } from '../services/api'
import { useTranslation } from 'react-i18next'

interface PatientSummaryProps {
  predictions: PredictionResponse
  patientName?: string
}

export default function PatientSummary({ predictions, patientName }: PatientSummaryProps) {
  const { i18n } = useTranslation()
  const [summary, setSummary] = useState<string>('')
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateSummary()
  }, [predictions, i18n.language])

  const generateSummary = () => {
    setLoading(true)
    
    // Simulate AI generation (in production, this would call an API)
    setTimeout(() => {
      // Handle both new format (with results) and old format (flat object)
      let entries: Array<[string, any]> = []
      
      if (predictions && typeof predictions === 'object') {
        if ('results' in predictions && predictions.results) {
          entries = Object.entries(predictions.results)
        } else if (!('model' in predictions) && !('results' in predictions)) {
          entries = Object.entries(predictions as any)
        }
      }
      
      const results = Object.fromEntries(entries.map(([key, value]) => {
        if (typeof value === 'object' && value !== null && 'risk_level' in value) {
          return [key, value]
        }
        const numVal = typeof value === 'number' ? value : 0.5
        const percentage = numVal <= 1 && numVal >= 0 ? numVal * 100 : numVal
        const risk_level: 'Low' | 'Moderate' | 'High' = 
          numVal > 0.7 ? 'High' : numVal > 0.4 ? 'Moderate' : 'Low'
        return [key, { percentage, risk_level, probability: numVal }]
      }))
      const sortedResults = Object.entries(results)
        .sort(([, a], [, b]) => b.percentage - a.percentage)
        .slice(0, 5)

      const highRisk = sortedResults.filter(([, r]) => r.risk_level === 'High')
      const moderateRisk = sortedResults.filter(([, r]) => r.risk_level === 'Moderate')
      const lowRisk = sortedResults.filter(([, r]) => r.risk_level === 'Low')

      let summaryText = `This analysis of ${patientName ? `${patientName}'s` : 'your'} chest X-ray was performed using ${predictions.model || 'AI technology'}. `
      
      if (highRisk.length > 0) {
        summaryText += `The analysis detected ${highRisk.length} condition${highRisk.length > 1 ? 's' : ''} with high risk levels: ${highRisk.map(([name]) => name.replace(/_/g, ' ')).join(', ')}. `
        summaryText += `These findings require immediate medical attention and consultation with a healthcare professional. `
      }
      
      if (moderateRisk.length > 0) {
        summaryText += `Additionally, ${moderateRisk.length} condition${moderateRisk.length > 1 ? 's were' : ' was'} detected with moderate risk levels. `
      }
      
      if (lowRisk.length > 0 && highRisk.length === 0 && moderateRisk.length === 0) {
        summaryText += `The analysis shows mostly low-risk findings, which is generally positive. However, it's important to note that this is an AI-assisted analysis and should be reviewed by a qualified healthcare professional. `
      }

      summaryText += `This report is for informational purposes only and does not constitute a medical diagnosis. Please consult with a qualified healthcare provider for proper evaluation and treatment recommendations.`

      setSummary(summaryText)

      // Generate recommendations
      const recs: string[] = []
      if (highRisk.length > 0) {
        recs.push('Schedule an appointment with a healthcare professional as soon as possible for further evaluation.')
        recs.push('Consider bringing this report to your doctor for review.')
      } else if (moderateRisk.length > 0) {
        recs.push('Consider scheduling a follow-up appointment with your healthcare provider.')
        recs.push('Monitor any symptoms and report them to your doctor.')
      } else {
        recs.push('Continue routine monitoring and regular check-ups.')
      }
      recs.push('Keep this report for your medical records.')
      recs.push('Always consult with qualified healthcare professionals for medical decisions.')

      setRecommendations(recs)
      setLoading(false)
    }, 1000)
  }

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(summary)
      utterance.lang = i18n.language || 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI-Generated Summary</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Plain language explanation of results</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTextToSpeech}
            className="p-2 glass-effect-strong rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
            title="Listen to summary"
          >
            <Volume2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
          <div className="px-3 py-1.5 glass-effect-strong rounded-lg flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {i18n.language?.toUpperCase() || 'EN'}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-effect-strong rounded-2xl p-8 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Generating summary...</p>
        </div>
      ) : (
        <>
          <div className="glass-effect-strong rounded-2xl p-6 border-2 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Summary</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {summary}
            </p>
          </div>

          {recommendations.length > 0 && (
            <div className="glass-effect-strong rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h4>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-emerald-500 font-bold mt-1">•</span>
                    <span>{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

