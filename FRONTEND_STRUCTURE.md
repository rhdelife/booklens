# BookLens2 프런트엔드 구조

## 📋 요구사항 충족 현황

### ✅ 1. 라우팅 구조 구성
- **React Router DOM** 사용
- **Public Routes**: 모든 사용자 접근 가능
- **Protected Routes**: 인증이 필요한 페이지 보호

### ✅ 2. 최소 3개 이상의 주요 UI 페이지
현재 **9개의 주요 페이지** 구현:
1. **HomePage** - 메인 랜딩 페이지
2. **LoginPage** - 로그인 페이지
3. **SignupPage** - 회원가입 페이지
4. **MyLibraryPage** - 내 도서관 (Protected)
5. **CommunityPage** - 커뮤니티
6. **GalleryPage** - 책 갤러리
7. **PostingPage** - 포스팅 작성 (Protected)
8. **BookDetailPage** - 책 상세 정보
9. **MapPage** - 도서관/서점 지도

### ✅ 3. 서버 API 연동
- **API 서비스 레이어** (`src/services/api.js`) 구현
- 백엔드 API 연동 준비 완료
- Google Books API 연동 (외부 API)
- Data4Library API 연동 (외부 API)

### ✅ 4. 사용자 입력 Form + Validation
- **Validation 유틸리티** (`src/utils/validation.js`) 구현
- **실시간 검증** 기능
- **에러 메시지 표시**
- 주요 Form 페이지:
  - LoginPage
  - SignupPage
  - MyLibraryPage (책 추가 폼)

---

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ProtectedRoute.jsx    # 인증 보호 라우트
│   ├── Navbar.jsx
│   ├── TextPressure.jsx
│   └── ...
├── contexts/           # React Context
│   └── AuthContext.jsx      # 인증 상태 관리
├── lib/                # 외부 API 연동
│   ├── googleBooksApi.js
│   └── data4libraryApi.js
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── MyLibraryPage.jsx
│   └── ...
├── services/           # 백엔드 API 서비스
│   └── api.js                # API 클라이언트
├── utils/              # 유틸리티 함수
│   └── validation.js         # Form 검증 함수
├── App.jsx             # 메인 앱 컴포넌트 (라우팅)
└── main.jsx            # 진입점
```

---

## 🛣️ 라우팅 구조

### Public Routes (인증 불필요)
```jsx
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
<Route path="/gallery" element={<GalleryPage />} />
<Route path="/book/:id" element={<BookDetailPage />} />
<Route path="/map" element={<MapPage />} />
<Route path="/community" element={<CommunityPage />} />
```

### Protected Routes (인증 필요)
```jsx
<Route
  path="/mylibrary"
  element={
    <ProtectedRoute>
      <MyLibraryPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/posting"
  element={
    <ProtectedRoute>
      <PostingPage />
    </ProtectedRoute>
  }
/>
```

---

## 🔌 API 연동

### 백엔드 API 서비스 (`src/services/api.js`)

#### 인증 API
```javascript
import { authAPI } from './services/api'

// 로그인
await authAPI.login(email, password)

// 회원가입
await authAPI.signup(email, password, name)

// 로그아웃
await authAPI.logout()

// 현재 사용자 정보
await authAPI.getCurrentUser()
```

#### 책 API
```javascript
import { bookAPI } from './services/api'

// 내 도서 목록
await bookAPI.getMyBooks()

// 책 추가
await bookAPI.addBook(bookData)

// 책 수정
await bookAPI.updateBook(bookId, bookData)

// 책 삭제
await bookAPI.deleteBook(bookId)
```

#### 포스팅 API
```javascript
import { postingAPI } from './services/api'

// 포스팅 목록
await postingAPI.getPostings({ sortBy: 'latest' })

// 포스팅 작성
await postingAPI.createPosting(postingData)

// 포스팅 수정
await postingAPI.updatePosting(postingId, postingData)
```

### 환경 변수 설정
`.env` 파일에 다음 변수 설정:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_BOOKS_API_KEY=your_api_key
```

---

## ✅ Form Validation

### Validation 유틸리티 (`src/utils/validation.js`)

#### 사용 가능한 검증 함수
- `validateEmail(email)` - 이메일 형식 검증
- `validatePassword(password, options)` - 비밀번호 검증
- `validatePasswordConfirm(password, confirm)` - 비밀번호 확인
- `validateRequired(value, fieldName)` - 필수 필드 검증
- `validateLength(value, min, max, fieldName)` - 문자열 길이 검증
- `validateNumberRange(value, min, max, fieldName)` - 숫자 범위 검증
- `validateISBN(isbn)` - ISBN 형식 검증
- `validateURL(url)` - URL 형식 검증
- `validateDate(date, fieldName)` - 날짜 검증
- `validateRating(rating)` - 평점 검증 (1-5)

### 사용 예시

#### LoginPage
```javascript
import { validateEmail, validatePassword } from '../utils/validation'

const validateField = (field, value) => {
  let validation = null
  switch (field) {
    case 'email':
      validation = validateEmail(value)
      break
    case 'password':
      validation = validatePassword(value, { minLength: 6 })
      break
  }
  
  if (validation && !validation.isValid) {
    setErrors((prev) => ({ ...prev, [field]: validation.error }))
  }
}
```

#### SignupPage
```javascript
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from '../utils/validation'

// 전체 폼 검증
const emailValidation = validateEmail(email)
const passwordValidation = validatePassword(password, { minLength: 6 })
const passwordConfirmValidation = validatePasswordConfirm(password, confirmPassword)

if (!emailValidation.isValid || !passwordValidation.isValid) {
  setErrors({
    email: emailValidation.error,
    password: passwordValidation.error,
    confirmPassword: passwordConfirmValidation.error,
  })
  return
}
```

#### MyLibraryPage
```javascript
import { validateRequired, validateNumberRange, validateISBN } from '../utils/validation'

// 책 추가 폼 검증
const titleValidation = validateRequired(formData.title, '책 제목')
const authorValidation = validateRequired(formData.author, '저자')
const totalPageValidation = validateNumberRange(
  parseInt(formData.totalPage, 10),
  1,
  10000,
  '총 페이지 수'
)

// ISBN 검색 검증
const isbnValidation = validateISBN(formData.isbn)
```

---

## 🔐 인증 시스템

### AuthContext (`src/contexts/AuthContext.jsx`)
- 사용자 인증 상태 관리
- 로그인/회원가입/로그아웃 함수 제공
- 세션 스토리지 기반 인증

### ProtectedRoute (`src/components/ProtectedRoute.jsx`)
- 인증이 필요한 페이지 보호
- 미인증 사용자는 로그인 페이지로 리다이렉트

### 사용 예시
```javascript
import { useAuth } from '../contexts/AuthContext'

const MyComponent = () => {
  const { user, login, logout } = useAuth()
  
  if (!user) {
    // 로그인 필요
  }
  
  return <div>인증된 사용자: {user.name}</div>
}
```

---

## 🎨 UI/UX

### 디자인 시스템
- **스타일**: FocusFlight 스타일 적용
- **색상**: 그레이 스케일 기반 (`gray-900`, `gray-500`, `gray-100`)
- **타이포그래피**: SF Pro Display, 시스템 폰트 스택
- **컴포넌트**: Tailwind CSS 기반

### 주요 UI 컴포넌트
- **Navbar**: 상단 네비게이션 바
- **TextPressure**: 텍스트 애니메이션 컴포넌트
- **Modal**: 모달 컴포넌트들 (ReadingStartModal, ReadingEndModal 등)
- **Toast**: 토스트 메시지 컴포넌트

---

## 📝 주요 기능

### 1. 책 관리
- 책 추가 (ISBN 검색 또는 수동 입력)
- 독서 진행률 추적
- 독서 세션 관리
- 완독 처리

### 2. 커뮤니티
- 포스팅 작성/수정/삭제
- 포스팅 검색 및 필터링
- 태그 시스템

### 3. 지도 기능
- 도서관/서점 위치 표시
- 책별 재고 정보 확인

### 4. 갤러리
- 출판사별 책 표지 모음
- 독서 진행률 시각화

---

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

---

## 📦 주요 의존성

- **react**: ^18.2.0
- **react-router-dom**: ^6.20.0
- **tailwindcss**: ^3.3.0
- **vite**: ^5.0.0

---

## 🔄 향후 개선 사항

1. **백엔드 API 연동 완료**
   - 현재는 localStorage 기반, 백엔드 API로 전환 예정

2. **에러 핸들링 강화**
   - 전역 에러 핸들러 추가
   - API 에러 메시지 표시 개선

3. **로딩 상태 관리**
   - 전역 로딩 상태 관리
   - 스켈레톤 UI 추가

4. **테스트 코드 작성**
   - Unit Test
   - Integration Test
   - E2E Test




