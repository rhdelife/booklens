# OAuth 설정 가이드

구글과 네이버 OAuth 로그인 기능을 사용하기 위한 설정 가이드입니다.

## 📋 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Naver OAuth
VITE_NAVER_CLIENT_ID=your_naver_client_id_here
```

## 🔵 구글 OAuth 설정

### 1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **사용자 인증 정보**로 이동
4. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션**
6. 승인된 리디렉션 URI 추가:
   - 개발 환경: `http://localhost:5173/auth/google/callback`
   - 프로덕션 환경: `https://yourdomain.com/auth/google/callback`
7. 클라이언트 ID를 복사하여 `.env` 파일의 `VITE_GOOGLE_CLIENT_ID`에 설정

### 2. OAuth 동의 화면 설정

1. **OAuth 동의 화면** 메뉴로 이동
2. 사용자 유형 선택 (외부 또는 내부)
3. 앱 정보 입력:
   - 앱 이름: BookLens
   - 사용자 지원 이메일: your-email@example.com
   - 개발자 연락처 정보: your-email@example.com
4. 범위 추가:
   - `openid`
   - `email`
   - `profile`
5. 테스트 사용자 추가 (테스트 모드인 경우)

## 🟢 네이버 OAuth 설정

### 1. 네이버 개발자 센터 설정

1. [네이버 개발자 센터](https://developers.naver.com/)에 접속
2. **내 애플리케이션** > **애플리케이션 등록**
3. 애플리케이션 정보 입력:
   - 애플리케이션 이름: BookLens
   - 사용 API: 네이버 로그인
   - 로그인 오픈 API 서비스 환경: PC 웹
   - 서비스 URL: `http://localhost:5173` (개발 환경)
   - Callback URL: `http://localhost:5173/auth/naver/callback`
4. 애플리케이션 등록 후 **Client ID**를 복사하여 `.env` 파일의 `VITE_NAVER_CLIENT_ID`에 설정

### 2. 프로덕션 환경 설정

프로덕션 환경에서는 다음 URL을 추가해야 합니다:
- 서비스 URL: `https://yourdomain.com`
- Callback URL: `https://yourdomain.com/auth/naver/callback`

## 🔧 백엔드 API 엔드포인트

백엔드에서 다음 엔드포인트를 구현해야 합니다:

### 구글 OAuth 콜백
```
POST /api/auth/google/callback
Body: { code: string, state: string }
Response: { user: User, token: string }
```

### 네이버 OAuth 콜백
```
POST /api/auth/naver/callback
Body: { code: string, state: string }
Response: { user: User, token: string }
```

## 🔄 OAuth 플로우

### 1. 사용자가 OAuth 버튼 클릭
```javascript
// LoginPage 또는 SignupPage에서
import { startGoogleLogin, startNaverLogin } from '../services/oauth'

// 구글 로그인
<button onClick={startGoogleLogin}>Google로 로그인</button>

// 네이버 로그인
<button onClick={startNaverLogin}>Naver로 로그인</button>
```

### 2. OAuth 제공자로 리다이렉트
- 사용자가 구글/네이버 로그인 페이지로 이동
- 로그인 후 콜백 URL로 리다이렉트

### 3. 콜백 처리
- `/auth/google/callback` 또는 `/auth/naver/callback`로 이동
- `OAuthCallbackPage` 컴포넌트가 자동으로 처리
- 백엔드 API를 통해 토큰 교환 및 사용자 정보 가져오기
- 로그인 완료 후 홈으로 리다이렉트

## 🔐 보안 고려사항

1. **State 파라미터**: CSRF 공격 방지를 위해 state 파라미터를 사용합니다.
2. **HTTPS 사용**: 프로덕션 환경에서는 반드시 HTTPS를 사용하세요.
3. **토큰 저장**: JWT 토큰은 sessionStorage에 저장됩니다.
4. **에러 처리**: OAuth 인증 실패 시 적절한 에러 메시지를 표시합니다.

## 🧪 테스트

### 개발 환경 테스트

1. `.env` 파일에 클라이언트 ID 설정
2. 개발 서버 실행: `npm run dev`
3. 로그인 페이지에서 OAuth 버튼 클릭
4. OAuth 제공자에서 로그인
5. 콜백 페이지에서 자동 로그인 처리 확인

### 문제 해결

**문제**: "Invalid state parameter" 에러
- **해결**: 브라우저의 쿠키/세션 스토리지가 차단되어 있을 수 있습니다. 브라우저 설정 확인

**문제**: "OAuth 인증 정보가 없습니다" 에러
- **해결**: 콜백 URL이 올바르게 설정되었는지 확인

**문제**: CORS 에러
- **해결**: 백엔드에서 CORS 설정 확인 및 프런트엔드 URL 허용

## 📝 참고 자료

- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [네이버 로그인 API 가이드](https://developers.naver.com/docs/login/overview/)
- [OAuth 2.0 스펙](https://oauth.net/2/)



