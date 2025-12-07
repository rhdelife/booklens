import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PostingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const book = location.state?.book
  const editingPosting = location.state?.editingPosting
  const isEditing = !!editingPosting

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    tags: ''
  })

  useEffect(() => {
    // 책 정보가 없으면 마이라이브러리로 리다이렉트
    if (!book) {
      navigate('/mylibrary')
      return
    }

    // 수정 모드일 때 기존 포스팅 데이터 로드
    if (isEditing && editingPosting) {
      setFormData({
        title: editingPosting.title || '',
        content: editingPosting.content || '',
        rating: editingPosting.rating || 5,
        tags: editingPosting.tags ? editingPosting.tags.join(', ') : ''
      })
    }
  }, [book, navigate, isEditing, editingPosting])

  if (!book) {
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    try {
      const existingPostings = JSON.parse(localStorage.getItem('bookPostings') || '[]')
      
      if (isEditing && editingPosting) {
        // 수정 모드: 기존 포스팅 업데이트
        const updatedPostings = existingPostings.map(p => {
          if (p.id === editingPosting.id) {
            return {
              ...p,
              title: formData.title || `${book.title} 독후감`,
              content: formData.content,
              rating: formData.rating,
              tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
              updatedAt: new Date().toISOString()
            }
          }
          return p
        })
        localStorage.setItem('bookPostings', JSON.stringify(updatedPostings))
        
        // 완료 후 커뮤니티 페이지로 이동
        navigate('/community', { 
          state: { 
            message: '포스팅이 수정되었습니다!',
            postingId: editingPosting.id,
            filterMyPosts: true
          }
        })
      } else {
        // 새 포스팅 작성
        const posting = {
          id: Date.now(),
          authorId: user?.id || null,
          userId: user?.id || null,
          authorName: user?.name || user?.email?.split('@')[0] || '익명',
          userName: user?.name || user?.email?.split('@')[0] || '익명',
          userEmail: user?.email || '',
          bookId: book.id,
          bookTitle: book.title,
          bookAuthor: book.author,
          bookThumbnail: book.thumbnail || '',
          title: formData.title || `${book.title} 독후감`,
          content: formData.content,
          rating: formData.rating,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          createdAt: new Date().toISOString(),
          completedDate: book.completedDate
        }

        existingPostings.push(posting)
        localStorage.setItem('bookPostings', JSON.stringify(existingPostings))

        // 완료 후 커뮤니티 페이지로 이동
        navigate('/community', { 
          state: { 
            message: '포스팅이 작성되었습니다!',
            postingId: posting.id
          }
        })
      }
    } catch (error) {
      console.error('Failed to save posting:', error)
      alert('포스팅 저장에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/mylibrary')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isEditing ? '독서 포스팅 수정' : '독서 포스팅 작성'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? '포스팅을 수정해보세요' : '완독한 책에 대한 생각을 공유해보세요'}
          </p>
        </div>

        {/* Book Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-4">{book.author}</p>
              {book.completedDate && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>완독일:</span>
                  <span className="font-semibold">{book.completedDate}</span>
                </div>
              )}
            </div>
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
              완독
            </div>
          </div>
        </div>

        {/* Posting Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                포스팅 제목 <span className="text-gray-400">(선택)</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`${book.title} 독후감`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <p className="text-xs text-gray-500 mt-1">제목을 입력하지 않으면 기본 제목이 사용됩니다.</p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평점
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-3xl transition-transform hover:scale-110 ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-gray-600 font-semibold">{formData.rating}점</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="이 책을 읽고 느낀 점, 인상 깊었던 부분, 추천하는 이유 등을 자유롭게 작성해주세요..."
                rows={12}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.content.length}자
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그 <span className="text-gray-400">(선택)</span>
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="예: 소설, 추리, 감동 (쉼표로 구분)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <p className="text-xs text-gray-500 mt-1">태그를 쉼표로 구분하여 입력하세요.</p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/mylibrary')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!formData.content.trim()}
                className="flex-1 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isEditing ? '포스팅 수정하기' : '포스팅 작성하기'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostingPage

