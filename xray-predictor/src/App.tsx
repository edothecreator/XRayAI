import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import { CreditProvider } from './hooks/useCredits'
import { HistoryProvider } from './hooks/useHistory'
import { AuthProvider } from './hooks/useAuth'
import { ReviewsProvider } from './hooks/useReviews'
import { ErrorBoundary } from './components/ErrorBoundary'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Upload from './pages/Upload'
import About from './pages/About'
import Contact from './pages/Contact'
import Credits from './pages/Credits'
import History from './pages/History'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CreditProvider>
            <HistoryProvider>
              <ReviewsProvider>
                <Layout>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                      path="/upload"
                      element={
                        <ProtectedRoute>
                          <Upload />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/history" element={<History />} />
                    <Route path="/credits" element={<Credits />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
                </Layout>
              </ReviewsProvider>
            </HistoryProvider>
          </CreditProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

