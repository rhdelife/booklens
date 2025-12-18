import { useState } from 'react'

const BookDetailModal = ({ book, isOpen, onClose, onUpdate, onPost }) => {
  const [memo, setMemo] = useState(book?.memo || '')
  const [progress, setProgress] = useState(book?.progress || 0)
  const [showPostForm, setShowPostForm] = useState(false)
  const [postImage, setPostImage] = useState(null)
  const [postText, setPostText] = useState('')

  if (!isOpen || !book) return null

  const handleSave = () => {
    onUpdate({
      ...book,
      memo,
      progress,
    })
    onClose()
  }

  const handleComplete = () => {
    onUpdate({
      ...book,
      progress: 100,
      status: 'completed',
    })
    onClose()
  }

  const handlePostSubmit = () => {
    if (postText.trim()) {
      onPost({
        bookId: book.id,
        bookTitle: book.title,
        image: postImage,
        text: postText,
        createdAt: new Date().toISOString(),
      })
      setShowPostForm(false)
      setPostImage(null)
      setPostText('')
      onClose()
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPostImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">책 상세 정보</h2>
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
        <div className="p-6 space-y-6">
          {/* Book Info */}
          <div className="flex gap-6">
            <img
              src={book.thumbnail || `https://via.placeholder.com/200x280/22c55e/ffffff?text=${encodeURIComponent(book.title.charAt(0))}`}
              alt={book.title}
              className="w-40 h-56 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{book.title}</h3>
              <p className="text-gray-500 mb-2">작가: {book.author}</p>
              <p className="text-gray-500 mb-4">장르: {book.genre}</p>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">진행률</span>
                  <span className="text-sm font-semibold text-gray-900">{progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
              </div>
              {book.status === 'reading' && (
                <button
                  onClick={handleComplete}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 text-sm"
                >
                  완독 처리
                </button>
              )}
            </div>
          </div>

          {/* Memo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              메모
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="이 책에 대한 메모를 작성하세요..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all min-h-[120px] text-sm"
            />
          </div>

          {/* Post Button */}
          <div>
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 text-sm"
            >
              {showPostForm ? '포스팅 취소' : '포스팅 작성'}
            </button>
          </div>

          {/* Post Form */}
          {showPostForm && (
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm">새 포스트 작성</h4>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  이미지 업로드
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="post-image"
                  />
                  <label
                    htmlFor="post-image"
                    className="px-4 py-2 bg-white text-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 border border-gray-200 transition-all duration-200 text-sm"
                  >
                    이미지 선택
                  </label>
                  {postImage && (
                    <img
                      src={postImage}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  )}
                </div>
              </div>

              {/* Text */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  본문
                </label>
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="포스트 내용을 작성하세요..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all min-h-[120px] text-sm"
                />
              </div>

              <button
                onClick={handlePostSubmit}
                disabled={!postText.trim()}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                포스트 저장
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 text-sm"
            >
              저장
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 border border-gray-200 transition-all duration-200 text-sm"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailModal
















