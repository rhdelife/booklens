# 프런트엔드-백엔드 연동 가이드

## 📋 전체 설정 순서

### 1. 백엔드 설정

```bash
# 백엔드 폴더로 이동
cd booklens2-backend

# 의존성 설치
npm install

# .env 파일 생성 및 설정
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 및 OAuth 정보 입력

# PostgreSQL 데이터베이스 생성 및 스키마 적용
psql -U postgres -c "CREATE DATABASE booklens2;"
psql -U postgres -d booklens2 -f database/schema.sql

# 서버 실행
npm run dev
```

### 2. 프런트엔드 설정

```bash
# 프런트엔드 폴더로 이동
cd booklens2

# .env 파일 생성 (없는 경우)
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# 개발 서버 실행
npm run dev
```

## 🔗 연동 확인

### 1. 백엔드 서버 확인

브라우저에서 `http://localhost:3000/api/health` 접속 또는:

```bash
curl http://localhost:3000/api/health
```

응답: `{"status":"ok","message":"BookLens2 API Server is running"}`

### 2. 프런트엔드에서 테스트

1. **일반 로그인 테스트**
   - `http://localhost:5173/login` 접속
   - 이메일/비밀번호로 회원가입 후 로그인

2. **OAuth 로그인 테스트**
   - 구글/네이버 로그인 버튼 클릭
   - OAuth 인증 완료 후 자동 로그인 확인

## 🔧 환경 변수 설정

### 백엔드 (.env)

```env
# 데이터베이스
DB_HOST=localhost
DB_PORT=5432
DB_NAME=booklens2
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# 서버
PORT=3000
NODE_ENV=development

# CORS (프런트엔드 URL)
CORS_ORIGIN=http://localhost:5173

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### 프런트엔드 (.env)

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_NAVER_CLIENT_ID=your_naver_client_id
```

## 📡 API 엔드포인트

### 인증

- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입
- `GET /api/auth/me` - 현재 사용자 정보
- `POST /api/auth/google/callback` - 구글 OAuth 콜백
- `POST /api/auth/naver/callback` - 네이버 OAuth 콜백

### 책 관리

- `GET /api/books` - 내 도서 목록
- `GET /api/books/:id` - 책 상세
- `POST /api/books` - 책 추가
- `PUT /api/books/:id` - 책 수정
- `DELETE /api/books/:id` - 책 삭제

### 포스팅

- `GET /api/postings` - 포스팅 목록
- `GET /api/postings/:id` - 포스팅 상세
- `POST /api/postings` - 포스팅 작성
- `PUT /api/postings/:id` - 포스팅 수정
- `DELETE /api/postings/:id` - 포스팅 삭제

### 독서 세션

- `GET /api/reading-sessions/active` - 활성 세션
- `GET /api/reading-sessions` - 세션 목록
- `POST /api/reading-sessions` - 세션 시작
- `PUT /api/reading-sessions/:id` - 세션 종료

## 🐛 문제 해결

### CORS 오류

**증상**: 브라우저 콘솔에 CORS 에러

**해결**:
1. 백엔드 `.env`의 `CORS_ORIGIN`이 프런트엔드 URL과 일치하는지 확인
2. 백엔드 서버 재시작

### 인증 오류

**증상**: "Authentication required" 에러

**해결**:
1. 로그인 후 토큰이 저장되었는지 확인 (브라우저 개발자 도구 > Application > Session Storage)
2. 토큰이 만료되었으면 다시 로그인

### 데이터베이스 연결 오류

**증상**: "Database connection error"

**해결**:
1. PostgreSQL이 실행 중인지 확인: `pg_isready`
2. `.env`의 데이터베이스 정보 확인
3. 데이터베이스가 생성되었는지 확인: `psql -U postgres -l`

### OAuth 오류

**증상**: OAuth 로그인 실패

**해결**:
1. OAuth Client ID/Secret이 올바른지 확인
2. 리디렉션 URI가 OAuth 제공자 설정과 일치하는지 확인
3. 백엔드와 프런트엔드의 `.env` 설정 확인

## 📝 다음 단계

1. **프런트엔드에서 백엔드 API 사용**
   - `MyLibraryPage`에서 `bookAPI` 사용
   - `CommunityPage`에서 `postingAPI` 사용
   - `ReadingStartModal`/`ReadingEndModal`에서 `readingSessionAPI` 사용

2. **에러 핸들링 개선**
   - 전역 에러 핸들러 추가
   - 사용자 친화적인 에러 메시지

3. **로딩 상태 관리**
   - 전역 로딩 상태
   - 스켈레톤 UI

4. **테스트**
   - API 엔드포인트 테스트
   - 통합 테스트



