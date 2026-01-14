import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'

// Initialize i18n with error handling to prevent blocking
try {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
        es: { translation: es },
      },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      // Don't throw errors if translation keys are missing
      react: {
        useSuspense: false,
      },
    })
    .catch((error) => {
      console.warn('i18n initialization warning:', error)
    })
} catch (error) {
  console.error('i18n initialization error:', error)
  // Initialize with empty resources to prevent crashes
  try {
    i18n.use(initReactI18next).init({
      resources: { en: { translation: {} } },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    })
  } catch (fallbackError) {
    console.error('i18n fallback initialization also failed:', fallbackError)
  }
}

export default i18n

