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
    <div className="min-h-screen bg-gradient-to-b from-brand-300 to-white">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative h-[500px] rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              {currentBanner === 0 ? (
                <div className="text-center w-full px-8">
                  <div className="h-64 flex items-center justify-center mb-6">
                    <TextPressure
                      text="BookLens"
                      textColor="#FFFFFF"
                      width={true}
                      weight={true}
                      italic={true}
                      className="flex"
                      minFontSize={48}
                    />
                  </div>


                </div>
              ) : (
                <div className="text-center w-full px-8">
                  <h2 className="text-5xl font-bold text-white mb-4">
                    {banners[currentBanner].title}
                  </h2>
                  <p className="text-white/90 text-xl font-light">
                    {banners[currentBanner].subtitle}
                  </p>
                  <div className="mt-8">
                    <Link
                      to="/signup"
                      className="bg-white text-brand-600 px-8 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors shadow-lg inline-block"
                    >
                      지금 시작하기
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Banner Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-all ${currentBanner === index
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bestseller Chart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">베스트셀러</h2>
          <p className="text-gray-600">지금 가장 많이 읽히는 책들</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        ) : bestsellers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {bestsellers.map((book, index) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="group cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  {book.thumbnail ? (
                    <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = '<div class="text-6xl text-center pt-8">📚</div>'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-6xl mb-4 text-center">📚</div>
                  )}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-brand-500 font-bold text-lg">#{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-1">{book.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>책 데이터를 불러올 수 없습니다.</p>
          </div>
        )}
      </section>

      {/* Advertisement Banner 1 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-12 text-center text-white shadow-xl">
          <h3 className="text-3xl font-bold mb-4">신규 회원 특별 혜택</h3>
          <p className="text-xl mb-6 text-white/90">
            첫 달 무료 이용 + 인기 도서 3권 무료 다운로드
          </p>
          <Link
            to="/signup"
            className="bg-white text-brand-600 px-8 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors shadow-lg inline-block"
          >
            지금 가입하기
          </Link>
        </div>
      </section>

      {/* New Releases Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">신간 도서</h2>
          <p className="text-gray-600">새롭게 출간된 책들을 만나보세요</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        ) : newReleases.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newReleases.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="group cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  {book.thumbnail ? (
                    <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = '<div class="text-6xl text-center pt-8">📚</div>'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-6xl mb-4 text-center">📚</div>
                  )}
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                      {book.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-1">{book.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>신간 도서를 불러올 수 없습니다.</p>
          </div>
        )}
      </section>

      {/* Advertisement Banner 2 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-brand-400 to-brand-500 rounded-2xl p-12 text-center text-white shadow-xl">
          <h3 className="text-3xl font-bold mb-4">모바일 앱 출시 기념</h3>
          <p className="text-xl mb-6 text-white/90">
            언제 어디서나 책을 읽어보세요. iOS & Android 지원
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-brand-600 px-6 py-2 rounded-lg font-semibold hover:bg-brand-50 transition-colors shadow-lg">
              App Store
            </button>
            <button className="bg-white text-brand-600 px-6 py-2 rounded-lg font-semibold hover:bg-brand-50 transition-colors shadow-lg">
              Google Play
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-600 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-Compressa font-bold text-brand-400 mb-4">BOOKLENS</h3>
              <p className="text-gray-400">
                당신의 독서 여정을 함께합니다
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">도서 목록</a></li>
                <li><a href="#" className="hover:text-white">베스트셀러</a></li>
                <li><a href="#" className="hover:text-white">신간 도서</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">소개</a></li>
                <li><a href="#" className="hover:text-white">이용약관</a></li>
                <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">고객지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">문의하기</a></li>
                <li><a href="#" className="hover:text-white">자주 묻는 질문</a></li>
                <li><a href="#" className="hover:text-white">공지사항</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BookLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
