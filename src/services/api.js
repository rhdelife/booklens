/**
 * 백엔드 API 연동을 위한 서비스 레이어
 * 환경 변수에서 API URL을 가져오거나 기본값 사용
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * API 요청 헬퍼 함수
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  // 세션에서 토큰 가져오기
  const token = sessionStorage.getItem('token')

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  // 토큰이 있으면 Authorization 헤더 추가
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    // 응답이 JSON인지 확인
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    const data = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      // 에러 응답 처리
      const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`
      console.error('API Error Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        data,
      })
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    // 네트워크 에러나 기타 에러 처리
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network Error - 백엔드 서버에 연결할 수 없습니다:', {
        url,
        error: error.message,
        hint: '백엔드 서버가 실행 중인지 확인하세요. API_BASE_URL: ' + API_BASE_URL,
      })
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    console.error('API Request Error:', {
      url,
      error: error.message,
      stack: error.stack,
    })
    throw error
  }
}

/**
 * 인증 관련 API
 */
export const authAPI = {
  // 로그인
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  // 회원가입
  signup: async (email, password, name) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  },

  // 로그아웃
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    })
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    return apiRequest('/auth/me')
  },

  // 프로필 업데이트
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  },

  // 프로필 이미지 업로드
  uploadProfileImage: async (imageData) => {
    return apiRequest('/auth/profile/image', {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
    })
  },

  // 구글 OAuth 콜백
  googleCallback: async (code, state) => {
    return apiRequest('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    })
  },

  // 네이버 OAuth 콜백
  naverCallback: async (code, state) => {
    return apiRequest('/auth/naver/callback', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    })
  },
}

/**
 * 책 관련 API
 */
export const bookAPI = {
  // 내 도서 목록 가져오기
  getMyBooks: async () => {
    return apiRequest('/books')
  },

  // 책 추가
  addBook: async (bookData) => {
    return apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    })
  },

  // 책 수정
  updateBook: async (bookId, bookData) => {
    return apiRequest(`/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    })
  },

  // 책 삭제
  deleteBook: async (bookId) => {
    return apiRequest(`/books/${bookId}`, {
      method: 'DELETE',
    })
  },

  // 책 상세 정보 가져오기
  getBookById: async (bookId) => {
    return apiRequest(`/books/${bookId}`)
  },
}

/**
 * 독서 세션 관련 API
 */
export const readingSessionAPI = {
  // 독서 세션 시작
  startSession: async (bookId) => {
    return apiRequest('/reading-sessions', {
      method: 'POST',
      body: JSON.stringify({ bookId }),
    })
  },

  // 독서 세션 종료
  endSession: async (sessionId, pagesRead) => {
    return apiRequest(`/reading-sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify({ pagesRead }),
    })
  },

  // 현재 활성 세션 가져오기
  getActiveSession: async () => {
    return apiRequest('/reading-sessions/active')
  },
}

/**
 * 포스팅 관련 API
 */
export const postingAPI = {
  // 포스팅 목록 가져오기
  getPostings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/postings?${queryString}` : '/postings'
    return apiRequest(endpoint)
  },

  // 포스팅 작성
  createPosting: async (postingData) => {
    return apiRequest('/postings', {
      method: 'POST',
      body: JSON.stringify(postingData),
    })
  },

  // 포스팅 수정
  updatePosting: async (postingId, postingData) => {
    return apiRequest(`/postings/${postingId}`, {
      method: 'PUT',
      body: JSON.stringify(postingData),
    })
  },

  // 포스팅 삭제
  deletePosting: async (postingId) => {
    return apiRequest(`/postings/${postingId}`, {
      method: 'DELETE',
    })
  },

  // 포스팅 상세 정보 가져오기
  getPostingById: async (postingId) => {
    return apiRequest(`/postings/${postingId}`)
  },
}

/**
 * 좋아요 관련 API
 */
export const likeAPI = {
  // 좋아요 추가/제거
  toggleLike: async (postingId) => {
    return apiRequest(`/postings/${postingId}/like`, {
      method: 'POST',
    })
  },
}

/**
 * 댓글 관련 API
 */
export const commentAPI = {
  // 댓글 작성
  createComment: async (postingId, content) => {
    return apiRequest(`/postings/${postingId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  },

  // 댓글 삭제
  deleteComment: async (commentId) => {
    return apiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    })
  },
}

export default {
  authAPI,
  bookAPI,
  readingSessionAPI,
  postingAPI,
  likeAPI,
  commentAPI,
}


