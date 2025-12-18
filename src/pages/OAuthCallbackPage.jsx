import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { handleGoogleCallback, handleNaverCallback } from '../services/oauth'

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setOAuthUser } = useAuth()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const errorParam = searchParams.get('error')

        // OAuth 에러 처리
        if (errorParam) {
          throw new Error('OAuth 인증이 취소되었습니다.')
        }

        if (!code || !state) {
          throw new Error('OAuth 인증 정보가 없습니다.')
        }

        // 현재 경로에서 provider 확인
        const pathname = window.location.pathname
        let userData

        if (pathname.includes('/google')) {
          userData = await handleGoogleCallback(code, state)
        } else if (pathname.includes('/naver')) {
          userData = await handleNaverCallback(code, state)
        } else {
          throw new Error('알 수 없는 OAuth 제공자입니다.')
        }

        // 사용자 정보 저장 및 리다이렉트
        if (userData && userData.user) {
          await setOAuthUser(userData.user, userData.token)
          navigate('/', { replace: true })
        } else {
          throw new Error('사용자 정보를 가져올 수 없습니다.')
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError(err.message || 'OAuth 인증에 실패했습니다.')
        setLoading(false)
        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      }
    }

    processCallback()
  }, [searchParams, navigate, setOAuthUser])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">로그인 처리 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-100 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 실패</h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <p className="text-gray-400 text-xs">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    )
  }

  return null
}

export default OAuthCallbackPage



