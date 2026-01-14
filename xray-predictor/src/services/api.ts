import axios from 'axios'

// Use proxy in development to avoid CORS issues, or use direct URL from env
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? '/api/predict'  // Use Vite proxy in development
    : 'https://uninfusive-pleasureful-jule.ngrok-free.dev/predict')  // Direct URL in production

// Check if the URL is a ngrok URL and needs bypass headers
const isNgrokUrl = (url: string) => url.includes('ngrok-free.dev') || url.includes('ngrok.io')

const api = axios.create({
  baseURL: API_URL,
})

// Add request interceptor for ngrok bypass headers
api.interceptors.request.use((config) => {
  if (isNgrokUrl(config.baseURL || '')) {
    config.headers['ngrok-skip-browser-warning'] = 'true'
  }
  return config
})

export interface ConditionResult {
  probability: number
  percentage: number
  risk_level: 'Low' | 'Moderate' | 'High'
}

export interface PredictionResponse {
  model: string
  type: string
  disclaimer: string
  results: {
    [condition: string]: ConditionResult
  }
}

export const uploadXRay = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const fullUrl = `${API_URL}`
  console.log('Uploading to:', fullUrl)
  console.log('File name:', file.name, 'File size:', file.size, 'File type:', file.type)

  try {
    // Don't set Content-Type header - axios will set it automatically with the correct boundary for FormData
    const response = await api.post<PredictionResponse>('', formData, {
      headers: {
        // Explicitly set ngrok bypass header in the request
        'ngrok-skip-browser-warning': 'true',
      },
    })
    console.log('Upload successful:', response.data)
    return response.data
  } catch (error) {
    console.error('Upload error:', error)
    
    if (axios.isAxiosError(error)) {
      // Provide more detailed error messages
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.detail || 
                            error.response.data?.message || 
                            error.response.data?.error ||
                            `Server error: ${error.response.status} ${error.response.statusText}`
        console.error('Server error response:', error.response.status, error.response.data)
        throw new Error(errorMessage)
      } else if (error.request) {
        // Request was made but no response received - likely CORS or network issue
        console.error('No response received. Request details:', {
          url: fullUrl,
          method: 'POST',
          headers: error.config?.headers,
        })
        
        // Check if it's a CORS error
        if (error.code === 'ERR_NETWORK' || error.message.includes('CORS') || error.message.includes('Network Error')) {
          throw new Error('CORS error: The API server needs to allow requests from this origin. Please check CORS settings on the backend server.')
        }
        
        throw new Error('No response from server. Please check if the API server is running and the URL is correct.')
      } else {
        // Error setting up the request
        console.error('Request setup error:', error.message)
        throw new Error(`Request error: ${error.message}`)
      }
    }
    throw new Error('An unexpected error occurred while uploading the image')
  }
}

export default api

