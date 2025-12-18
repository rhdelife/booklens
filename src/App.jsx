import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ConditionalNavbar from './components/ConditionalNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import GalleryPage from './pages/GalleryPage'
import BookDetailPage from './pages/BookDetailPage'
import MapPage from './pages/MapPage'
import MyLibraryPage from './pages/MyLibraryPage'
import PostingPage from './pages/PostingPage'
import CommunityPage from './pages/CommunityPage'
import OAuthCallbackPage from './pages/OAuthCallbackPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <ConditionalNavbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/community" element={<CommunityPage />} />
            
            {/* OAuth Callback Routes */}
            <Route path="/auth/google/callback" element={<OAuthCallbackPage />} />
            <Route path="/auth/naver/callback" element={<OAuthCallbackPage />} />

            {/* Protected Routes - 인증이 필요한 페이지 */}
            <Route
              path="/mylibrary"
              element={
                <ProtectedRoute>
                  <MyLibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posting"
              element={
                <ProtectedRoute>
                  <PostingPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
