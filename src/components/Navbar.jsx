import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ProfileModal from './ProfileModal'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Compressa VF';
          src: url('https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2');
          font-style: normal;
        }
        .logo-compressa {
          font-family: 'Compressa VF', sans-serif;
          text-transform: uppercase;
          font-weight: 300;
        }
      `}</style>
      <nav className=" sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-[40px] logo-compressa font-extrabold text-brand-600">BookLens</h1>
            </Link>

            {/* Navigation Menu */}
            <div className="relative flex items-center space-x-12">
              <Link
                to="/"
                className="text-[20px] text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/mylibrary"
                className="text-[20px] text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                MyLibrary
              </Link>
              <Link
                to="/community"
                className="text-[20px] text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                Community
              </Link>
              <Link
                to="/gallery"
                className="text-[20px] text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                Gallery
              </Link>
              <Link
                to="/map"
                className="text-[20px] text-gray-700 hover:text-brand-600 transition-colors font-medium"
              >
                Map
              </Link>
            </div>

            {/* User Profile / Login */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src="/midoriya.jpg"
                        alt="Profile"
                        onClick={() => setShowProfileModal(true)}
                        className="w-10 h-10 rounded-full object-cover border-2 border-brand-200 hover:border-brand-400 transition-colors cursor-pointer"
                      />
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-gray-700 text-sm font-medium">
                        {user?.name || user?.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors font-medium"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />
    </>
  )
}

export default Navbar


