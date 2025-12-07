/**
 * Google Books API를 사용하여 책 정보를 가져오는 함수
 */

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_Googlebooks || import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes'

// API 키 확인
const hasValidApiKey = () => {
  return GOOGLE_BOOKS_API_KEY &&
    GOOGLE_BOOKS_API_KEY !== 'YOUR_API_KEY' &&
    GOOGLE_BOOKS_API_KEY.trim() !== ''
}

/**
 * ISBN으로 책 정보 검색
 * @param {string} isbn - ISBN 번호 (하이픈 포함/미포함 모두 가능)
 * @returns {Promise<Object>} 책 정보 객체
 */
export const searchBookByISBN = async (isbn) => {
  try {
    if (!hasValidApiKey()) {
      throw new Error('Google Books API 키가 설정되지 않았습니다. .env 파일에 VITE_Googlebooks 또는 VITE_GOOGLE_BOOKS_API_KEY를 설정해주세요.')
    }

    // ISBN에서 하이픈 제거
    const cleanISBN = isbn.replace(/-/g, '')

    const response = await fetch(
      `${GOOGLE_BOOKS_API_URL}?q=isbn:${cleanISBN}&key=${GOOGLE_BOOKS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error('해당 ISBN의 책을 찾을 수 없습니다.')
    }

    const book = data.items[0].volumeInfo

    // 책 정보 파싱
    const bookInfo = {
      title: book.title || '',
      subtitle: book.subtitle || '',
      authors: book.authors || [],
      author: book.authors ? book.authors.join(', ') : '',
      publisher: book.publisher || '',
      publishedDate: book.publishedDate || '',
      description: book.description || '',
      pageCount: book.pageCount || 0,
      categories: book.categories || [],
      thumbnail: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '',
      isbn10: book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
      isbn13: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || '',
      language: book.language || '',
      previewLink: book.previewLink || '',
      infoLink: book.infoLink || '',
    }

    return bookInfo
  } catch (error) {
    console.error('Google Books API 오류:', error)
    throw error
  }
}

/**
 * 제목으로 책 검색
 * @param {string} query - 검색어 (제목, 저자 등)
 * @returns {Promise<Array>} 책 정보 배열
 */
export const searchBooks = async (query) => {
  try {
    if (!hasValidApiKey()) {
      console.warn('Google Books API 키가 설정되지 않았습니다. .env 파일에 VITE_Googlebooks 또는 VITE_GOOGLE_BOOKS_API_KEY를 설정해주세요.')
      return []
    }

    const response = await fetch(
      `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=10`
    )

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return []
    }

    return data.items.map(item => {
      const book = item.volumeInfo
      return {
        id: item.id || Date.now() + Math.random(), // Google Books API의 책 ID 추가
        title: book.title || '',
        subtitle: book.subtitle || '',
        authors: book.authors || [],
        author: book.authors ? book.authors.join(', ') : '',
        publisher: book.publisher || '',
        publishedDate: book.publishedDate || '',
        description: book.description || '',
        pageCount: book.pageCount || 0,
        categories: book.categories || [],
        thumbnail: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '',
        isbn10: book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
        isbn13: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || '',
        language: book.language || '',
        previewLink: book.previewLink || '',
        infoLink: book.infoLink || '',
      }
    })
  } catch (error) {
    console.error('Google Books API 오류:', error)
    throw error
  }
}

/**
 * 베스트셀러 책 가져오기
 * @param {number} count - 가져올 책의 개수 (기본값: 6)
 * @returns {Promise<Array>} 책 정보 배열
 */
export const getBestsellers = async (count = 6) => {
  try {
    if (!hasValidApiKey()) {
      console.warn('Google Books API 키가 설정되지 않았습니다.')
      return []
    }

    const searchTerms = ['bestseller', 'popular', 'best seller', 'award winner']
    const allBooks = []

    for (const term of searchTerms) {
      try {
        const response = await fetch(
          `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(term)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=10&orderBy=relevance`
        )

        if (response.ok) {
          const data = await response.json()
          if (data.items) {
            data.items.forEach(item => {
              const book = item.volumeInfo
              if (book.imageLinks && book.title) {
                allBooks.push({
                  id: item.id || Date.now() + Math.random(),
                  title: book.title || '',
                  author: book.authors ? book.authors.join(', ') : 'Unknown Author',
                  thumbnail: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '',
                  cover: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '',
                })
              }
            })
          }
        }
      } catch (err) {
        console.error(`검색어 "${term}" 오류:`, err)
      }
    }

    // 중복 제거 및 무작위 섞기
    const uniqueBooks = Array.from(
      new Map(allBooks.map(book => [book.title, book])).values()
    ).sort(() => Math.random() - 0.5)

    return uniqueBooks.slice(0, count)
  } catch (error) {
    console.error('베스트셀러 가져오기 오류:', error)
    return [] // 에러 발생 시 빈 배열 반환
  }
}

/**
 * 신간 도서 가져오기
 * @param {number} count - 가져올 책의 개수 (기본값: 4)
 * @returns {Promise<Array>} 책 정보 배열
 */
export const getNewReleases = async (count = 4) => {
  try {
    if (!hasValidApiKey()) {
      console.warn('Google Books API 키가 설정되지 않았습니다.')
      return []
    }

    const currentYear = new Date().getFullYear()
    const searchTerms = [
      `${currentYear}`,
      `${currentYear - 1}`,
      'new release',
      'recent publication'
    ]

    const allBooks = []

    for (const term of searchTerms) {
      try {
        const response = await fetch(
          `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(term)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=10&orderBy=newest`
        )

        if (response.ok) {
          const data = await response.json()
          if (data.items) {
            data.items.forEach(item => {
              const book = item.volumeInfo
              if (book.imageLinks && book.title) {
                const publishedYear = book.publishedDate ? new Date(book.publishedDate).getFullYear() : null
                if (publishedYear && publishedYear >= currentYear - 2) {
                  allBooks.push({
                    id: item.id || Date.now() + Math.random(),
                    title: book.title || '',
                    author: book.authors ? book.authors.join(', ') : 'Unknown Author',
                    thumbnail: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '',
                    cover: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '',
                    publishedDate: book.publishedDate || '',
                  })
                }
              }
            })
          }
        }
      } catch (err) {
        console.error(`검색어 "${term}" 오류:`, err)
      }
    }

    // 중복 제거 및 발행일 기준 정렬
    const uniqueBooks = Array.from(
      new Map(allBooks.map(book => [book.title, book])).values()
    ).sort((a, b) => {
      const dateA = new Date(a.publishedDate || 0)
      const dateB = new Date(b.publishedDate || 0)
      return dateB - dateA
    })

    return uniqueBooks.slice(0, count)
  } catch (error) {
    console.error('신간 도서 가져오기 오류:', error)
    return [] // 에러 발생 시 빈 배열 반환
  }
}

/**
 * 책 ID로 상세 정보 가져오기
 * @param {string} bookId - Google Books API의 책 ID
 * @returns {Promise<Object>} 책 상세 정보
 */
export const getBookById = async (bookId) => {
  try {
    if (!hasValidApiKey()) {
      throw new Error('Google Books API 키가 설정되지 않았습니다. .env 파일에 VITE_Googlebooks 또는 VITE_GOOGLE_BOOKS_API_KEY를 설정해주세요.')
    }

    const response = await fetch(
      `${GOOGLE_BOOKS_API_URL}/${bookId}?key=${GOOGLE_BOOKS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`)
    }

    const data = await response.json()
    const book = data.volumeInfo

    return {
      id: data.id,
      title: book.title || '',
      subtitle: book.subtitle || '',
      authors: book.authors || [],
      author: book.authors ? book.authors.join(', ') : 'Unknown Author',
      publisher: book.publisher || '',
      publishedDate: book.publishedDate || '',
      description: book.description || '',
      pageCount: book.pageCount || 0,
      pages: book.pageCount || 0,
      categories: book.categories || [],
      genre: book.categories?.[0] || '',
      thumbnail: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '',
      isbn10: book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
      isbn13: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || '',
      isbn: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
        book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
      language: book.language || '',
      previewLink: book.previewLink || '',
      infoLink: book.infoLink || '',
      year: book.publishedDate ? new Date(book.publishedDate).getFullYear() : null,
      tableOfContents: book.tableOfContents || [],
      averageRating: book.averageRating || 0,
      ratingsCount: book.ratingsCount || 0,
    }
  } catch (error) {
    console.error('책 상세 정보 가져오기 오류:', error)
    throw error
  }
}

/**
 * 무작위 책 목록 가져오기
 * @param {number} count - 가져올 책의 개수 (기본값: 40)
 * @returns {Promise<Array>} 책 정보 배열
 */
export const getRandomBooks = async (count = 40) => {
  try {
    if (!hasValidApiKey()) {
      console.warn('Google Books API 키가 설정되지 않았습니다.')
      return []
    }

    // 다양한 검색어로 무작위 책 가져오기
    const searchTerms = [
      'fiction', 'novel', 'literature', 'science', 'history', 'philosophy',
      'biography', 'poetry', 'drama', 'mystery', 'romance', 'fantasy',
      'science fiction', 'thriller', 'horror', 'adventure', 'classic',
      'best seller', 'award winner', 'bestseller', 'popular', 'trending'
    ]

    // 여러 검색어로 병렬 검색
    const searchPromises = searchTerms.slice(0, Math.ceil(count / 10)).map(async (term, index) => {
      try {
        const response = await fetch(
          `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(term)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=10&startIndex=${index * 10}`
        )

        if (!response.ok) {
          return []
        }

        const data = await response.json()
        if (!data.items || data.items.length === 0) {
          return []
        }

        return data.items.map(item => {
          const book = item.volumeInfo
          return {
            id: item.id || Date.now() + Math.random(),
            title: book.title || '',
            subtitle: book.subtitle || '',
            authors: book.authors || [],
            author: book.authors ? book.authors.join(', ') : 'Unknown Author',
            publisher: book.publisher || '',
            publishDate: book.publishedDate || '',
            description: book.description || '',
            pageCount: book.pageCount || 0,
            pages: book.pageCount || 0,
            categories: book.categories || [],
            genre: book.categories?.[0] || '',
            thumbnail: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '',
            isbn10: book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
            isbn13: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || '',
            isbn: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
              book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
            language: book.language || '',
            previewLink: book.previewLink || '',
            infoLink: book.infoLink || '',
            year: book.publishedDate ? new Date(book.publishedDate).getFullYear() : null,
            isRead: Math.random() > 0.5, // 랜덤으로 읽음/안읽음 설정
            isReading: false,
            series: null,
          }
        }).filter(book => book.thumbnail && book.title) // 표지와 제목이 있는 책만
      } catch (error) {
        console.error(`검색어 "${term}" 오류:`, error)
        return []
      }
    })

    const results = await Promise.all(searchPromises)
    const allBooks = results.flat()

    // 중복 제거 (제목 기준)
    const uniqueBooks = Array.from(
      new Map(allBooks.map(book => [book.title, book])).values()
    )

    // 무작위로 섞기
    const shuffled = uniqueBooks.sort(() => Math.random() - 0.5)

    // 요청한 개수만큼 반환
    return shuffled.slice(0, count)
  } catch (error) {
    console.error('무작위 책 가져오기 오류:', error)
    return [] // 에러 발생 시 빈 배열 반환
  }
}

/**
 * 특정 출판사의 책 목록 가져오기
 * @param {Array<string>} publishers - 출판사 이름 배열
 * @param {number} count - 가져올 책의 개수 (기본값: 40)
 * @returns {Promise<Array>} 책 정보 배열
 */
export const getBooksByPublishers = async (publishers = [], count = 40) => {
  try {
    if (!hasValidApiKey()) {
      console.warn('Google Books API 키가 설정되지 않았습니다.')
      return []
    }

    if (!publishers || publishers.length === 0) {
      return []
    }

    const allBooks = []

    // 각 출판사별로 검색
    for (const publisher of publishers) {
      try {
        // 여러 페이지에서 책 가져오기 (각 출판사당 최대 40권)
        const maxPages = Math.ceil(count / publishers.length / 10)

        for (let page = 0; page < maxPages; page++) {
          const response = await fetch(
            `${GOOGLE_BOOKS_API_URL}?q=inpublisher:${encodeURIComponent(publisher)}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=10&startIndex=${page * 10}`
          )

          if (!response.ok) {
            console.warn(`${publisher} 출판사 검색 실패: ${response.status}`)
            break
          }

          const data = await response.json()
          if (!data.items || data.items.length === 0) {
            break // 더 이상 결과가 없으면 다음 출판사로
          }

          const books = data.items.map(item => {
            const book = item.volumeInfo
            // 출판사 이름이 정확히 일치하는지 확인
            const bookPublisher = book.publisher || ''
            const isMatch = publishers.some(p =>
              bookPublisher.includes(p) || p.includes(bookPublisher)
            )

            if (!isMatch) {
              return null
            }

            return {
              id: item.id || Date.now() + Math.random(),
              title: book.title || '',
              subtitle: book.subtitle || '',
              authors: book.authors || [],
              author: book.authors ? book.authors.join(', ') : 'Unknown Author',
              publisher: book.publisher || '',
              publishDate: book.publishedDate || '',
              description: book.description || '',
              pageCount: book.pageCount || 0,
              pages: book.pageCount || 0,
              categories: book.categories || [],
              genre: book.categories?.[0] || '',
              thumbnail: book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail || '',
              isbn10: book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
              isbn13: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || '',
              isbn: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
                book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
              language: book.language || '',
              previewLink: book.previewLink || '',
              infoLink: book.infoLink || '',
              year: book.publishedDate ? new Date(book.publishedDate).getFullYear() : null,
              isRead: Math.random() > 0.5,
              isReading: false,
              series: null,
            }
          }).filter(book => book && book.thumbnail && book.title) // null 제거 및 표지/제목 필수

          allBooks.push(...books)

          // 충분한 책을 모았으면 중단
          if (allBooks.length >= count) {
            break
          }
        }

        // 충분한 책을 모았으면 모든 출판사 검색 중단
        if (allBooks.length >= count) {
          break
        }
      } catch (error) {
        console.error(`${publisher} 출판사 검색 오류:`, error)
        continue // 다음 출판사로 계속
      }
    }

    // 중복 제거 (제목 기준)
    const uniqueBooks = Array.from(
      new Map(allBooks.map(book => [book.title, book])).values()
    )

    // 무작위로 섞기
    const shuffled = uniqueBooks.sort(() => Math.random() - 0.5)

    // 요청한 개수만큼 반환
    return shuffled.slice(0, count)
  } catch (error) {
    console.error('출판사별 책 가져오기 오류:', error)
    return []
  }
}

