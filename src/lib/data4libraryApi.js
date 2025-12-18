/**
 * data4library API를 사용하여 도서관 정보를 가져오는 함수
 * API 문서: http://data4library.kr/api/libSrchByBook
 */

const DATA4LIBRARY_API_KEY = import.meta.env.VITE_DATA4LIBRARY_API_KEY
// 개발 환경에서는 프록시 사용, 프로덕션에서는 직접 호출
const DATA4LIBRARY_API_URL = import.meta.env.DEV
  ? '/api/data4library/libSrchByBook'
  : 'http://data4library.kr/api/libSrchByBook'

// API 키 확인
const hasValidApiKey = () => {
  return DATA4LIBRARY_API_KEY &&
    DATA4LIBRARY_API_KEY !== 'YOUR_API_KEY' &&
    DATA4LIBRARY_API_KEY.trim() !== ''
}

/**
 * ISBN으로 도서를 보유한 도서관 검색
 * @param {string} isbn - ISBN 번호 (13자리 권장)
 * @returns {Promise<Array>} 도서관 정보 배열
 */
export const searchLibrariesByBook = async (isbn) => {
  try {
    if (!isbn) {
      throw new Error('ISBN이 필요합니다.')
    }

    // ISBN에서 하이픈 제거
    const cleanISBN = isbn.replace(/-/g, '')

    // API 키가 있으면 사용, 없으면 공개 API로 시도
    const url = hasValidApiKey()
      ? `${DATA4LIBRARY_API_URL}?authKey=${DATA4LIBRARY_API_KEY}&isbn13=${cleanISBN}&format=json`
      : `${DATA4LIBRARY_API_URL}?isbn13=${cleanISBN}&format=json`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`)
    }

    // XML 또는 JSON 응답 처리
    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      // XML 응답인 경우 텍스트로 받아서 파싱
      const xmlText = await response.text()
      data = parseXMLResponse(xmlText)
    }

    // 응답 구조에 따라 도서관 정보 추출
    if (data.error) {
      throw new Error(data.error || 'API 오류가 발생했습니다.')
    }

    // JSON 응답 구조: response.libs.lib
    if (data.response && data.response.libs && data.response.libs.lib) {
      const libraries = Array.isArray(data.response.libs.lib)
        ? data.response.libs.lib
        : [data.response.libs.lib]

      return libraries.map(lib => ({
        libCode: lib.libCode || '',
        libName: lib.libName || '',
        address: lib.address || '',
        tel: lib.tel || '',
        homepage: lib.homepage || '',
        closed: lib.closed || '',
        operatingTime: lib.operatingTime || '',
        latitude: lib.latitude ? parseFloat(lib.latitude) : null,
        longitude: lib.longitude ? parseFloat(lib.longitude) : null,
      }))
    }

    return []
  } catch (error) {
    console.error('도서관 검색 오류:', error)
    throw error
  }
}

/**
 * XML 응답을 파싱하는 함수
 * @param {string} xmlText - XML 텍스트
 * @returns {Object} 파싱된 데이터
 */
const parseXMLResponse = (xmlText) => {
  try {
    // 간단한 XML 파싱 (DOMParser 사용)
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

    // 에러 확인
    const errorElement = xmlDoc.querySelector('error')
    if (errorElement) {
      return { error: errorElement.textContent }
    }

    // libs 요소 찾기
    const libs = xmlDoc.querySelectorAll('lib')
    const libraries = []

    libs.forEach(lib => {
      libraries.push({
        libCode: lib.querySelector('libCode')?.textContent || '',
        libName: lib.querySelector('libName')?.textContent || '',
        address: lib.querySelector('address')?.textContent || '',
        tel: lib.querySelector('tel')?.textContent || '',
        homepage: lib.querySelector('homepage')?.textContent || '',
        closed: lib.querySelector('closed')?.textContent || '',
        operatingTime: lib.querySelector('operatingTime')?.textContent || '',
        latitude: lib.querySelector('latitude')?.textContent ? parseFloat(lib.querySelector('latitude').textContent) : null,
        longitude: lib.querySelector('longitude')?.textContent ? parseFloat(lib.querySelector('longitude').textContent) : null,
      })
    })

    return {
      response: {
        libs: {
          lib: libraries
        }
      }
    }
  } catch (error) {
    console.error('XML 파싱 오류:', error)
    return { error: 'XML 파싱에 실패했습니다.' }
  }
}

/**
 * 주소를 좌표로 변환 (카카오맵 Geocoder 사용)
 * @param {string} address - 주소
 * @returns {Promise<{lat: number, lng: number}>} 좌표
 */
export const geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      reject(new Error('카카오맵 SDK가 로드되지 않았습니다.'))
      return
    }

    const geocoder = new window.kakao.maps.services.Geocoder()
    
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resolve({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x)
        })
      } else {
        reject(new Error('주소를 좌표로 변환할 수 없습니다.'))
      }
    })
  })
}

