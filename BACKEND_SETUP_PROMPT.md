# BookLens2 백엔드 개발 프롬프트

이 프롬프트를 사용하여 BookLens2 백엔드 API를 구현하세요.

## 📋 프로젝트 개요

BookLens2는 독서 관리 플랫폼으로, 사용자가 책을 추가하고 독서 진행을 관리하며, 독서 후기를 공유할 수 있는 서비스입니다.

## 🗂️ 백엔드 폴더 구조

```
backend/
├── database/
│   ├── schema.sql              # PostgreSQL 스키마
│   └── README.md               # 스키마 상세 문서
├── migrations/                 # 데이터베이스 마이그레이션
├── src/
│   ├── config/
│   │   └── database.js        # DB 연결 설정 (완료)
│   ├── controllers/           # 컨트롤러 (구현 필요)
│   │   ├── authController.js
│   │   ├── booksController.js
│   │   ├── sessionsController.js
│   │   ├── postingsController.js
│   │   └── statsController.js
│   ├── models/                # 데이터 모델 (구현 필요)
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── ReadingSession.js
│   │   └── Posting.js
│   ├── routes/                # 라우트 (구현 필요)
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── sessions.js
│   │   ├── postings.js
│   │   └── stats.js
│   ├── middleware/            # 미들웨어
│   │   ├── auth.js           # 인증 (완료)
│   │   └── errorHandler.js   # 에러 핸들링 (완료)
│   ├── utils/                 # 유틸리티 (구현 필요)
│   │   ├── validation.js
│   │   └── helpers.js
│   └── server.js              # 서버 진입점 (완료)
├── .env.example               # 환경 변수 예시 (완료)
├── package.json                # 패키지 설정 (완료)
└── README.md                   # 프로젝트 문서 (완료)
```

## 🚀 구현해야 할 기능

### 1. 인증 (Authentication)

**엔드포인트:**
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃 (선택적)
- `GET /api/auth/me` - 현재 사용자 정보

**요구사항:**
- 이메일/비밀번호 기반 인증
- 비밀번호는 bcrypt로 해싱
- JWT 토큰 발급
- 이메일 중복 검사
- 이메일 형식 검증

**요청 예시:**
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}

POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답 예시:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동"
  }
}
```

### 2. 책 관리 (Books)

**엔드포인트:**
- `GET /api/books` - 사용자의 책 목록 조회
- `GET /api/books/:id` - 책 상세 조회
- `POST /api/books` - 책 추가
- `PUT /api/books/:id` - 책 수정
- `DELETE /api/books/:id` - 책 삭제

**요구사항:**
- 사용자별 책 목록 조회
- 상태별 필터링 (not_started, reading, completed)
- 진행률 자동 계산
- ISBN 중복 검사 (같은 사용자 내에서)

**요청 예시:**
```json
POST /api/books
{
  "title": "해리포터와 마법사의 돌",
  "author": "J.K. 롤링",
  "publisher": "문학수첩",
  "publishDate": "2025.08.06",
  "totalPage": 256,
  "isbn": "9791199364462",
  "thumbnail": "https://...",
  "memo": "재미있는 책"
}
```

### 3. 독서 세션 (Reading Sessions)

**엔드포인트:**
- `GET /api/sessions` - 세션 목록 조회
- `GET /api/sessions/active` - 활성 세션 조회
- `POST /api/sessions/start` - 독서 시작
- `POST /api/sessions/:id/end` - 독서 종료

**요구사항:**
- 한 사용자는 한 번에 하나의 활성 세션만 가능
- 세션 시작 시 이전 활성 세션 자동 종료
- 24시간 이상 지난 활성 세션 자동 만료 처리
- 세션 종료 시 책의 읽은 페이지 및 독서 시간 업데이트

**요청 예시:**
```json
POST /api/sessions/start
{
  "bookId": 1
}

POST /api/sessions/1/end
{
  "pagesRead": 50
}
```

### 4. 포스팅 (Postings)

**엔드포인트:**
- `GET /api/postings` - 포스팅 목록 조회 (검색, 필터링, 정렬)
- `GET /api/postings/:id` - 포스팅 상세 조회
- `POST /api/postings` - 포스팅 작성
- `PUT /api/postings/:id` - 포스팅 수정
- `DELETE /api/postings/:id` - 포스팅 삭제

**요구사항:**
- 검색: 제목, 저자, 내용, 태그로 검색
- 필터링: 내 포스트만 보기
- 정렬: 최신순, 평점순, 오래된순
- 태그 시스템 (다대다 관계)
- 조회수 증가

**쿼리 파라미터:**
```
GET /api/postings?search=해리포터&sortBy=rating&showMyPosts=true&page=1&limit=10
```

### 5. 통계 (Statistics)

**엔드포인트:**
- `GET /api/stats` - 사용자 독서 통계

**응답 예시:**
```json
{
  "totalBooks": 10,
  "readingBooks": 3,
  "completedBooks": 7,
  "totalReadingTimeSeconds": 36000,
  "totalPostings": 5
}
```

### 6. 위치 검색 (Locations) - 선택적

**엔드포인트:**
- `GET /api/locations/search?isbn=9791199364462` - 책으로 위치 검색

## 📝 구현 가이드

### 1. 컨트롤러 작성 패턴

```javascript
// src/controllers/booksController.js
import { query } from '../config/database.js';

export const getBooks = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { status } = req.query;
    
    let sql = 'SELECT * FROM books WHERE user_id = $1';
    const params = [userId];
    
    if (status) {
      sql += ' AND status = $2';
      params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { title, author, totalPage, isbn, ...otherFields } = req.body;
    
    // 진행률 계산
    const progress = totalPage > 0 ? Math.round((0 / totalPage) * 100) : 0;
    
    const result = await query(
      `INSERT INTO books (user_id, title, author, total_page, isbn, progress, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'reading', CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, title, author, totalPage, isbn, progress]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
```

### 2. 라우트 작성 패턴

```javascript
// src/routes/books.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/booksController.js';

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticate);

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
```

### 3. 서버에 라우트 등록

```javascript
// src/server.js
import booksRoutes from './routes/books.js';
import authRoutes from './routes/auth.js';
// ... 기타 라우트

app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);
```

## 🔒 보안 고려사항

1. **비밀번호 해싱**: bcrypt 사용 (salt rounds: 10)
2. **JWT 토큰**: 만료 시간 설정 (7일)
3. **SQL Injection 방지**: Prepared Statement 사용 (query 함수 사용)
4. **입력 검증**: express-validator 사용
5. **CORS 설정**: 프론트엔드 도메인만 허용
6. **에러 메시지**: 프로덕션에서는 상세 에러 숨김

## 🧪 테스트 예시

### 회원가입
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"테스트"}'
```

### 로그인
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 책 추가
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"해리포터","author":"J.K.롤링","totalPage":256}'
```

## 📚 참고 자료

- Express.js 공식 문서: https://expressjs.com/
- PostgreSQL node-postgres: https://node-postgres.com/
- JWT: https://jwt.io/
- bcrypt: https://www.npmjs.com/package/bcrypt

## ✅ 체크리스트

- [ ] 인증 시스템 구현
- [ ] 책 CRUD 구현
- [ ] 독서 세션 관리 구현
- [ ] 포스팅 CRUD 구현
- [ ] 검색/필터링/정렬 구현
- [ ] 통계 API 구현
- [ ] 에러 핸들링
- [ ] 입력 검증
- [ ] API 문서화 (Swagger 선택적)

## 🎯 다음 단계

1. 인증 컨트롤러 및 라우트 구현
2. 책 관리 API 구현
3. 독서 세션 API 구현
4. 포스팅 API 구현
5. 통계 API 구현
6. 프론트엔드와 연동 테스트






