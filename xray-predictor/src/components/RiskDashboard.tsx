import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity } from 'lucide-react'
import type { PredictionResponse } from '../services/api'

interface RiskDashboardProps {
  predictions: PredictionResponse
}

export default function RiskDashboard({ predictions }: RiskDashboardProps) {
  const stats = useMemo(() => {
    // Handle both new format (with results) and old format (flat object)
    let entries: Array<[string, any]> = []
    
    if (predictions && typeof predictions === 'object') {
      // New format: has results property
      if ('results' in predictions && predictions.results) {
        entries = Object.entries(predictions.results)
      } 
      // Old format: flat object
      else if (!('model' in predictions) && !('results' in predictions)) {
        entries = Object.entries(predictions as any)
      }
    }
    
    const results = entries
    
    const highRisk = entries.filter(([, r]) => {
      if (typeof r === 'object' && r !== null && 'risk_level' in r) {
        return r.risk_level === 'High'
      }
      const numVal = typeof r === 'number' ? r : 0.5
      return numVal > 0.7
    })
    const moderateRisk = entries.filter(([, r]) => {
      if (typeof r === 'object' && r !== null && 'risk_level' in r) {
        return r.risk_level === 'Moderate'
      }
      const numVal = typeof r === 'number' ? r : 0.5
      return numVal > 0.4 && numVal <= 0.7
    })
    const lowRisk = entries.filter(([, r]) => {
      if (typeof r === 'object' && r !== null && 'risk_level' in r) {
        return r.risk_level === 'Low'
      }
      const numVal = typeof r === 'number' ? r : 0.5
      return numVal <= 0.4
    })
    
    const avgConfidence = entries.length > 0
      ? entries.reduce((sum, [, r]) => {
          if (typeof r === 'object' && r !== null && 'percentage' in r) {
            return sum + r.percentage
          }
          const numVal = typeof r === 'number' ? (r <= 1 && r >= 0 ? r * 100 : r) : 0
          return sum + numVal
        }, 0) / entries.length
      : 0
    
    const topRisks = entries
      .map(([key, r]) => {
        if (typeof r === 'object' && r !== null && 'percentage' in r) {
          return [key, r] as [string, any]
        }
        const numVal = typeof r === 'number' ? r : 0.5
        const percentage = numVal <= 1 && numVal >= 0 ? numVal * 100 : numVal
        const risk_level: 'Low' | 'Moderate' | 'High' = 
          numVal > 0.7 ? 'High' : numVal > 0.4 ? 'Moderate' : 'Low'
        return [key, { percentage, risk_level, probability: numVal }] as [string, any]
      })
      .sort(([, a], [, b]) => {
        const valA = typeof a === 'object' && 'percentage' in a ? a.percentage : 0
        const valB = typeof b === 'object' && 'percentage' in b ? b.percentage : 0
        return valB - valA
      })
      .slice(0, 3)

    return {
      total: entries.length,
      high: highRisk.length,
      moderate: moderateRisk.length,
      low: lowRisk.length,
      avgConfidence,
      topRisks,
    }
  }, [predictions])

  const getRiskColor = (level: 'High' | 'Moderate' | 'Low') => {
    switch (level) {
      case 'High':
        return 'from-red-500 to-red-600'
      case 'Moderate':
        return 'from-yellow-500 to-yellow-600'
      case 'Low':
        return 'from-emerald-500 to-emerald-600'
    }
  }

  const getRiskIcon = (level: 'High' | 'Moderate' | 'Low') => {
    switch (level) {
      case 'High':
        return AlertTriangle
      case 'Moderate':
        return Activity
      case 'Low':
        return CheckCircle
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-6"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary-500" />
        Risk Dashboard
      </h3>

      {/* Risk Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Conditions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-effect-strong rounded-xl p-5 border-2 border-primary-200 dark:border-primary-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total</span>
            <Activity className="w-4 h-4 text-primary-500" />
          </div>
          <div className="text-3xl font-bold gradient-text">{stats.total}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Conditions Analyzed</div>
        </motion.div>

        {/* High Risk */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-effect-strong rounded-xl p-5 border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.high}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {stats.total > 0 ? ((stats.high / stats.total) * 100).toFixed(1) : 0}% of total
          </div>
        </motion.div>

        {/* Moderate Risk */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-effect-strong rounded-xl p-5 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Moderate</span>
            <Activity className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.moderate}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {stats.total > 0 ? ((stats.moderate / stats.total) * 100).toFixed(1) : 0}% of total
          </div>
        </motion.div>

        {/* Low Risk */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-effect-strong rounded-xl p-5 border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Low Risk</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.low}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {stats.total > 0 ? ((stats.low / stats.total) * 100).toFixed(1) : 0}% of total
          </div>
        </motion.div>
      </div>

      {/* Average Confidence */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-effect-strong rounded-xl p-6 border-2 border-primary-200 dark:border-primary-800"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Average Confidence</h4>
          <span className="text-2xl font-bold gradient-text">{stats.avgConfidence.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.avgConfidence}%` }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
          />
        </div>
      </motion.div>

      {/* Top Risks */}
      {stats.topRisks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-effect-strong rounded-xl p-6 border-2 border-primary-200 dark:border-primary-800"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Top Risk Conditions
          </h4>
          <div className="space-y-3">
            {stats.topRisks.map(([name, result], index) => {
              const Icon = getRiskIcon(result.risk_level)
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`p-4 rounded-xl border-2 bg-gradient-to-r ${getRiskColor(result.risk_level)}/10 border-opacity-30`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getRiskColor(result.risk_level)}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {name.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {result.risk_level} Risk
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {result.percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Confidence
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

