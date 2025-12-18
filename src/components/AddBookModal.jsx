import { useState } from 'react'

const AddBookModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    thumbnail: '',
    status: 'reading',
    progress: 0,
    returnDate: '',
    isRental: false,
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title && formData.author) {
      onAdd({
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      })
      setFormData({
        title: '',
        author: '',
        genre: '',
        thumbnail: '',
        status: 'reading',
        progress: 0,
        returnDate: '',
        isRental: false,
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-gray-100">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">새 책 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              제목 *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
              placeholder="책 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              작가 *
            </label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
              placeholder="작가명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              장르
            </label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
              placeholder="장르를 입력하세요 (예: 소설, 에세이)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              썸네일 URL
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
              placeholder="이미지 URL을 입력하세요"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRental"
              checked={formData.isRental}
              onChange={(e) => setFormData({ ...formData, isRental: e.target.checked })}
              className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
            />
            <label htmlFor="isRental" className="ml-2 text-sm text-gray-600">
              대여한 책
            </label>
          </div>

          {formData.isRental && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                반납일
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 text-sm"
            >
              추가
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 border border-gray-200 transition-all duration-200 text-sm"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal
















