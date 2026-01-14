import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Upload as UploadIcon, X, FileText, FileSpreadsheet, FileJson, File, Sparkles, CheckCircle2, AlertCircle, Loader2, Download, Zap, CreditCard, History } from 'lucide-react'
import { uploadXRay, type PredictionResponse } from '../services/api'
import { exportToPDF, exportToCSV, exportToExcel, exportToJSON } from '../utils/export'
import { useCredits } from '../hooks/useCredits'
import { useHistory } from '../hooks/useHistory'
import ReviewSection from '../components/ReviewSection'
import PatientSummary from '../components/PatientSummary'
import RiskDashboard from '../components/RiskDashboard'

export default function Upload() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { credits, useCredit } = useCredits()
  const { addToHistory, history } = useHistory()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null)
  const [patientName, setPatientName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 700 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileSelect(droppedFile)
    }
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)
    setPredictions(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    // Check if user has credits
    if (credits <= 0) {
      setError('You need credits to upload. Please purchase credits first.')
      setTimeout(() => {
        navigate('/credits')
      }, 2000)
      return
    }

    setLoading(true)
    setError(null)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const result = await uploadXRay(file)
      console.log('API Response received:', result)
      console.log('Response type:', typeof result)
      console.log('Has results?', 'results' in result)
      console.log('Has model?', 'model' in result)
      if ('results' in result) {
        console.log('Results keys:', Object.keys(result.results || {}))
      } else {
        console.log('Direct keys:', Object.keys(result))
      }
      setUploadProgress(100)
      
      // Deduct credit ONLY after successful upload
      const creditUsed = useCredit()
      if (!creditUsed) {
        console.error('Failed to deduct credit after successful upload')
      }
      
      // Generate analysis ID before adding to history
      const analysisId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      setCurrentAnalysisId(analysisId)

      // Add to history
      addToHistory({
        patientName: patientName || undefined,
        fileName: file.name,
        filePreview: preview || undefined,
        predictions: result,
      })

      setTimeout(() => {
        setPredictions(result)
        setUploadProgress(0)
      }, 500)
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : t('upload.error'))
      setUploadProgress(0)
      // Credit is NOT deducted if upload fails
    } finally {
      clearInterval(progressInterval)
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setPredictions(null)
    setError(null)
    setPatientName('')
    setUploadProgress(0)
    setCurrentAnalysisId(null)
  }

  const formatValue = (result: { percentage: number }): string => {
    return `${result.percentage.toFixed(2)}%`
  }

  const getValueColor = (riskLevel: 'Low' | 'Moderate' | 'High'): string => {
    switch (riskLevel) {
      case 'High':
        return 'text-red-500 dark:text-red-400'
      case 'Moderate':
        return 'text-yellow-500 dark:text-yellow-400'
      case 'Low':
        return 'text-emerald-500 dark:text-emerald-400'
      default:
        return 'text-gray-700 dark:text-gray-300'
    }
  }

  const getValueBgColor = (riskLevel: 'Low' | 'Moderate' | 'High'): string => {
    switch (riskLevel) {
      case 'High':
        return 'bg-red-500/10 border-red-500/20'
      case 'Moderate':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'Low':
        return 'bg-emerald-500/10 border-emerald-500/20'
      default:
        return 'bg-gray-100/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
    }
  }

  const getRiskBadgeColor = (riskLevel: 'Low' | 'Moderate' | 'High'): string => {
    switch (riskLevel) {
      case 'High':
        return 'bg-red-500 text-white'
      case 'Moderate':
        return 'bg-yellow-500 text-white'
      case 'Low':
        return 'bg-emerald-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden particle-bg py-12 px-4 sm:px-6 lg:px-8"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Mouse follower effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(14, 165, 233, 0.1), transparent 40%)`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 mb-6 shadow-2xl"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
          >
            {t('upload.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6"
          >
            {t('upload.subtitle')}
          </motion.p>
          
          {/* Credits Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6"
          >
            <div className="glass-effect-strong rounded-2xl px-6 py-3 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary-500" />
              <span className="text-gray-700 dark:text-gray-300 font-semibold">Credits:</span>
              <span className={`text-2xl font-bold ${credits > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {credits}
              </span>
            </div>
            <Link to="/history">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-effect-strong rounded-2xl px-6 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <History className="w-5 h-5" />
                <span className="font-semibold">History</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Low Credits Warning */}
          {credits <= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 glass-effect-strong rounded-2xl p-4 border-2 border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-900/20"
            >
              <div className="flex items-center justify-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-yellow-700 dark:text-yellow-400 font-medium">
                  You're out of credits!{' '}
                  <Link to="/credits" className="underline font-bold hover:text-yellow-800 dark:hover:text-yellow-300">
                    Purchase more credits
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Patient Name Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-effect-strong rounded-2xl p-6 premium-shadow"
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary-500" />
                {t('upload.patientName')}
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t('upload.patientNamePlaceholder')}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300"
              />
            </motion.div>

            {/* Drag & Drop Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative glass-effect-strong rounded-3xl p-12 text-center transition-all duration-500 premium-shadow-lg overflow-hidden group ${
                isDragging
                  ? 'border-2 border-primary-500 scale-105 bg-gradient-to-br from-primary-50/50 to-purple-50/50 dark:from-primary-900/20 dark:to-purple-900/20'
                  : 'border-2 border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Shimmer effect */}
              {!preview && (
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="file-input"
              />
              
              {preview ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-80 mx-auto rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleReset}
                      className="absolute -top-2 -right-2 p-3 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-20"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <UploadIcon className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>
                  <div>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      {t('upload.dragDrop')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      {t('upload.or')}
                    </p>
                    <motion.label
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      htmlFor="file-input"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer glow-effect"
                    >
                      <File className="w-5 h-5" />
                      <span>{t('upload.browse')}</span>
                    </motion.label>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Upload Button */}
            <AnimatePresence>
              {file && !predictions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {loading && (
                    <div className="glass-effect-strong rounded-2xl p-4 premium-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Uploading...
                        </span>
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full py-5 bg-gradient-to-r from-primary-500 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>{t('upload.processing')}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-6 h-6" />
                          <span>{t('upload.uploading')}</span>
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-700 to-pink-700"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  className="glass-effect-strong rounded-2xl p-5 border-2 border-red-500/30 bg-red-50/50 dark:bg-red-900/20 premium-shadow"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-700 dark:text-red-400 font-medium mb-2">{error}</p>
                      {error.includes('credits') && (
                        <Link to="/credits">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                          >
                            Purchase Credits
                          </motion.button>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {predictions ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="glass-effect-strong rounded-3xl p-8 premium-shadow-lg"
                >
                  {/* Success Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                        className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {t('upload.results')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Analysis complete
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Export Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                  >
                    <div className="flex flex-wrap gap-3">
                      {[
                        { icon: FileText, label: 'PDF', color: 'from-red-500 to-pink-600', action: () => exportToPDF(predictions, patientName, i18n.language || 'en') },
                        { icon: FileSpreadsheet, label: 'CSV', color: 'from-green-500 to-emerald-600', action: () => exportToCSV(predictions, patientName) },
                        { icon: FileSpreadsheet, label: 'Excel', color: 'from-blue-500 to-cyan-600', action: () => exportToExcel(predictions, patientName) },
                        { icon: FileJson, label: 'JSON', color: 'from-purple-500 to-pink-600', action: () => exportToJSON(predictions, patientName) },
                      ].map((btn, idx) => (
                        <motion.button
                          key={btn.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={btn.action}
                          className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 bg-gradient-to-r ${btn.color} text-white hover:shadow-xl`}
                        >
                          <btn.icon className="w-4 h-4" />
                          <span>{btn.label}</span>
                          <Download className="w-3 h-3" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Model Information */}
                  {predictions && typeof predictions === 'object' && 'model' in predictions && predictions.model && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl border border-primary-200 dark:border-primary-800"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Model:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{predictions.model}</span>
                        </div>
                        {predictions.type && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Type:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{predictions.type}</span>
                          </div>
                        )}
                        {predictions.disclaimer && (
                          <div className="mt-3 pt-3 border-t border-primary-200 dark:border-primary-800">
                            <p className="text-xs text-gray-600 dark:text-gray-400 italic">{predictions.disclaimer}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Predictions Table */}
                  <div className="space-y-3">
                    {(() => {
                      // Handle both new format (with results) and old format (flat object)
                      let entries: Array<[string, any]> = []
                      
                      if (predictions && typeof predictions === 'object') {
                        // New format: has results property
                        if ('results' in predictions && predictions.results) {
                          entries = Object.entries(predictions.results)
                        } 
                        // Old format: flat object with condition names as keys
                        else if (!('model' in predictions) && !('results' in predictions)) {
                          entries = Object.entries(predictions as any)
                        }
                      }

                      if (entries.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No predictions available. Please try uploading again.</p>
                          </div>
                        )
                      }

                      return entries
                        .sort(([, a], [, b]) => {
                          // Sort by percentage (new format) or value (old format)
                          const valA = typeof a === 'object' && a !== null && 'percentage' in a 
                            ? a.percentage 
                            : typeof a === 'number' ? a : 0
                          const valB = typeof b === 'object' && b !== null && 'percentage' in b
                            ? b.percentage
                            : typeof b === 'number' ? b : 0
                          return valB - valA
                        })
                        .map(([key, value], index) => {
                          // Check if new format (has risk_level) or old format
                          const isNewFormat = typeof value === 'object' && value !== null && 'risk_level' in value
                          
                          if (isNewFormat) {
                            const result = value as { probability: number; percentage: number; risk_level: 'Low' | 'Moderate' | 'High' }
                            return (
                              <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                className={`glass-effect rounded-xl p-4 border-2 ${getValueBgColor(result.risk_level)} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {key
                                      .split('_')
                                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(' ')}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-lg font-bold ${getValueColor(result.risk_level)}`}>
                                      {formatValue(result)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(result.risk_level)}`}>
                                      {result.risk_level}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                  <span>Probability: {(result.probability * 100).toFixed(2)}%</span>
                                  <span>Confidence: {result.percentage.toFixed(1)}%</span>
                                </div>
                              </motion.div>
                            )
                          } else {
                            // Old format handling
                            const numValue = typeof value === 'number' ? value : typeof value === 'string' && value === 'Yes' ? 0.7 : 0.5
                            const riskLevel: 'Low' | 'Moderate' | 'High' = 
                              numValue > 0.7 ? 'High' : numValue > 0.4 ? 'Moderate' : 'Low'
                            const percentage = numValue <= 1 && numValue >= 0 ? numValue * 100 : numValue
                            
                            return (
                              <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                className={`glass-effect rounded-xl p-4 border-2 ${getValueBgColor(riskLevel)} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {key
                                      .split('_')
                                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(' ')}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-lg font-bold ${getValueColor(riskLevel)}`}>
                                      {typeof value === 'string' ? value : `${percentage.toFixed(2)}%`}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(riskLevel)}`}>
                                      {riskLevel}
                                    </span>
                                  </div>
                                </div>
                                {typeof value === 'number' && (
                                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span>Value: {value <= 1 && value >= 0 ? `${(value * 100).toFixed(2)}%` : value}</span>
                                  </div>
                                )}
                              </motion.div>
                            )
                          }
                        })
                    })()}
                  </div>

                  {/* Risk Dashboard */}
                  {predictions && (
                    <RiskDashboard predictions={predictions} />
                  )}

                  {/* AI-Generated Patient Summary */}
                  {predictions && (
                    <PatientSummary predictions={predictions} patientName={patientName} />
                  )}

                  {/* Review Section */}
                  {predictions && currentAnalysisId && (
                    <ReviewSection analysisId={currentAnalysisId} />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-effect-strong rounded-3xl p-16 text-center premium-shadow-lg"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center"
                  >
                    <File className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                    {t('upload.noFile')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
