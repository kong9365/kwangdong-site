# 광동제약 방문예약 시스템

광동제약 방문예약 웹사이트입니다. Supabase를 백엔드로 사용하는 React + TypeScript 기반 애플리케이션입니다.

## 프로젝트 정보

**Supabase 프로젝트**: `esrvexhyrpwwyjpjeuqi`  
**Supabase URL**: `https://esrvexhyrpwwyjpjeuqi.supabase.co`

## 빠른 시작

### 1. 프로젝트 클론 및 의존성 설치

```sh
# 저장소 클론
git clone https://github.com/kong9365/kwangdong-site.git

# 프로젝트 디렉토리로 이동
cd kwangdong-site

# 의존성 설치
npm install
```

### 2. Supabase 연결 설정

**중요**: Supabase 연결을 위해 환경 변수를 설정해야 합니다.

1. `.env.example` 파일을 `.env`로 복사합니다:
```sh
cp .env.example .env
```

2. `.env` 파일을 열고 Supabase API 키를 입력합니다:
   - Supabase 대시보드 > Settings > API로 이동
   - **anon/public key**를 복사하여 `.env` 파일의 `VITE_SUPABASE_PUBLISHABLE_KEY`에 입력

```env
VITE_SUPABASE_PROJECT_ID="esrvexhyrpwwyjpjeuqi"
VITE_SUPABASE_PUBLISHABLE_KEY="여기에_anon_public_key_입력"
VITE_SUPABASE_URL="https://esrvexhyrpwwyjpjeuqi.supabase.co"
```

3. 데이터베이스 스키마 생성:
   - Supabase 대시보드 > SQL Editor로 이동
   - `supabase/migrations/000_initial_schema.sql` 파일 내용을 실행
   - `supabase/migrations/001_add_notices_and_faq.sql` 파일 내용을 실행

자세한 설정 방법은 [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)를 참조하세요.

### 3. 개발 서버 실행

```sh
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### 4. Supabase 연결 테스트

```sh
npm run test:supabase
```

이 명령어는 Supabase 연결 상태와 데이터베이스 테이블 존재 여부를 확인합니다.

### 5. Playwright 테스트 실행

```sh
# 기본 테스트 실행
npm test

# UI 모드로 실행 (추천)
npm run test:ui

# 디버그 모드로 실행
npm run test:debug
```

Playwright Test Agents를 사용하여 AI 기반 테스트 자동화가 가능합니다. 자세한 내용은 [PLAYWRIGHT_AGENTS_GUIDE.md](./PLAYWRIGHT_AGENTS_GUIDE.md)를 참조하세요.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 기술 스택

- **프론트엔드**: React 18, TypeScript, Vite
- **UI 라이브러리**: shadcn-ui, Tailwind CSS
- **백엔드**: Supabase (PostgreSQL, Authentication, Storage)
- **라우팅**: React Router
- **상태 관리**: TanStack Query
- **폼 관리**: React Hook Form, Zod

## 주요 기능

- ✅ 방문 예약 신청 및 관리
- ✅ 방문자 정보 관리
- ✅ 예약 진행 상황 조회
- ✅ 공지사항 및 FAQ
- ✅ 관리자 승인/반려 기능
- ✅ 체크리스트 관리
- ✅ Playwright Test Agents (AI 기반 테스트 자동화)

## 프로젝트 구조

```
kwangdong-site/
├── src/
│   ├── components/      # React 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── integrations/   # Supabase 클라이언트
│   ├── lib/            # 유틸리티 및 API 함수
│   └── types/          # TypeScript 타입 정의
├── supabase/
│   └── migrations/     # 데이터베이스 마이그레이션 파일
└── public/             # 정적 파일
```

## 배포

### 빌드

```sh
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 배포 옵션

- **Vercel**: Vercel에 프로젝트를 연결하고 자동 배포
- **Netlify**: Netlify에 프로젝트를 연결하고 자동 배포
- **기타**: 정적 파일 호스팅 서비스 사용

배포 시 환경 변수(`VITE_SUPABASE_*`)를 배포 플랫폼에 설정해야 합니다.

## 문서

- [Supabase 설정 가이드](./SUPABASE_SETUP_GUIDE.md) - Supabase 연결 및 데이터베이스 설정 방법
- [Playwright Test Agents 가이드](./PLAYWRIGHT_AGENTS_GUIDE.md) - AI 기반 테스트 자동화 사용 방법

## 문제 해결

문제가 발생하면 [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)의 "문제 해결" 섹션을 참조하세요.

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.
