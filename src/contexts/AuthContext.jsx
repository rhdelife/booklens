import { createContext, useContext, useState, useEffect } from 'react'

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
    const sessionUser = sessionStorage.getItem('user')
    if (sessionUser) {
      try {
        setUser(JSON.parse(sessionUser))
      } catch (error) {
        console.error('Failed to parse user session:', error)
        sessionStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // 로그인 함수
  const login = async (email, password) => {
    // 테스트 계정 처리
    if (email === 'test@com' && password === '1234') {
      const userData = {
        id: 1,
        email: 'test@com',
        name: 'test',
        createdAt: new Date().toISOString(),
      }
      sessionStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return userData
    }

    // 실제로는 API 호출을 해야 하지만, 여기서는 간단한 시뮬레이션
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('올바른 이메일 형식이 아닙니다.')
    }

    if (password.length < 6) {
      throw new Error('비밀번호는 최소 6자 이상이어야 합니다.')
    }

    // 더미 사용자 데이터 생성
    const userData = {
      id: Date.now(),
      email: email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    }

    // 세션에 저장
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  // 회원가입 함수
  const signup = async (email, password) => {
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('올바른 이메일 형식이 아닙니다.')
    }

    if (password.length < 6) {
      throw new Error('비밀번호는 최소 6자 이상이어야 합니다.')
    }

    // 기존 사용자 확인 (실제로는 서버에서 확인)
    const existingUser = sessionStorage.getItem('user')
    if (existingUser) {
      const parsed = JSON.parse(existingUser)
      if (parsed.email === email) {
        throw new Error('이미 가입된 이메일입니다.')
      }
    }

    // 더미 사용자 데이터 생성
    const userData = {
      id: Date.now(),
      email: email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    }

    // 세션에 저장
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  // 로그아웃 함수
  const logout = () => {
    sessionStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}





