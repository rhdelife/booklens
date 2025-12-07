import React, { useEffect, useState } from 'react'

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [books, setBooks] = useState([])

  // localStorage에서 책 데이터 가져오기
  useEffect(() => {
    if (isOpen) {
      const savedBooks = localStorage.getItem('myLibraryBooks')
      if (savedBooks) {
        try {
          setBooks(JSON.parse(savedBooks))
        } catch (error) {
          console.error('Failed to parse books from localStorage:', error)
        }
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  // 독서 활동 기반 별명 계산 (재미있고 캐주얼한 별명들)
  const calculateAlias = (books) => {
    if (!books || books.length === 0) return '독서 초보'
    
    const totalBooks = books.length
    const completedBooks = books.filter(book => book.status === 'completed').length
    const totalReadingTime = books.reduce((sum, book) => sum + (book.totalReadingTime || 0), 0)
    const totalPages = books.reduce((sum, book) => sum + (book.totalPage || 0), 0)
    
    // 별명 결정 로직 (재미있고 다양한 별명)
    if (completedBooks >= 50) return '킹왕짱'
    if (completedBooks >= 30) return '책벌레 오타쿠'
    if (completedBooks >= 20) return '독서 마니아'
    if (totalReadingTime >= 100000) return '시간의 지배자' // 약 27시간
    if (totalPages >= 10000) return '페이지 마스터'
    if (completedBooks >= 15) return '책 덕후'
    if (completedBooks >= 10) return '열정적인 독서러'
    if (completedBooks >= 5) return '책 애호가'
    if (totalBooks >= 3) return '독서가'
    return '독서 초보'
  }

  // 사용자 정보
  const profileData = {
    nickname: user?.name || '사용자',
    alias: calculateAlias(books),
    bio: '책을 사랑하는 사람입니다. 매일 새로운 이야기를 만나고 있어요.'
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl mx-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">프로필</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <img
              src="/midoriya.jpg"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-brand-200 shadow-lg"
            />
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium">{profileData.nickname}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                별명
              </label>
              <div className="px-4 py-3 bg-gradient-to-r from-brand-100 to-brand-50 rounded-lg border-2 border-brand-300">
                <p className="text-gray-900 font-bold text-lg text-center">{profileData.alias}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                한줄소개
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
                <p className="text-gray-900">{profileData.bio}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-brand-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-600 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal

