import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 세션에서 사용자 정보 로드
  useEffect(() => {
    const loadUser = async () => {
      const sessionUser = sessionStorage.getItem('user')
      const token = sessionStorage.getItem('token')

      if (sessionUser && token) {
        try {
          const userData = JSON.parse(sessionUser)
          // 토큰이 있으면 서버에서 사용자 정보 확인
          try {
            const currentUser = await authAPI.getCurrentUser()
            setUser(currentUser.user)
          } catch (error) {
            // 토큰이 만료되었거나 유효하지 않으면 세션 초기화
            console.error('Failed to verify user:', error)
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
            setUser(null)
          }
        } catch (error) {
          console.error('Failed to parse user session:', error)
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  // 로그인 함수
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      const { user: userData, token } = response

      // 세션에 저장
      sessionStorage.setItem('user', JSON.stringify(userData))
      if (token) {
        sessionStorage.setItem('token', token)
      }
      setUser(userData)
      return userData
    } catch (error) {
      throw new Error(error.message || '로그인에 실패했습니다.')
    }
  }

  // 회원가입 함수
  const signup = async (email, password, name) => {
    try {
      const response = await authAPI.signup(email, password, name)
      const { user: userData, token } = response

      // 세션에 저장
      sessionStorage.setItem('user', JSON.stringify(userData))
      if (token) {
        sessionStorage.setItem('token', token)
      }
      setUser(userData)
      return userData
    } catch (error) {
      console.error('Signup error:', error)
      // 원본 에러 메시지를 그대로 전달 (이미 api.js에서 처리됨)
      throw error
    }
  }

  // 로그아웃 함수
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
      setUser(null)
    }
  }

  // OAuth 로그인 함수 (콜백에서 사용)
  const setOAuthUser = async (userData, token) => {
    sessionStorage.setItem('user', JSON.stringify(userData))
    if (token) {
      sessionStorage.setItem('token', token)
    }
    setUser(userData)
    return userData
  }

  // 사용자 정보 업데이트 함수
  const updateUser = (userData) => {
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    setOAuthUser,
    updateUser,
    setUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}





