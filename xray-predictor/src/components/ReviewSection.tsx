import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, ThumbsUp, Trash2, MessageSquare } from 'lucide-react'
import { useReviews, type Review } from '../hooks/useReviews'
import { useAuth } from '../hooks/useAuth'

interface ReviewSectionProps {
  analysisId: string
}

export default function ReviewSection({ analysisId }: ReviewSectionProps) {
  const { currentUser } = useAuth()
  const { reviews, addReview, getReviewsByAnalysisId, markHelpful, deleteReview } = useReviews()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const analysisReviews = getReviewsByAnalysisId(analysisId)
  const userReview = analysisReviews.find(r => r.userName === currentUser?.displayName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please select a rating')
      return
    }
    if (!comment.trim()) {
      alert('Please write a comment')
      return
    }

    addReview(analysisId, rating, comment, currentUser?.displayName || 'Anonymous')
    setRating(0)
    setComment('')
    setSubmitted(true)
    setShowForm(false)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const averageRating = analysisReviews.length > 0
    ? analysisReviews.reduce((sum, r) => sum + r.rating, 0) / analysisReviews.length
    : 0

  return (
    <div className="mt-8 space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Reviews & Feedback
          </h3>
          {analysisReviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= averageRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {averageRating.toFixed(1)} ({analysisReviews.length} {analysisReviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        {!userReview && !showForm && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
          >
            Write Review
          </motion.button>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && !userReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-effect-strong rounded-2xl p-6 border-2 border-primary-200 dark:border-primary-800"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-all ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this analysis..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Review
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setRating(0)
                    setComment('')
                  }}
                  className="px-6 py-3 glass-effect-strong rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl"
          >
            <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
              ✓ Thank you for your review!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {analysisReviews.length > 0 && (
        <div className="space-y-4">
          {analysisReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect-strong rounded-xl p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {review.userName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
                {review.userName === currentUser?.displayName && (
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => markHelpful(review.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful {review.helpful ? `(${review.helpful})` : ''}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {analysisReviews.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No reviews yet. Be the first to review this analysis!</p>
        </div>
      )}
    </div>
  )
}

