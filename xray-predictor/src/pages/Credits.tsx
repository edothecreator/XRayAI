import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Check, Zap, Crown, TrendingUp, ArrowRight, CreditCard, Gift } from 'lucide-react'
import { useCredits, CREDIT_PACKAGES } from '../hooks/useCredits'

export default function Credits() {
  const { credits, freeCreditsUsed, purchaseCredits } = useCredits()
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const handlePurchase = async (packageId: string) => {
    setPurchasing(packageId)
    setPurchaseSuccess(false)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      purchaseCredits(packageId)
      setPurchaseSuccess(true)
      setTimeout(() => setPurchaseSuccess(false), 3000)
    } catch (error) {
      console.error('Purchase failed:', error)
    } finally {
      setPurchasing(null)
    }
  }

  const freeCreditsRemaining = Math.max(0, 3 - freeCreditsUsed)
  const hasFreeCredits = freeCreditsRemaining > 0

  return (
    <div className="min-h-screen relative overflow-hidden particle-bg py-20 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-purple-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-cyan-400/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
          <h1 className="text-5xl font-bold mb-4 gradient-text">Credit Packages</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Purchase credits to analyze X-ray images. 1 credit = 1 analysis.
          </p>

          {/* Current Credits Display */}
          <div className="inline-flex items-center gap-4 glass-effect-strong rounded-2xl px-8 py-4 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">{credits}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Credits</div>
            </div>
            {hasFreeCredits && (
              <>
                <div className="w-px h-12 bg-gray-300 dark:bg-gray-600" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{freeCreditsRemaining}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Free Credits Left</div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Success Message */}
        {purchaseSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl text-center"
          >
            <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
              ✓ Credits purchased successfully!
            </p>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {Object.entries(CREDIT_PACKAGES).map(([packageId, packageData], index) => {
            const isPopular = packageData.popular
            const pricePerCredit = (packageData.price / packageData.credits).toFixed(2)
            
            return (
              <motion.div
                key={packageId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative glass-effect-strong rounded-3xl p-8 premium-shadow-lg ${
                  isPopular ? 'ring-4 ring-yellow-400/50 scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4" />
                      Most Popular
                    </motion.div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 gradient-text">{packageData.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">${packageData.price}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {packageData.credits} Credits
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                    ${pricePerCredit} per credit
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{packageData.credits} X-ray analyses</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>Instant credit delivery</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>No expiration date</span>
                  </li>
                  {isPopular && (
                    <li className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400 font-semibold">
                      <TrendingUp className="w-5 h-5 flex-shrink-0" />
                      <span>Best value per credit</span>
                    </li>
                  )}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase(packageId)}
                  disabled={purchasing !== null}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white hover:shadow-yellow-500/50'
                      : 'bg-gradient-to-r from-primary-500 via-purple-600 to-pink-600 text-white hover:shadow-primary-500/50'
                  }`}
                >
                  {purchasing === packageId ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Purchase Now
                    </>
                  )}
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect-strong rounded-3xl p-8 text-center"
        >
          <Gift className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4 gradient-text">New User Bonus</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get 3 free credits when you sign up! Use them to try our AI-powered X-ray analysis.
          </p>
          {hasFreeCredits && (
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
              You have {freeCreditsRemaining} free credit{freeCreditsRemaining !== 1 ? 's' : ''} remaining
            </p>
          )}
        </motion.div>

        {/* Back to Upload */}
        <div className="text-center mt-12">
          <Link to="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <ArrowRight className="w-5 h-5" />
              Go to Upload
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  )
}


