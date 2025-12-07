import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Kakao Map API 스크립트 동적 로드
const loadKakaoMapScript = () => {
  const KAKAO_MAP_API_KEY = import.meta.env.VITE_KaKaoMap || '33f577be97a1a3de92c74a389a022fe7'
  
  if (document.getElementById('kakao-map-script').src) {
    return // 이미 로드됨
  }

  const script = document.createElement('script')
  script.id = 'kakao-map-script'
  script.type = 'text/javascript'
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&libraries=services`
  script.async = true
  script.onload = () => {
    console.log('✅ Kakao Map SDK script loaded')
    if (window.kakao && window.kakao.maps) {
      console.log('✅ window.kakao.maps is available')
    } else {
      console.warn('⚠️ window.kakao.maps not available yet')
    }
  }
  script.onerror = () => {
    console.error('❌ Kakao Map SDK script failed to load')
    console.error('Check Network tab and API key restrictions')
  }
  document.body.appendChild(script)
}

// Kakao Map 스크립트 로드
loadKakaoMapScript()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
