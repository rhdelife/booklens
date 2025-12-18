import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Masonry from 'react-masonry-css'
import ProgressSummary from '../components/ProgressSummary'
import GalleryBookCard from '../components/GalleryBookCard'
import TextPressure from '../components/TextPressure'
import { getBooksByPublishers } from '../lib/googleBooksApi'

const GalleryPage = () => {
  const navigate = useNavigate()

  // Book data from Google Books API
  const [books, setBooks] = useState([
    { id: 1, title: '해리포터와 마법사의 돌', author: 'J.K. 롤링', publisher: '문학수첩', publishDate: '2025.08.06', isbn: '9791199364462', pages: 256, size: '132 × 189 mm (양장)', thumbnail: '/bookcover/9781408855652.jpg', isRead: true, isReading: true, currentPage: 180, totalPages: 256, genre: '판타지', series: '해리포터', year: 1997 },
    { id: 2, title: '해리포터와 비밀의 방', author: 'J.K. 롤링', thumbnail: '/bookcover/9788925588735.jpg', isRead: true, genre: '판타지', series: '해리포터', year: 1998 },
    { id: 3, title: '해리포터와 아즈카반의 죄수', author: 'J.K. 롤링', thumbnail: '/bookcover/9788936439743.jpg', isRead: false, genre: '판타지', series: '해리포터', year: 1999 },
    { id: 4, title: '해리포터와 불의 잔', author: 'J.K. 롤링', thumbnail: '/bookcover/9791188331796.jpg', isRead: false, genre: '판타지', series: '해리포터', year: 2000 },
    { id: 5, title: '1984', author: '조지 오웰', thumbnail: '/bookcover/9791193638859.jpg', isRead: true, genre: '디스토피아', series: null, year: 1949 },
    { id: 6, title: '노인과 바다', author: '어니스트 헤밍웨이', thumbnail: '/bookcover/9781408855652.jpg', isRead: true, genre: '소설', series: null, year: 1952 },
    { id: 7, title: '위대한 개츠비', author: 'F. 스콧 피츠제럴드', thumbnail: '/bookcover/9788925588735.jpg', isRead: false, genre: '소설', series: null, year: 1925 },
    { id: 8, title: '토지', author: '박경리', thumbnail: '/bookcover/9788936439743.jpg', isRead: false, genre: '소설', series: '토지', year: 1969 },
    { id: 9, title: '무정', author: '이광수', thumbnail: '/bookcover/9791188331796.jpg', isRead: true, genre: '소설', series: null, year: 1917 },
    { id: 10, title: '데미안', author: '헤르만 헤세', thumbnail: '/bookcover/9791193638859.jpg', isRead: false, genre: '소설', series: null, year: 1919 },
    { id: 11, title: '시드니의 네 가지 계절', author: '데이비드 말루프', thumbnail: '/bookcover/9781408855652.jpg', isRead: true, genre: '소설', series: null, year: 1991 },
    { id: 12, title: '동물농장', author: '조지 오웰', thumbnail: '/bookcover/9788925588735.jpg', isRead: false, genre: '알레고리', series: null, year: 1945 },
    { id: 13, title: '호밀밭의 파수꾼', author: 'J.D. 샐린저', thumbnail: '/bookcover/9788936439743.jpg', isRead: true, genre: '소설', series: null, year: 1951 },
    { id: 14, title: '백년의 고독', author: '가브리엘 가르시아 마르케스', thumbnail: '/bookcover/9791188331796.jpg', isRead: false, genre: '마술적 사실주의', series: null, year: 1967 },
    { id: 15, title: '어린 왕자', author: '앙투안 드 생텍쥐페리', thumbnail: '/bookcover/9791193638859.jpg', isRead: true, genre: '동화', series: null, year: 1943 },
    { id: 16, title: '멋진 신세계', author: '올더스 헉슬리', thumbnail: '/bookcover/9781408855652.jpg', isRead: false, genre: '디스토피아', series: null, year: 1932 },
    { id: 17, title: '파우스트', author: '요한 볼프강 폰 괴테', thumbnail: '/bookcover/9788925588735.jpg', isRead: true, genre: '희곡', series: null, year: 1808 },
    { id: 18, title: '변신', author: '프란츠 카프카', thumbnail: '/bookcover/9788936439743.jpg', isRead: false, genre: '소설', series: null, year: 1915 },
    { id: 19, title: '죄와 벌', author: '표도르 도스토옙스키', thumbnail: '/bookcover/9791188331796.jpg', isRead: true, genre: '소설', series: null, year: 1866 },
    { id: 20, title: '전쟁과 평화', author: '레프 톨스토이', thumbnail: '/bookcover/9791193638859.jpg', isRead: false, genre: '소설', series: null, year: 1869 },
    { id: 21, title: '안나 카레니나', author: '레프 톨스토이', thumbnail: '/bookcover/9781408855652.jpg', isRead: false, genre: '소설', series: null, year: 1877 },
    { id: 22, title: '레 미제라블', author: '빅토르 위고', thumbnail: '/bookcover/9788925588735.jpg', isRead: true, genre: '소설', series: null, year: 1862 },
    { id: 23, title: '몬테크리스토 백작', author: '알렉상드르 뒤마', thumbnail: '/bookcover/9788936439743.jpg', isRead: false, genre: '소설', series: null, year: 1844 },
    { id: 24, title: '삼국지', author: '나관중', thumbnail: '/bookcover/9791188331796.jpg', isRead: true, genre: '역사소설', series: null, year: '14세기' },
    { id: 25, title: '성해나의 혼모노', author: '성해나', publisher: '출판사 정보', publishDate: '2024.01.01', isbn: '9790000000001', pages: 300, size: '140 × 200 mm', thumbnail: '/bookcover/9791193638859.jpg', isRead: false, isReading: false, genre: '에세이', series: null, year: 2024 },
    { id: 26, title: '프로젝트 헤일메리', author: '앤디 위어', publisher: '출판사 정보', publishDate: '2021.05.04', isbn: '9790000000002', pages: 400, size: '135 × 195 mm', thumbnail: '/bookcover/9781408855652.jpg', isRead: false, isReading: false, genre: 'SF', series: null, year: 2021 },
    { id: 27, title: '트렌드 코리아 2026', author: '김난도 외', publisher: '미래의창', publishDate: '2025.10.01', isbn: '9791165791576', pages: 320, size: '152 × 225 mm', thumbnail: '/bookcover/9788925588735.jpg', isRead: false, isReading: false, genre: '경제/경영', series: '트렌드 코리아', year: 2025 },
  ])

  const [filteredBooks, setFilteredBooks] = useState(books)
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedSeries, setSelectedSeries] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Google Books API에서 민음사, 문학동네 출판사 책 데이터 가져오기
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // 민음사와 문학동네 출판사 책만 가져오기
        const publisherBooks = await getBooksByPublishers(['민음사', '문학동네'], 40)
        if (publisherBooks && publisherBooks.length > 0) {
          setBooks(publisherBooks)
          setFilteredBooks(publisherBooks)
        } else {
          // API 키가 없거나 결과가 없을 때
          setError('책 데이터를 불러올 수 없습니다. Google Books API 키를 설정해주세요.')
        }
      } catch (err) {
        console.error('책 데이터 로드 오류:', err)
        setError('책 데이터를 불러오는데 실패했습니다. Google Books API 키를 확인해주세요.')
        // 에러 발생 시 기존 더미 데이터 유지
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()
  }, [])

  // Filter out reading books from gallery
  const otherBooks = books.filter(book => !book.isReading)

  // Calculate statistics
  const readCount = books.filter(book => book.isRead).length
  const totalCount = books.length

  // Get unique values for filters
  const genres = ['all', ...new Set(books.map(book => book.genre).filter(Boolean))]
  const series = ['all', ...new Set(books.map(book => book.series).filter(Boolean))]
  const years = ['all', ...new Set(books.map(book => book.year).filter(Boolean))]

  // Filter books (excluding reading books from gallery)
  useEffect(() => {
    let filtered = otherBooks

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(book => book.genre === selectedGenre)
    }
    if (selectedSeries !== 'all') {
      filtered = filtered.filter(book => book.series === selectedSeries)
    }
    if (selectedYear !== 'all') {
      filtered = filtered.filter(book => String(book.year) === String(selectedYear))
    }

    setFilteredBooks(filtered)
  }, [selectedGenre, selectedSeries, selectedYear, otherBooks])

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 6,
    1280: 5,
    1024: 4,
    768: 3,
    640: 2
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Books Collection</h1>
          <p className="text-gray-500 text-[15px]">출판사의 모든 책 표지를 탐색하고 컬렉션을 완성해보세요</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 mb-4"></div>
            <p className="text-gray-500 text-sm">책 데이터를 불러오는 중...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Progress Summary */}
        {!isLoading && !error && (
          <div className="mb-8">
            <ProgressSummary readCount={readCount} totalCount={totalCount} />
          </div>
        )}


        {/* Filter Area (Optional) */}
        {!isLoading && !error && (
          <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">장르</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? '전체' : genre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">시리즈</label>
                <select
                  value={selectedSeries}
                  onChange={(e) => setSelectedSeries(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
                >
                  {series.map(s => (
                    <option key={s} value={s}>
                      {s === 'all' ? '전체' : s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">연도</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year === 'all' ? '전체' : year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Masonry Grid Section with Waterwheel Animation */}
        {!isLoading && !error && (
          <div className="relative overflow-hidden" style={{ height: '100vh', maxHeight: '900px' }}>
            {/* Extended gradient mask to fade books into footer - longer fade */}
            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-gray-900 via-gray-900/95 via-gray-900/70 to-transparent pointer-events-none z-10"></div>
            <style>{`
            @keyframes scrollDown {
              0% {
                transform: translateY(-50%);
              }
              100% {
                transform: translateY(0);
              }
            }
            
            @keyframes scrollUp {
              0% {
                transform: translateY(0);
              }
              100% {
                transform: translateY(-50%);
              }
            }
            
            .my-masonry-grid {
              display: flex;
              margin-left: -1rem;
              width: auto;
            }
            .my-masonry-grid_column {
              padding-left: 1rem;
              background-clip: padding-box;
              position: relative;
              overflow: hidden;
              touch-action: pan-y;
            }
            .my-masonry-grid_column > div {
              margin-bottom: 1rem;
              position: relative;
              z-index: 1;
              pointer-events: auto;
            }
            
            .waterwheel-column {
              animation: scrollDown 60s linear infinite !important;
              will-change: transform;
              pointer-events: auto;
            }
            
            /* 홀수 열: 위에서 아래로 (정방향) */
            .waterwheel-column:nth-child(1) {
              animation: scrollDown 60s linear infinite !important;
              animation-delay: 10s;
            }
            .waterwheel-column:nth-child(3) {
              animation: scrollDown 60s linear infinite !important;
              animation-delay: -10s;
            }
            .waterwheel-column:nth-child(5) {
              animation: scrollDown 60s linear infinite !important;
              animation-delay: -10s;
            }
            
            /* 짝수 열: 아래에서 위로 (역방향) - 지그재그 효과 */
            .waterwheel-column:nth-child(2) {
              animation: scrollUp 60s linear infinite !important;
              animation-delay: -10s;
            }
            .waterwheel-column:nth-child(4) {
              animation: scrollUp 60s linear infinite !important;
              animation-delay: -10s;
            }
            .waterwheel-column:nth-child(6) {
              animation: scrollUp 60s linear infinite !important;
              animation-delay: -10s;
            }
          `}</style>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl">표시할 책이 없습니다.</p>
                <p className="text-sm mt-2">필터를 조정해보세요.</p>
              </div>
            ) : (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column waterwheel-column"
              >
                {/* 책 목록을 2번 반복하여 무한 스크롤 효과 생성 (길이 줄임) */}
                {[...filteredBooks, ...filteredBooks].map((book, index) => (
                  <div key={`${book.id}-${index}`}>
                    <GalleryBookCard book={book} />
                  </div>
                ))}
              </Masonry>
            )}
          </div>
        )}

        {/* Footer - positioned to overlay content */}
        <footer className="bg-gray-900 text-white relative z-20 -mt-40">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <div className="mb-4 h-8 flex items-center">
                  <TextPressure
                    text="BOOKLENS"
                    textColor="#FFFFFF"
                    width={true}
                    weight={true}
                    italic={true}
                    className="flex"
                    minFontSize={16}
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  당신의 독서 여정을 함께합니다
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-4 text-sm">서비스</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">도서 목록</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">베스트셀러</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">신간 도서</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-4 text-sm">회사</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">소개</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-4 text-sm">고객지원</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">문의하기</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">자주 묻는 질문</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">공지사항</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2024 BookLens. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default GalleryPage

