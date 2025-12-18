import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TextPressure from '../components/TextPressure'
import { getBestsellers, getNewReleases } from '../lib/googleBooksApi'

const HomePage = () => {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [bestsellers, setBestsellers] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true)
      try {
        const [bestsellerData, newReleaseData] = await Promise.all([
          getBestsellers(6),
          getNewReleases(4)
        ])
        setBestsellers(bestsellerData || [])
        setNewReleases(newReleaseData || [])
      } catch (error) {
        console.error('책 데이터 로드 오류:', error)
        // 에러 발생 시 빈 배열 유지
        setBestsellers([])
        setNewReleases([])
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()
  }, [])

  const banners = [
    {
      type: 'brand',
      title: 'BookLens',
      subtitle: '당신의 다음 책을 찾아보세요',
    },
    {
      type: 'promo',
      title: '신규 회원 30일 무료',
      subtitle: '지금 가입하고 모든 책을 무제한으로 읽어보세요',
    },
    {
      type: 'feature',
      title: 'AI 추천 서비스',
      subtitle: '당신의 취향에 맞는 책을 추천해드립니다',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
              BookLens
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              당신의 독서 여정을 기록하고 공유하세요
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/signup"
                className="bg-gray-900 text-white px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium text-sm"
              >
                시작하기
              </Link>
              <Link
                to="/mylibrary"
                className="bg-white text-gray-900 px-8 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
              >
                내 서재
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bestseller Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">베스트셀러</h2>
          <p className="text-gray-500 text-[15px]">지금 가장 많이 읽히는 책들</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900"></div>
          </div>
        ) : bestsellers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bestsellers.map((book, index) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
                  {book.thumbnail ? (
                    <div className="w-full aspect-[2/3] mb-3 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl">📚</div>'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[2/3] mb-3 rounded-lg bg-gray-50 flex items-center justify-center text-4xl">📚</div>
                  )}
                  <div>
                    <div className="text-xs text-gray-400 mb-1.5 font-medium">#{index + 1}</div>
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-[13px] leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-[12px] line-clamp-1">{book.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-sm">책 데이터를 불러올 수 없습니다.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">독서를 시작해보세요</h3>
          <p className="text-gray-600 mb-8 text-[15px]">
            첫 책을 추가하고 독서 여정을 기록하세요
          </p>
          <Link
            to="/signup"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium text-sm"
          >
            가입하기
          </Link>
        </div>
      </section>

      {/* New Releases Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">신간 도서</h2>
          <p className="text-gray-500 text-[15px]">새롭게 출간된 책들을 만나보세요</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900"></div>
          </div>
        ) : newReleases.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newReleases.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200">
                  {book.thumbnail ? (
                    <div className="w-full aspect-[2/3] mb-3 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl">📚</div>'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[2/3] mb-3 rounded-lg bg-gray-50 flex items-center justify-center text-4xl">📚</div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-[13px] leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-[12px] line-clamp-1">{book.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-sm">신간 도서를 불러올 수 없습니다.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-32">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">BookLens</h3>
              <p className="text-gray-500 text-sm">
                당신의 독서 여정을 함께합니다
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-sm">서비스</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition-colors">도서 목록</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">베스트셀러</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">신간 도서</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-sm">회사</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition-colors">소개</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">이용약관</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">개인정보처리방침</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4 text-sm">고객지원</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition-colors">문의하기</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">자주 묻는 질문</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">공지사항</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 BookLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
