/**
 * OAuth 서비스
 * 구글, 네이버 OAuth 인증 처리
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * 구글 OAuth 로그인 URL 생성
 */
export const getGoogleOAuthUrl = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const redirectUri = `${window.location.origin}/auth/google/callback`
  const scope = 'openid email profile'
  const responseType = 'code'
  const state = generateState()

  // state를 sessionStorage에 저장 (CSRF 방지)
  sessionStorage.setItem('oauth_state', state)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope: scope,
    state: state,
    access_type: 'offline',
    prompt: 'consent',
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * 네이버 OAuth 로그인 URL 생성
 */
export const getNaverOAuthUrl = () => {
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID
  const redirectUri = `${window.location.origin}/auth/naver/callback`
  const state = generateState()
  const responseType = 'code'

  // state를 sessionStorage에 저장 (CSRF 방지)
  sessionStorage.setItem('oauth_state', state)

  const params = new URLSearchParams({
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
  })

  return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`
}

/**
 * OAuth 콜백 처리 (구글)
 */
export const handleGoogleCallback = async (code, state) => {
  // state 검증
  const savedState = sessionStorage.getItem('oauth_state')
  if (!savedState || savedState !== state) {
    throw new Error('Invalid state parameter. Possible CSRF attack.')
  }

  sessionStorage.removeItem('oauth_state')

  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '구글 로그인에 실패했습니다.' }))
      throw new Error(errorData.message || '구글 로그인에 실패했습니다.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    throw error
  }
}

/**
 * OAuth 콜백 처리 (네이버)
 */
export const handleNaverCallback = async (code, state) => {
  // state 검증
  const savedState = sessionStorage.getItem('oauth_state')
  if (!savedState || savedState !== state) {
    throw new Error('Invalid state parameter. Possible CSRF attack.')
  }

  sessionStorage.removeItem('oauth_state')

  try {
    const response = await fetch(`${API_BASE_URL}/auth/naver/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '네이버 로그인에 실패했습니다.' }))
      throw new Error(errorData.message || '네이버 로그인에 실패했습니다.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Naver OAuth callback error:', error)
    throw error
  }
}

/**
 * CSRF 방지를 위한 state 생성
 */
const generateState = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * OAuth 로그인 시작 (구글)
 */
export const startGoogleLogin = () => {
  const url = getGoogleOAuthUrl()
  window.location.href = url
}

/**
 * OAuth 로그인 시작 (네이버)
 */
export const startNaverLogin = () => {
  const url = getNaverOAuthUrl()
  window.location.href = url
}

