import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  X, 
  Zap, 
  Shield, 
  Globe, 
  Download, 
  Clock, 
  Star, 
  Crown, 
  ArrowRight, 
  Sparkles,
  FileText,
  HelpCircle,
  Loader2
} from 'lucide-react'
import { usePremium } from '../hooks/usePremium'
import { useNavigate } from 'react-router-dom'

export default function Premium() {
  const { isPremium, subscribe } = usePremium()
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    // Simulate payment processing
    setSelectedPlan(plan)
    setTimeout(() => {
      subscribe(plan)
      setShowSuccess(true)
      setTimeout(() => {
        navigate('/upload')
      }, 2000)
    }, 1500)
  }

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Processing',
      description: 'Get results in under 2 seconds with priority processing',
      free: false,
      premium: true,
    },
    {
      icon: Download,
      title: 'Multiple Export Formats',
      description: 'Export to PDF, CSV, Excel, and JSON formats',
      free: false,
      premium: true,
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Access the platform in English, French, and Spanish',
      free: false,
      premium: true,
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: '24/7 priority customer support with faster response times',
      free: false,
      premium: true,
    },
    {
      icon: Clock,
      title: 'Unlimited Uploads',
      description: 'No limits on the number of X-ray images you can analyze',
      free: 'Limited',
      premium: 'Unlimited',
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Comprehensive analysis reports with visualizations',
      free: 'Basic',
      premium: 'Advanced',
    },
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Radiologist',
      image: '👩‍⚕️',
      rating: 5,
      text: 'XRayAI Premium has transformed my workflow. The speed and accuracy are unmatched.',
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Emergency Physician',
      image: '👨‍⚕️',
      rating: 5,
      text: 'The multi-language support and export features make it perfect for our international team.',
    },
    {
      name: 'Dr. Emily Johnson',
      role: 'Clinical Director',
      image: '👩‍⚕️',
      rating: 5,
      text: 'Worth every penny. The priority processing saves us hours every week.',
    },
  ]

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through Stripe.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
    },
    {
      question: 'What happens if I upgrade mid-cycle?',
      answer: 'You\'ll get immediate access to all premium features. We\'ll prorate your billing for the remainder of the cycle.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption and never share your medical data with third parties.',
    },
  ]

  const pricingPlans = {
    monthly: {
      price: 29,
      period: 'month',
      savings: null,
    },
    yearly: {
      price: 290,
      period: 'year',
      savings: 'Save 17%',
      originalPrice: 348,
    },
  }

  return (
    <div className="relative min-h-screen overflow-hidden particle-bg">
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

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-effect-strong rounded-3xl p-8 max-w-md w-full mx-4 text-center premium-shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Welcome to Premium!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your subscription is active. Redirecting to upload page...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect-strong border border-primary-200 dark:border-primary-800 mb-6"
            >
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                Unlock Premium Features
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">Go Premium</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Unlock the full power of AI-driven X-ray analysis with faster processing, advanced exports, and priority support.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-primary-500/50 transition-all duration-300"
              >
                View Pricing
                <ArrowRight className="w-5 h-5 inline-block ml-2" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Free vs Premium
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what you get with Premium
            </p>
          </motion.div>

          <div className="glass-effect-strong rounded-3xl p-8 premium-shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Feature</h3>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400">Free</h3>
              </div>
              <div className="text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    PREMIUM
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-4">Premium</h3>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="grid grid-cols-3 gap-4 py-4 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    {feature.free === false ? (
                      <X className="w-6 h-6 text-gray-400" />
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {feature.free}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Flexible pricing that scales with your needs
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 glass-effect-strong rounded-full p-2">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 relative ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Yearly
                {billingCycle === 'yearly' && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded-full">
                    Save 17%
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-effect-strong rounded-3xl p-8 premium-shadow border-2 border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-600 dark:text-gray-400">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Basic X-ray analysis</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>Limited uploads per day</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <X className="w-5 h-5 text-gray-400" />
                  <span className="line-through">Export formats</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <X className="w-5 h-5 text-gray-400" />
                  <span className="line-through">Priority support</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/upload')}
                className="w-full py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Get Started Free
              </button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative glass-effect-strong rounded-3xl p-8 premium-shadow-lg border-2 border-primary-500 overflow-hidden"
            >
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-purple-600 text-white px-6 py-2 rounded-bl-2xl">
                <span className="text-sm font-bold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Most Popular
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Premium</h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold gradient-text">
                      ${pricingPlans[billingCycle].price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{pricingPlans[billingCycle].period}
                    </span>
                  </div>
                  {pricingPlans[billingCycle].savings && (
                    <div className="mt-2">
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        {pricingPlans[billingCycle].savings}
                      </span>
                      {billingCycle === 'yearly' && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${pricingPlans.yearly.originalPrice}/year
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="font-semibold">Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>Lightning-fast processing</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>All export formats (PDF, CSV, Excel, JSON)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>Multi-language support</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>Unlimited uploads</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>24/7 Priority support</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubscribe(billingCycle)}
                  disabled={selectedPlan !== null}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {selectedPlan === billingCycle ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-5 h-5" />
                      </motion.div>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">Subscribe Now</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-700 to-pink-700"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </>
                  )}
                </motion.button>
                {isPremium && (
                  <p className="text-center mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ You're already a Premium member!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Loved by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our Premium users are saying
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{ y: -5 }}
                className="glass-effect-strong rounded-3xl p-8 premium-shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about Premium
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative glass-effect-strong rounded-3xl p-12 md:p-16 text-center premium-shadow-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Crown className="w-16 h-16 text-yellow-500" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Ready to Go Premium?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of healthcare professionals using XRayAI Premium
              </p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-10 py-5 bg-gradient-to-r from-primary-500 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-primary-500/50 transition-all duration-300"
              >
                Start Your Premium Journey
                <ArrowRight className="w-5 h-5 inline-block ml-2" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// FAQ Item Component
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass-effect-strong rounded-2xl overflow-hidden premium-shadow"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
          <span className="font-semibold text-gray-900 dark:text-white">{question}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

