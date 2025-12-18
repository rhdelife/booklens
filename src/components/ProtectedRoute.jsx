import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Protected Route 컴포넌트
 * 인증이 필요한 페이지를 보호합니다.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // 로딩 중일 때는 아무것도 렌더링하지 않음
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900"></div>
      </div>
    )
  }

  // 사용자가 로그인하지 않았으면 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 인증된 사용자는 요청한 페이지를 렌더링
  return children
}

export default ProtectedRoute




