import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ConditionalNavbar from './components/ConditionalNavbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import GalleryPage from './pages/GalleryPage'
import BookDetailPage from './pages/BookDetailPage'
import MapPage from './pages/MapPage'
import MyLibraryPage from './pages/MyLibraryPage'
import PostingPage from './pages/PostingPage'
import CommunityPage from './pages/CommunityPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <ConditionalNavbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/mylibrary" element={<MyLibraryPage />} />
            <Route path="/posting" element={<PostingPage />} />
            <Route path="/community" element={<CommunityPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
