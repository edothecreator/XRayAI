import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { History as HistoryIcon, FileText, Download, Trash2, Calendar, User, ArrowLeft, X } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import { exportToPDF, exportToCSV, exportToExcel } from '../utils/export'

export default function History() {
  const { history, deleteHistoryItem, clearHistory } = useHistory()
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const formatValue = (result: { percentage: number } | number | string | boolean): string => {
    if (typeof result === 'object' && 'percentage' in result) {
      return `${result.percentage.toFixed(2)}%`
    }
    if (typeof result === 'number') {
      if (result <= 1 && result >= 0) {
        return `${(result * 100).toFixed(2)}%`
      }
      return result.toString()
    }
    return String(result)
  }

  const getValueColor = (result: { risk_level?: 'Low' | 'Moderate' | 'High' } | number | string | boolean): string => {
    if (typeof result === 'object' && result !== null && 'risk_level' in result) {
      switch (result.risk_level) {
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
    if (typeof result === 'number' && result <= 1 && result >= 0) {
      if (result > 0.7) return 'text-red-500 dark:text-red-400'
      if (result > 0.4) return 'text-yellow-500 dark:text-yellow-400'
      return 'text-emerald-500 dark:text-emerald-400'
    }
    return 'text-gray-700 dark:text-gray-300'
  }

  const selectedHistoryItem = selectedItem ? history.find(item => item.id === selectedItem) : null

  if (history.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden particle-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <HistoryIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 gradient-text">No History Yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your analyzed X-ray images will appear here
          </p>
          <Link to="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Upload Your First X-Ray
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden particle-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 glass-effect-strong rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">Upload History</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {history.length} {history.length === 1 ? 'analysis' : 'analyses'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-3 glass-effect-strong rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
            >
              {viewMode === 'grid' ? 'List' : 'Grid'}
            </motion.button>
            {history.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearHistory}
                className="p-3 glass-effect-strong rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* History Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect-strong rounded-2xl p-6 premium-shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              onClick={() => setSelectedItem(item.id)}
            >
              {viewMode === 'grid' ? (
                <>
                  {item.filePreview && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <img
                        src={item.filePreview}
                        alt={item.fileName}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </div>
                    {item.patientName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        {item.patientName}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="w-4 h-4" />
                      {item.fileName}
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {Object.keys(item.predictions).length} conditions analyzed
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  {item.filePreview && (
                    <img
                      src={item.filePreview}
                      alt={item.fileName}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.patientName || 'Anonymous Patient'}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{item.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.fileName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Object.keys(item.predictions).length} conditions analyzed
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedHistoryItem && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-4xl max-h-[90vh] overflow-y-auto glass-effect-strong rounded-3xl p-8 z-50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-text">Analysis Details</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {selectedHistoryItem.filePreview && (
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img
                      src={selectedHistoryItem.filePreview}
                      alt={selectedHistoryItem.fileName}
                      className="w-full h-64 object-contain bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5" />
                    {selectedHistoryItem.date}
                  </div>
                  {selectedHistoryItem.patientName && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <User className="w-5 h-5" />
                      {selectedHistoryItem.patientName}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FileText className="w-5 h-5" />
                    {selectedHistoryItem.fileName}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Predictions</h3>
                  {/* Check if new format (has results property) or old format */}
                  {selectedHistoryItem.predictions && 'results' in selectedHistoryItem.predictions ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries((selectedHistoryItem.predictions as any).results || {}).map(([key, result]: [string, any]) => (
                        <div
                          key={key}
                          className={`p-4 rounded-xl border-2 ${
                            result.risk_level === 'High' ? 'bg-red-500/10 border-red-500/20' :
                            result.risk_level === 'Moderate' ? 'bg-yellow-500/10 border-yellow-500/20' :
                            'bg-emerald-500/10 border-emerald-500/20'
                          }`}
                        >
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </div>
                          <div className={`text-2xl font-bold ${getValueColor(result)}`}>
                            {formatValue(result)}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              result.risk_level === 'High' ? 'bg-red-500 text-white' :
                              result.risk_level === 'Moderate' ? 'bg-yellow-500 text-white' :
                              'bg-emerald-500 text-white'
                            }`}>
                              {result.risk_level}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {(result.probability * 100).toFixed(1)}% prob
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(selectedHistoryItem.predictions).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-4 rounded-xl border-2 ${getValueColor(value).replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} bg-opacity-10 border-opacity-20`}
                        >
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </div>
                          <div className={`text-2xl font-bold ${getValueColor(value)}`}>
                            {formatValue(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      exportToPDF(selectedHistoryItem.predictions, selectedHistoryItem.patientName)
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Export PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      exportToCSV(selectedHistoryItem.predictions, selectedHistoryItem.patientName)
                    }}
                    className="flex items-center gap-2 px-6 py-3 glass-effect-strong rounded-xl font-semibold hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      exportToExcel(selectedHistoryItem.predictions, selectedHistoryItem.patientName)
                    }}
                    className="flex items-center gap-2 px-6 py-3 glass-effect-strong rounded-xl font-semibold hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Export Excel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      deleteHistoryItem(selectedHistoryItem.id)
                      setSelectedItem(null)
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

