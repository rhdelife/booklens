import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBookById } from '../lib/googleBooksApi'

const BookDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('intro')
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        setError('책 ID가 없습니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const bookData = await getBookById(id)
        setBook(bookData)
      } catch (err) {
        console.error('책 정보 로드 오류:', err)
        setError('책 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadBook()
  }, [id])

  const bookstores = [
    { name: '교보문고', url: 'https://www.kyobobook.co.kr' },
    { name: '알라딘', url: 'https://www.aladin.co.kr' },
    { name: 'YES24', url: 'https://www.yes24.com' },
    { name: '영풍문고', url: 'https://www.ypbooks.co.kr' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-500 mb-4"></div>
            <p className="text-gray-600">책 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-brand-600 hover:text-brand-700 font-medium flex items-center gap-2"
          >
            ← 뒤로
          </button>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-800">{error || '책 정보를 찾을 수 없습니다.'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-brand-600 hover:text-brand-700 font-medium flex items-center gap-2"
        >
          ← 뒤로
        </button>

        {/* Book Header Section */}
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              {book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450/22c55e/ffffff?text=Book'
                  }}
                />
              ) : (
                <div className="w-64 h-96 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center text-6xl">
                  📚
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
              {book.subtitle && (
                <h2 className="text-xl text-gray-600 mb-4">{book.subtitle}</h2>
              )}
              
              <div className="mb-6">
                <p className="text-lg text-gray-700 mb-1">
                  저자 {book.author} {book.publisher && `| 출판사 ${book.publisher}`}
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  {book.publishedDate && <p>발행일 {book.publishedDate}</p>}
                  {book.isbn && <p>ISBN {book.isbn}</p>}
                  {book.pages > 0 && <p>{book.pages}쪽</p>}
                </div>
                {book.averageRating > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= Math.round(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {book.averageRating.toFixed(1)} ({book.ratingsCount}개 평가)
                    </span>
                  </div>
                )}
              </div>

              {/* Bookstore Links */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">도서 판매처 바로가기</h3>
                <div className="flex flex-wrap gap-3">
                  {bookstores.map((store) => (
                    <a
                      key={store.name}
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 hover:bg-brand-500 hover:text-white text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      {store.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'intro', label: '책 소개' },
                { id: 'contents', label: '목차' },
                { id: 'author', label: '저자 소개' },
                { id: 'recommendations', label: '추천사' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'intro' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">책 소개</h2>
                {book.description ? (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    <p>{book.description}</p>
                    {book.categories && book.categories.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-600 mb-2">카테고리:</p>
                        <div className="flex flex-wrap gap-2">
                          {book.categories.map((category, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">책 소개 내용이 없습니다.</p>
                )}
              </div>
            )}

            {activeTab === 'contents' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">목차</h2>
                <ul className="space-y-2">
                  {book.tableOfContents && book.tableOfContents.length > 0 ? (
                    book.tableOfContents.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {typeof item === 'string' ? item : item.title || item}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">목차 정보가 없습니다.</li>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'author' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">저자 소개</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {book.authors && book.authors.length > 0 ? (
                    <>
                      <p className="font-semibold mb-2">저자: {book.authors.join(', ')}</p>
                      <p className="text-gray-500">저자 상세 정보는 Google Books에서 확인하실 수 있습니다.</p>
                      {book.infoLink && (
                        <a
                          href={book.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:text-brand-700 underline mt-2 inline-block"
                        >
                          Google Books에서 더 보기 →
                        </a>
                      )}
                    </>
                  ) : (
                    '저자 소개 내용이 없습니다.'
                  )}
                </p>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">추가 정보</h2>
                <div className="space-y-4">
                  {book.previewLink && (
                    <a
                      href={book.previewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-center font-medium"
                    >
                      미리보기
                    </a>
                  )}
                  {book.infoLink && (
                    <a
                      href={book.infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
                    >
                      Google Books에서 더 보기
                    </a>
                  )}
                  {!book.previewLink && !book.infoLink && (
                    <p className="text-gray-500">추가 정보가 없습니다.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage

