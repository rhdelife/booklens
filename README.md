# BookLens2

React + Vite 기반의 독서 관리 애플리케이션입니다.

## 환경 설정

### Google Books API 키 발급 방법

#### 1단계: Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. Google 계정으로 로그인합니다.

#### 2단계: 프로젝트 생성
1. 상단의 프로젝트 선택 드롭다운을 클릭합니다.
2. "새 프로젝트"를 클릭합니다.
3. 프로젝트 이름을 입력합니다 (예: "booklens-api").
4. "만들기"를 클릭합니다.
5. 프로젝트가 생성될 때까지 기다립니다 (약 10-30초).

#### 3단계: Books API 활성화
1. 왼쪽 메뉴에서 "API 및 서비스" > "라이브러리"를 클릭합니다.
2. 검색창에 "Books API"를 입력합니다.
3. "Books API"를 선택합니다.
4. "사용" 버튼을 클릭하여 API를 활성화합니다.

#### 4단계: API 키 생성
1. 왼쪽 메뉴에서 "API 및 서비스" > "사용자 인증 정보"를 클릭합니다.
2. 상단의 "+ 사용자 인증 정보 만들기"를 클릭합니다.
3. "API 키"를 선택합니다.
4. API 키가 생성되면 팝업에 표시됩니다.
5. **중요**: 생성된 API 키를 복사해두세요. (나중에 다시 볼 수 없습니다)

#### 5단계: API 키 제한 설정 (선택사항, 권장)
1. 생성된 API 키 옆의 연필 아이콘을 클릭합니다.
2. "API 제한사항" 섹션에서:
   - "키 제한"을 선택합니다.
   - "Books API"만 선택합니다.
3. "애플리케이션 제한사항" 섹션에서:
   - "HTTP 리퍼러(웹사이트)"를 선택합니다.
   - 웹사이트 URL을 추가합니다 (예: `http://localhost:5173/*`).
4. "저장"을 클릭합니다.

#### 6단계: 프로젝트에 API 키 설정
1. 프로젝트 루트 디렉토리에 `.env` 파일을 생성합니다.
2. 다음 내용을 추가합니다:

```
VITE_GOOGLE_BOOKS_API_KEY=여기에_발급받은_API_키_붙여넣기
```

예시:
```
VITE_GOOGLE_BOOKS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. 파일을 저장합니다.

#### 7단계: 개발 서버 재시작
1. 실행 중인 개발 서버를 중지합니다 (Ctrl+C).
2. 다시 시작합니다:

```bash
npm run dev
```

**참고 사항:**
- `.env` 파일은 Git에 커밋하지 마세요. `.gitignore`에 이미 포함되어 있습니다.
- API 키는 비밀로 유지하세요. 공개 저장소에 업로드하지 마세요.
- 무료 할당량: Google Books API는 일일 1,000회 요청까지 무료입니다.
- API 키가 작동하지 않으면 프로젝트가 선택되어 있는지, Books API가 활성화되어 있는지 확인하세요.

## 실행 방법

```bash
npm install
npm run dev
```

## 주요 기능

- 책 검색 및 관리
- 독서 진행 상황 추적
- 완독 책 포스팅
- 커뮤니티 피드
- 지도에서 책 재고 확인

## 배포 (Vercel)

### 1. Vercel에 프로젝트 연결

1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub/GitLab/Bitbucket에서 저장소 선택
4. 프로젝트 가져오기

### 2. 빌드 설정

Vercel이 자동으로 다음 설정을 감지합니다:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

1. 프로젝트 설정 → Environment Variables
2. 다음 변수 추가:
   - **Key**: `VITE_GOOGLE_BOOKS_API_KEY`
   - **Value**: Google Books API 키
   - **Environment**: Production, Preview, Development 모두 선택

### 4. 배포

1. 설정 완료 후 "Deploy" 클릭
2. 배포가 완료되면 자동으로 URL이 생성됩니다
3. 이후 Git에 push할 때마다 자동으로 재배포됩니다

### 5. 커스텀 도메인 (선택사항)

1. 프로젝트 설정 → Domains
2. 원하는 도메인 추가
3. DNS 설정 안내에 따라 도메인 설정

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```
