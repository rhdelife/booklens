import { useState, useEffect, useRef } from 'react'
import { getRandomBooks, searchBooks } from '../lib/googleBooksApi'

const MapPage = () => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [searchQuery, setSearchQuery] = useState('')
  const [locations, setLocations] = useState([])
  const [filteredLocations, setFilteredLocations] = useState([])
  const [filterType, setFilterType] = useState('all') // 'all', 'library', 'bookstore'
  const [showList, setShowList] = useState(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Google Books API에서 책 검색
  useEffect(() => {
    const searchBooksByQuery = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await searchBooks(searchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error('책 검색 오류:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    // 디바운싱: 500ms 후 검색 실행
    const timeoutId = setTimeout(() => {
      searchBooksByQuery()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Dummy location data (libraries and bookstores)
  const dummyLocations = [
    { id: 1, name: '강남도서관', type: 'library', lat: 37.4979, lng: 127.0276, address: '서울특별시 강남구 테헤란로' },
    { id: 2, name: '교보문고 강남점', type: 'bookstore', lat: 37.5045, lng: 127.0489, address: '서울특별시 강남구 강남대로' },
    { id: 3, name: '서울시립도서관', type: 'library', lat: 37.5665, lng: 126.9780, address: '서울특별시 중구 세종대로' },
    { id: 4, name: '영풍문고 종로점', type: 'bookstore', lat: 37.5704, lng: 126.9920, address: '서울특별시 종로구 종로' },
    { id: 5, name: '반포도서관', type: 'library', lat: 37.5041, lng: 127.0015, address: '서울특별시 서초구 반포대로' },
    { id: 6, name: '알라딘 중고서적', type: 'bookstore', lat: 37.5512, lng: 126.9882, address: '서울특별시 마포구 홍대로' },
  ]

  // Initialize map - window.kakao.maps.load() 콜백 안에서만 사용
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 50 // 10초 동안 시도 (200ms * 50)
    let isInitialized = false

    const initMap = () => {
      if (isInitialized) return

      // 스크립트가 로드되었는지 확인
      if (!window.kakaoMapScriptLoaded && retryCount < 20) {
        if (retryCount % 5 === 0) {
          console.log(`⏳ Waiting for script to load... (${retryCount}/20)`)
        }
        retryCount++
        setTimeout(initMap, 200)
        return
      }

      // 스크립트가 로드되지 않았으면 에러
      if (!window.kakaoMapScriptLoaded) {
        console.error('❌ Kakao Map SDK script not loaded')
        console.error('Possible causes:')
        console.error('1. API key is invalid')
        console.error('2. Domain not registered:', window.location.origin)
        console.error('3. Network error - check browser Network tab')
        setIsMapLoaded(false)
        return
      }

      // SDK가 아직 로드되지 않았으면 재시도
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.load) {
        if (retryCount < maxRetries) {
          if (retryCount % 10 === 0) {
            console.log(`⏳ Waiting for SDK to initialize... (${retryCount}/${maxRetries})`)
            console.log('window.kakao:', !!window.kakao)
            console.log('window.kakao.maps:', !!window.kakao?.maps)
            console.log('window.kakao.maps.load:', !!window.kakao?.maps?.load)
          }
          retryCount++
          setTimeout(initMap, 200)
        } else {
          console.error('❌ Kakao Map SDK not available after', maxRetries, 'attempts')
          console.error('Script loaded:', window.kakaoMapScriptLoaded)
          console.error('window.kakao:', window.kakao)
          console.error('window.kakao.maps:', window.kakao?.maps)
          console.error('Current origin:', window.location.origin)
          console.error('Check:')
          console.error('1. API key is correct in index.html')
          console.error('2. Domain is registered in Kakao Developers console')
          console.error('3. Check browser Network tab for script loading errors')
          setIsMapLoaded(false)
        }
        return
      }

      // window.kakao.maps.load() 콜백 안에서만 지도 생성
      window.kakao.maps.load(() => {
        if (isInitialized) return

        const kakao = window.kakao
        const container = mapRef.current

        if (!container) {
          console.error('❌ Map container not found')
          setIsMapLoaded(false)
          return
        }

        try {
          isInitialized = true

          // window.kakao.maps.load() 콜백 안에서만 사용
          const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
            level: 5
          }

          const map = new kakao.maps.Map(container, options)
          mapInstanceRef.current = map

          console.log('✅ Map created successfully')
          setIsMapLoaded(true)

          // 여기부터 services 사용 가능
          // const ps = new kakao.maps.services.Places();

          kakao.maps.event.addListener(map, 'tilesloaded', () => {
            setLocations(dummyLocations)
            setFilteredLocations(dummyLocations)
            displayMarkers(dummyLocations)
          })

        } catch (error) {
          console.error('❌ Error creating map:', error)
          setIsMapLoaded(false)
          isInitialized = false
        }
      })
    }

    // 초기화 시작
    initMap()

    return () => {
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []
      }
    }
  }, [])


  // Display markers on map (단순 마커만 표시)
  const displayMarkers = (locationsToShow) => {
    // Remove existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    if (!mapInstanceRef.current) return

    locationsToShow.forEach((location) => {
      // Create marker image
      const imageSrc = location.type === 'library'
        ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
        : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_orange.png'
      const imageSize = new window.kakao.maps.Size(24, 35)
      const imageOption = { offset: new window.kakao.maps.Point(12, 35) }
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

      // Create marker
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(location.lat, location.lng),
        image: markerImage,
        map: mapInstanceRef.current
      })

      markersRef.current.push(marker)
    })

    // Adjust map bounds to show all markers
    if (locationsToShow.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds()
      locationsToShow.forEach(location => {
        bounds.extend(new window.kakao.maps.LatLng(location.lat, location.lng))
      })
      mapInstanceRef.current.setBounds(bounds)
    }
  }

  // Handle book search (단순히 검색만 수행, 지도에는 영향 없음)
  const handleBookSearch = (book) => {
    // 책 검색은 UI에서만 표시하고, 지도에는 영향 없음
    console.log('Selected book:', book)
  }

  // Handle filter change
  useEffect(() => {
    let filtered = locations

    if (filterType === 'library') {
      filtered = filtered.filter(loc => loc.type === 'library')
    } else if (filterType === 'bookstore') {
      filtered = filtered.filter(loc => loc.type === 'bookstore')
    }

    setFilteredLocations(filtered)
    displayMarkers(filtered)
  }, [filterType, locations])

  // 검색 결과가 있으면 검색 결과 사용, 없으면 빈 배열
  const filteredBooks = searchQuery.trim() ? searchResults : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">도서관/서점 찾기</h1>
          <p className="text-gray-600">책을 검색하여 대출 가능한 도서관이나 구매 가능한 서점을 찾아보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Search and Filters */}
          <div className="lg:col-span-1 space-y-4">
            {/* Book Search */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">책 검색</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="책 제목 또는 저자 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {isSearching ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                    <span className="ml-2 text-sm text-gray-500">검색 중...</span>
                  </div>
                ) : !searchQuery.trim() ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm mb-2">책 제목 또는 저자를 입력하세요</p>
                    <p className="text-xs text-gray-400">Google Books API를 통해 검색됩니다</p>
                    {!import.meta.env.VITE_Googlebooks && !import.meta.env.VITE_GOOGLE_BOOKS_API_KEY && (
                      <p className="text-xs text-red-500 mt-2">⚠️ API 키가 설정되지 않았습니다. 환경 변수에 VITE_Googlebooks를 설정해주세요.</p>
                    )}
                  </div>
                ) : filteredBooks.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm mb-2">검색 결과가 없습니다</p>
                    <p className="text-xs text-gray-400">다른 검색어를 시도해보세요</p>
                    {!import.meta.env.VITE_GOOGLE_BOOKS_API_KEY && (
                      <p className="text-xs text-red-500 mt-2">⚠️ API 키가 설정되지 않았습니다.</p>
                    )}
                  </div>
                ) : (
                  filteredBooks.map(book => (
                    <div
                      key={book.id}
                      className="w-full p-3 rounded-lg border-2 border-gray-200 bg-white"
                    >
                      {book.thumbnail && (
                        <div className="flex items-center gap-3">
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm line-clamp-1">{book.title}</div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">{book.author}</div>
                          </div>
                        </div>
                      )}
                      {!book.thumbnail && (
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm line-clamp-1">{book.title}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{book.author}</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">필터</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-all ${filterType === 'all'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setFilterType('library')}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-all ${filterType === 'library'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  도서관
                </button>
                <button
                  onClick={() => setFilterType('bookstore')}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-all ${filterType === 'bookstore'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  서점
                </button>
              </div>
            </div>

            {/* List Toggle */}
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <button
                onClick={() => setShowList(!showList)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                {showList ? '목록 숨기기' : '목록 보기'}
              </button>
            </div>
          </div>

          {/* Right Side - Map and List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border-2 border-blue-200 overflow-hidden relative">
              {!isMapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50/90 z-20 p-6">
                  <div className="text-center max-w-md">
                    <div className="mb-4 animate-spin">
                      <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">지도를 불러오는 중...</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      카카오맵 API를 로딩하고 있습니다. 잠시만 기다려주세요.
                    </p>
                    <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-left">
                      <p className="text-sm text-red-800 font-bold mb-3">🚨 카카오맵 로딩 실패</p>
                      <div className="bg-white p-3 rounded border border-red-200 mb-3">
                        <p className="text-xs text-red-700 font-semibold mb-2">현재 도메인:</p>
                        <p className="text-xs text-red-900 font-mono bg-gray-100 p-2 rounded">{window.location.origin}</p>
                      </div>
                      <p className="text-xs text-red-800 font-semibold mb-2">해결 방법:</p>
                      <ol className="text-xs text-red-700 space-y-2 list-decimal list-inside mb-3">
                        <li className="mb-2">
                          <strong>카카오 개발자 콘솔</strong> 접속:
                          <a href="https://developers.kakao.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">https://developers.kakao.com</a>
                        </li>
                        <li className="mb-2">
                          <strong>내 애플리케이션</strong> &gt; <strong>앱 키</strong> &gt; <strong>JavaScript 키</strong> 클릭
                        </li>
                        <li className="mb-2">
                          <strong>JavaScript SDK 도메인</strong> 섹션에서:
                          <ul className="ml-6 mt-1 list-disc">
                            <li>기존: <code className="bg-gray-100 px-1 rounded">https://booklens-two.vercel.app/map</code> ❌ (경로 포함 - 잘못됨)</li>
                            <li>수정: <code className="bg-gray-100 px-1 rounded">https://booklens-two.vercel.app</code> ✅ (경로 제거)</li>
                            <li>추가: <code className="bg-gray-100 px-1 rounded">http://localhost:5173</code> ✅ (로컬 개발용)</li>
                          </ul>
                        </li>
                        <li>저장 후 페이지 새로고침 (Ctrl+R 또는 Cmd+R)</li>
                      </ol>
                      <p className="text-xs text-red-600 mt-3 font-semibold">⚠️ 중요: 도메인에 경로(/map)를 포함하면 안 됩니다!</p>
                    </div>
                    <a
                      href="https://developers.kakao.com/docs/latest/ko/getting-started/sdk-js"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md mt-4"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      카카오맵 API 설정 가이드
                    </a>
                  </div>
                </div>
              )}
              <div
                ref={mapRef}
                className="w-full h-[500px]"
                style={{
                  minHeight: '500px',
                  height: '500px',
                  width: '100%',
                  position: 'relative',
                  zIndex: 1
                }}
              />
            </div>

            {/* Location List */}
            {showList && (
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  검색 결과 ({filteredLocations.length}개)
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredLocations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      장소가 없습니다
                    </p>
                  ) : (
                    filteredLocations.map(location => (
                      <div
                        key={location.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-brand-300 hover:bg-gray-50 transition-all cursor-pointer"
                        onClick={() => {
                          if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
                            const moveLatLon = new window.kakao.maps.LatLng(location.lat, location.lng)
                            mapInstanceRef.current.setCenter(moveLatLon)
                            mapInstanceRef.current.setLevel(3)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{location.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded ${location.type === 'library'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                                }`}>
                                {location.type === 'library' ? '도서관' : '서점'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{location.address}</p>
                          </div>
                        </div>
                      </div>
                    ))
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

export default MapPage

