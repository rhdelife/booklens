import { useState, useEffect, useRef } from 'react'
import { getRandomBooks, searchBooks } from '../lib/googleBooksApi'

const MapPage = () => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [locations, setLocations] = useState([])
  const [filteredLocations, setFilteredLocations] = useState([])
  const [filterType, setFilterType] = useState('all') // 'all', 'library', 'bookstore'
  const [showList, setShowList] = useState(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [books, setBooks] = useState([])
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
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

  // Dummy inventory data (책별 재고 정보)
  const dummyInventory = [
    // 강남도서관
    { locationId: 1, bookId: 1, quantity: 5, availableQuantity: 3, price: null },
    { locationId: 1, bookId: 2, quantity: 3, availableQuantity: 2, price: null },
    { locationId: 1, bookId: 3, quantity: 4, availableQuantity: 4, price: null },
    // 교보문고 강남점
    { locationId: 2, bookId: 1, quantity: 10, availableQuantity: 10, price: 15000 },
    { locationId: 2, bookId: 2, quantity: 8, availableQuantity: 8, price: 15000 },
    { locationId: 2, bookId: 3, quantity: 12, availableQuantity: 12, price: 12000 },
    { locationId: 2, bookId: 4, quantity: 6, availableQuantity: 6, price: 11000 },
    { locationId: 2, bookId: 5, quantity: 9, availableQuantity: 9, price: 13000 },
    // 서울시립도서관
    { locationId: 3, bookId: 2, quantity: 7, availableQuantity: 5, price: null },
    { locationId: 3, bookId: 3, quantity: 6, availableQuantity: 4, price: null },
    { locationId: 3, bookId: 4, quantity: 4, availableQuantity: 3, price: null },
    // 영풍문고 종로점
    { locationId: 4, bookId: 1, quantity: 15, availableQuantity: 15, price: 14500 },
    { locationId: 4, bookId: 3, quantity: 10, availableQuantity: 10, price: 12000 },
    { locationId: 4, bookId: 5, quantity: 7, availableQuantity: 7, price: 13000 },
    // 반포도서관
    { locationId: 5, bookId: 1, quantity: 4, availableQuantity: 2, price: null },
    { locationId: 5, bookId: 4, quantity: 5, availableQuantity: 4, price: null },
    { locationId: 5, bookId: 5, quantity: 3, availableQuantity: 3, price: null },
    // 알라딘 중고서적
    { locationId: 6, bookId: 2, quantity: 5, availableQuantity: 5, price: 8000 },
    { locationId: 6, bookId: 3, quantity: 8, availableQuantity: 8, price: 7000 },
    { locationId: 6, bookId: 4, quantity: 6, availableQuantity: 6, price: 7500 },
    { locationId: 6, bookId: 5, quantity: 4, availableQuantity: 4, price: 8500 },
  ]

  // Dummy location data (libraries and bookstores)
  const dummyLocations = [
    { id: 1, name: '강남도서관', type: 'library', lat: 37.4979, lng: 127.0276, address: '서울특별시 강남구 테헤란로', availableBooks: [1, 2, 3] },
    { id: 2, name: '교보문고 강남점', type: 'bookstore', lat: 37.5045, lng: 127.0489, address: '서울특별시 강남구 강남대로', availableBooks: [1, 2, 3, 4, 5] },
    { id: 3, name: '서울시립도서관', type: 'library', lat: 37.5665, lng: 126.9780, address: '서울특별시 중구 세종대로', availableBooks: [2, 3, 4] },
    { id: 4, name: '영풍문고 종로점', type: 'bookstore', lat: 37.5704, lng: 126.9920, address: '서울특별시 종로구 종로', availableBooks: [1, 3, 5] },
    { id: 5, name: '반포도서관', type: 'library', lat: 37.5041, lng: 127.0015, address: '서울특별시 서초구 반포대로', availableBooks: [1, 4, 5] },
    { id: 6, name: '알라딘 중고서적', type: 'bookstore', lat: 37.5512, lng: 126.9882, address: '서울특별시 마포구 홍대로', availableBooks: [2, 3, 4, 5] },
  ]

  // Get inventory for a specific location and book
  const getInventory = (locationId, bookId) => {
    return dummyInventory.find(
      inv => inv.locationId === locationId && inv.bookId === bookId
    )
  }

  // Get all books inventory for a location
  const getLocationInventory = (locationId) => {
    return dummyInventory.filter(inv => inv.locationId === locationId)
  }

  // Initialize map - 간단하고 확실한 방법
  useEffect(() => {
    const initMap = () => {
      const container = mapRef.current
      if (!container) {
        console.error('❌ Map container not found')
        return
      }

      // 카카오맵 API가 로드되었는지 확인
      if (!window.kakao || !window.kakao.maps) {
        console.log('⏳ Waiting for Kakao Map API...')
        setTimeout(initMap, 100)
        return
      }

      // LatLng 생성자가 준비되었는지 확인
      if (typeof window.kakao.maps.LatLng !== 'function') {
        console.log('⏳ Waiting for LatLng constructor...')
        setTimeout(initMap, 100)
        return
      }

      // Map 생성자가 준비되었는지 확인
      if (typeof window.kakao.maps.Map !== 'function') {
        console.log('⏳ Waiting for Map constructor...')
        setTimeout(initMap, 100)
        return
      }

      try {
        console.log('✅ Kakao Map API ready, initializing map...')
        
        // 지도 중심 좌표 설정
        const center = new window.kakao.maps.LatLng(37.5665, 126.9780)
        
        // 지도 옵션
        const options = {
          center: center,
          level: 5
        }

        // 지도 생성
        const map = new window.kakao.maps.Map(container, options)
        mapInstanceRef.current = map
        
        console.log('✅ Map created successfully')
        setIsMapLoaded(true)

        // 지도가 완전히 로드될 때까지 기다린 후 마커 표시
        window.kakao.maps.event.addListener(map, 'tilesloaded', () => {
          console.log('✅ Map tiles loaded')
          setLocations(dummyLocations)
          setFilteredLocations(dummyLocations)
          displayMarkers(dummyLocations, selectedBook)
        })

        // 지도 클릭 시 모든 InfoWindow 닫기
        window.kakao.maps.event.addListener(map, 'click', () => {
          markersRef.current.forEach(marker => {
            if (marker.infoWindow) {
              marker.infoWindow.close()
              marker.isOpen = false
            }
          })
        })

      } catch (error) {
        console.error('❌ Error creating map:', error)
        console.error('Error details:', error.message)
        setIsMapLoaded(false)
      }
    }

    // 지도 초기화 시작
    initMap()

    return () => {
      // Cleanup
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []
      }
    }
  }, [])


  // Display markers on map
  const displayMarkers = (locationsToShow, currentSelectedBook = null) => {
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

      // Get inventory for this location
      const locationInventory = getLocationInventory(location.id)
      // Google Books API에서 가져온 책은 더미 재고와 매칭되지 않으므로 null 처리
      const selectedBookInventory = currentSelectedBook && 
        typeof currentSelectedBook.id === 'number' &&
        currentSelectedBook.id <= 5 // 더미 데이터의 책 ID 범위
        ? getInventory(location.id, currentSelectedBook.id)
        : null

      // Create info window content
      let infoContent = `
        <div style="padding:12px;min-width:200px;max-width:300px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="font-weight:bold;font-size:16px;margin-bottom:6px;color:#1f2937;">${location.name}</div>
          <div style="font-size:12px;color:#6b7280;margin-bottom:8px;">${location.address}</div>
          <div style="font-size:11px;color:#9ca3af;margin-bottom:10px;padding:4px 8px;background:#f3f4f6;border-radius:4px;display:inline-block;">
            ${location.type === 'library' ? '📚 도서관' : '📖 서점'}
          </div>
      `

      // If a book is selected, show its inventory
      if (currentSelectedBook && selectedBookInventory) {
        infoContent += `
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb;">
            <div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">📖 ${currentSelectedBook.title}</div>
            <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">${currentSelectedBook.author}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-size:12px;color:#4b5563;">총 재고:</span>
              <span style="font-weight:600;color:#1f2937;">${selectedBookInventory.quantity}권</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-size:12px;color:#4b5563;">${location.type === 'library' ? '대출 가능:' : '구매 가능:'}</span>
              <span style="font-weight:600;color:#059669;">${selectedBookInventory.availableQuantity}권</span>
            </div>
        `
        if (selectedBookInventory.price) {
          infoContent += `
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:12px;color:#4b5563;">가격:</span>
              <span style="font-weight:600;color:#dc2626;">${selectedBookInventory.price.toLocaleString()}원</span>
            </div>
          `
        }
        infoContent += `</div>`
      } else if (currentSelectedBook) {
        // Selected book but not available at this location
        infoContent += `
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb;">
            <div style="font-size:12px;color:#ef4444;">❌ ${currentSelectedBook.title} 재고 없음</div>
          </div>
        `
      } else {
        // No book selected, show all available books count
        const totalBooks = locationInventory.length
        infoContent += `
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb;">
            <div style="font-size:12px;color:#4b5563;margin-bottom:4px;">보유 도서 종류:</div>
            <div style="font-size:14px;font-weight:600;color:#059669;">${totalBooks}종</div>
          </div>
        `
      }

      infoContent += `
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e5e7eb;text-align:center;">
          <button 
            id="close-info-${location.id}"
            style="background:#6b7280;color:white;border:none;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:500;transition:background 0.2s;"
            onmouseover="this.style.background='#4b5563'"
            onmouseout="this.style.background='#6b7280'"
          >
            닫기
          </button>
        </div>
      </div>`

      // Create info window
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: infoContent,
        removable: true // 카카오맵 기본 닫기 버튼도 활성화
      })

      // Track if this info window is open
      let isOpen = false

      // Add click event with toggle functionality
      window.kakao.maps.event.addListener(marker, 'click', () => {
        // Check if this info window is already open
        if (isOpen && marker.infoWindow) {
          // Close this info window
          marker.infoWindow.close()
          isOpen = false
        } else {
          // Close all other info windows first
          markersRef.current.forEach(m => {
            if (m !== marker && m.infoWindow) {
              m.infoWindow.close()
              m.isOpen = false
            }
          })
          // Open this info window
          infoWindow.open(mapInstanceRef.current, marker)
          isOpen = true
          
          // Add close button event listener after info window is opened
          setTimeout(() => {
            const closeBtn = document.getElementById(`close-info-${location.id}`)
            if (closeBtn) {
              closeBtn.addEventListener('click', () => {
                infoWindow.close()
                isOpen = false
                marker.isOpen = false
              })
            }
          }, 100)
        }
        marker.infoWindow = infoWindow
        marker.isOpen = isOpen
      })

      // Listen for close event
      window.kakao.maps.event.addListener(infoWindow, 'close', () => {
        isOpen = false
        marker.isOpen = false
      })

      marker.infoWindow = infoWindow
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

  // Handle book search
  const handleBookSearch = (book) => {
    setSelectedBook(book)
    // Google Books API에서 가져온 책은 더미 재고 데이터와 매칭되지 않으므로
    // 모든 위치를 표시하되, 재고 정보는 표시하지 않음
    // 실제로는 API에서 재고 정보를 가져와야 하지만, 여기서는 더미 데이터 사용
    const matchingLocations = dummyLocations.filter(location => {
      // 더미 데이터의 availableBooks는 숫자 ID를 사용하므로
      // 검색된 책의 ID와 매칭되지 않음
      // 모든 위치를 표시하도록 수정
      return true
    })
    setLocations(matchingLocations)
    setFilteredLocations(matchingLocations)
    displayMarkers(matchingLocations, book)
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
    displayMarkers(filtered, selectedBook)
  }, [filterType, locations, selectedBook])

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
                    {!import.meta.env.VITE_GOOGLE_BOOKS_API_KEY && (
                      <p className="text-xs text-red-500 mt-2">⚠️ API 키가 설정되지 않았습니다. .env 파일에 VITE_GOOGLE_BOOKS_API_KEY를 설정해주세요.</p>
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
                    <button
                      key={book.id}
                      onClick={() => handleBookSearch(book)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedBook?.id === book.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                      }`}
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
                    </button>
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
                  className={`w-full px-4 py-2 rounded-lg text-left transition-all ${
                    filterType === 'all'
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setFilterType('library')}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-all ${
                    filterType === 'library'
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  도서관
                </button>
                <button
                  onClick={() => setFilterType('bookstore')}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-all ${
                    filterType === 'bookstore'
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
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                      <p className="text-xs text-yellow-800 font-semibold mb-1">지도가 표시되지 않나요?</p>
                      <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                        <li>브라우저 콘솔(F12)에서 에러 메시지를 확인하세요</li>
                        <li>API 키의 도메인 제한 설정을 확인하세요</li>
                        <li>페이지를 새로고침(Ctrl+R 또는 Cmd+R)해보세요</li>
                      </ul>
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
                {selectedBook && (
                  <div className="mb-4 p-3 bg-brand-50 rounded-lg border border-brand-200">
                    <div className="text-sm text-gray-600 mb-1">검색 중인 책:</div>
                    <div className="font-semibold text-gray-900">{selectedBook.title}</div>
                    <div className="text-xs text-gray-500">{selectedBook.author}</div>
                  </div>
                )}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredLocations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      {selectedBook ? '해당 책을 보유한 장소가 없습니다' : '책을 검색해주세요'}
                    </p>
                  ) : (
                    filteredLocations.map(location => (
                      <div
                        key={location.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-brand-300 hover:bg-gray-50 transition-all cursor-pointer"
                        onClick={() => {
                          if (mapInstanceRef.current) {
                            const moveLatLon = new window.kakao.maps.LatLng(location.lat, location.lng)
                            mapInstanceRef.current.setCenter(moveLatLon)
                            mapInstanceRef.current.setLevel(3)
                            
                            // Open info window
                            const marker = markersRef.current.find(m => {
                              const pos = m.getPosition()
                              return pos.getLat() === location.lat && pos.getLng() === location.lng
                            })
                            if (marker && marker.infoWindow) {
                              markersRef.current.forEach(m => {
                                if (m.infoWindow) m.infoWindow.close()
                              })
                              marker.infoWindow.open(mapInstanceRef.current, marker)
                            }
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{location.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded ${
                                location.type === 'library'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {location.type === 'library' ? '도서관' : '서점'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{location.address}</p>
                            {selectedBook && (() => {
                              const inventory = getInventory(location.id, selectedBook.id)
                              if (inventory) {
                                return (
                                  <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-600">
                                      총 재고: <span className="font-semibold text-gray-900">{inventory.quantity}권</span>
                                    </p>
                                    <p className="text-xs text-brand-600">
                                      {location.type === 'library' ? '대출' : '구매'} 가능: <span className="font-semibold">{inventory.availableQuantity}권</span>
                                      {inventory.price && (
                                        <span className="ml-2 text-red-600">({inventory.price.toLocaleString()}원)</span>
                                      )}
                                    </p>
                                  </div>
                                )
                              } else {
                                return (
                                  <p className="text-xs text-red-600 mt-2">
                                    ❌ 재고 없음
                                  </p>
                                )
                              }
                            })()}
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

