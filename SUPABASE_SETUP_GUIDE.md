# Supabase 연결 설정 가이드 (상세 버전)

이 가이드는 광동제약 방문예약 시스템을 Supabase와 연결하는 방법을 단계별로 상세하게 설명합니다.

## 목차

1. [Supabase 프로젝트 설정](#1-supabase-프로젝트-설정)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [데이터베이스 스키마 생성](#3-데이터베이스-스키마-생성)
4. [데이터베이스 구조 이해](#4-데이터베이스-구조-이해)
5. [인증 설정](#5-인증-설정)
6. [RLS 정책 이해](#6-rls-정책-이해)
7. [프로젝트 실행](#7-프로젝트-실행)
8. [연결 테스트](#8-연결-테스트)
9. [관리자 계정 생성](#9-관리자-계정-생성)
10. [문제 해결](#10-문제-해결)

---

## 1. Supabase 프로젝트 설정

### 1.1 Supabase 대시보드 접속

1. 웹 브라우저에서 [Supabase 대시보드](https://supabase.com/dashboard)를 엽니다.
2. Supabase 계정으로 로그인합니다 (계정이 없다면 회원가입 필요).
3. 프로젝트 목록에서 프로젝트 ID `esrvexhyrpwwyjpjeuqi`를 찾아 클릭합니다.
   - 또는 URL로 직접 접속: `https://supabase.com/dashboard/project/esrvexhyrpwwyjpjeuqi`

### 1.2 API 키 확인 (단계별)

**중요**: API 키는 프로젝트의 보안과 직접 관련이 있으므로 안전하게 관리하세요.

#### 단계 1: Settings 메뉴 찾기
- 왼쪽 사이드바에서 **Settings** (톱니바퀴 아이콘)를 클릭합니다.

#### 단계 2: API 섹션으로 이동
- Settings 메뉴에서 **API**를 클릭합니다.

#### 단계 3: 필요한 정보 확인
다음 정보를 확인하고 복사합니다:

1. **Project URL**
   - 위치: "Project URL" 섹션
   - 값: `https://esrvexhyrpwwyjpjeuqi.supabase.co`
   - 용도: Supabase 클라이언트 초기화에 사용

2. **anon public key** (가장 중요!)
   - 위치: "Project API keys" 섹션의 "anon" 또는 "public" 키
   - 형식: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (긴 문자열)
   - 용도: 프론트엔드에서 Supabase에 접근할 때 사용
   - **주의**: 이 키는 공개되어도 괜찮지만, RLS 정책으로 보호됩니다.

3. **service_role key** (선택사항, 관리자용)
   - 위치: "Project API keys" 섹션의 "service_role" 키
   - **주의**: 이 키는 절대 프론트엔드에 노출하면 안 됩니다!
   - 용도: 서버 사이드에서만 사용 (관리 작업 등)

#### 단계 4: 키 복사
- 각 키 옆의 **복사 버튼**을 클릭하여 클립보드에 복사합니다.
- 안전한 곳에 임시로 저장해두세요 (다음 단계에서 사용).

---

## 2. 환경 변수 설정

### 2.1 .env 파일이란?

`.env` 파일은 프로젝트의 환경 변수를 저장하는 파일입니다. 민감한 정보(API 키 등)를 코드에 직접 작성하지 않고 이 파일에 저장합니다.

**중요**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. 이는 보안상 중요합니다.

### 2.2 .env 파일 생성 (Windows)

#### 방법 1: 파일 탐색기 사용
1. 프로젝트 루트 디렉토리(`kwangdong-site`)로 이동합니다.
2. `.env.example` 파일을 찾습니다.
3. `.env.example` 파일을 복사합니다.
4. 복사한 파일의 이름을 `.env`로 변경합니다.

#### 방법 2: 명령 프롬프트 사용
```bash
# 프로젝트 디렉토리로 이동
cd kwangdong-site

# .env.example을 .env로 복사
copy .env.example .env
```

#### 방법 3: PowerShell 사용
```powershell
# 프로젝트 디렉토리로 이동
cd kwangdong-site

# .env.example을 .env로 복사
Copy-Item .env.example .env
```

### 2.3 .env 파일 편집

1. 텍스트 에디터(메모장, VS Code 등)로 `.env` 파일을 엽니다.

2. 다음 내용을 확인하고 수정합니다:

```env
# Supabase 프로젝트 ID
VITE_SUPABASE_PROJECT_ID="esrvexhyrpwwyjpjeuqi"

# Supabase Public/Anon Key (Supabase 대시보드 > Settings > API에서 확인)
# ⚠️ 여기에 실제 anon public key를 입력하세요!
VITE_SUPABASE_PUBLISHABLE_KEY="여기에_anon_public_key_입력"

# Supabase URL
VITE_SUPABASE_URL="https://esrvexhyrpwwyjpjeuqi.supabase.co"
```

3. `VITE_SUPABASE_PUBLISHABLE_KEY`의 값을 1.2 단계에서 복사한 **anon public key**로 교체합니다.

   예시:
   ```env
   VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcnZleGh5cnB3d3lqcGpldXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NzAzOTcsImV4cCI6MjA3OTU0NjM5N30.실제키값..."
   ```

4. 파일을 저장합니다.

### 2.4 환경 변수 확인

환경 변수가 제대로 로드되는지 확인하려면:

```bash
# 개발 서버를 시작하면 환경 변수가 자동으로 로드됩니다
npm run dev
```

**주의사항**:
- 환경 변수 이름은 반드시 `VITE_`로 시작해야 합니다 (Vite 프로젝트이기 때문).
- `.env` 파일을 수정한 후에는 개발 서버를 재시작해야 합니다.
- 따옴표(`"`)는 선택사항이지만, 값에 공백이 있으면 필요합니다.

---

## 3. 데이터베이스 스키마 생성

### 3.1 데이터베이스 스키마란?

데이터베이스 스키마는 데이터베이스의 구조를 정의합니다. 테이블, 컬럼, 관계, 제약 조건 등을 포함합니다.

이 프로젝트는 다음 두 개의 SQL 파일로 스키마를 생성합니다:
- `000_initial_schema.sql`: 기본 테이블 및 구조
- `001_add_notices_and_faq.sql`: 공지사항 및 FAQ 테이블 추가

### 3.2 SQL Editor 접속

1. Supabase 대시보드에서 왼쪽 사이드바의 **SQL Editor**를 클릭합니다.
2. "New query" 버튼을 클릭하여 새 쿼리 창을 엽니다.

### 3.3 첫 번째 스키마 실행 (000_initial_schema.sql)

#### 단계 1: SQL 파일 열기
1. 프로젝트 폴더에서 `supabase/migrations/000_initial_schema.sql` 파일을 엽니다.
2. 파일의 모든 내용을 선택하고 복사합니다 (Ctrl+A, Ctrl+C).

#### 단계 2: SQL Editor에 붙여넣기
1. Supabase SQL Editor의 쿼리 창에 붙여넣습니다 (Ctrl+V).
2. 쿼리가 제대로 붙여넣어졌는지 확인합니다.

#### 단계 3: 쿼리 실행
1. 쿼리 창 하단의 **Run** 버튼을 클릭합니다.
   - 또는 `Ctrl+Enter` 단축키를 사용할 수 있습니다.
2. 실행 결과를 확인합니다.

#### 예상 결과
- 성공 시: "Success. No rows returned" 또는 "Success" 메시지가 표시됩니다.
- 오류 시: 빨간색 오류 메시지가 표시됩니다. 오류 내용을 확인하고 수정합니다.

**주요 생성 항목**:
- 8개의 테이블 (profiles, user_roles, visit_requests, visitor_info, checklists, notices, faqs, sms_notifications)
- 2개의 Enum 타입 (app_role, visit_status)
- 여러 인덱스
- RLS 정책
- 트리거 함수

### 3.4 두 번째 스키마 실행 (001_add_notices_and_faq.sql)

1. SQL Editor에서 "New query"를 다시 클릭합니다.
2. `supabase/migrations/001_add_notices_and_faq.sql` 파일의 내용을 복사하여 붙여넣습니다.
3. "Run" 버튼을 클릭하여 실행합니다.

**참고**: 이 파일은 이미 `000_initial_schema.sql`에 포함된 내용을 확인하고 추가하는 역할을 합니다. 안전하게 여러 번 실행할 수 있습니다.

### 3.5 테이블 생성 확인

스키마가 제대로 생성되었는지 확인하려면:

1. Supabase 대시보드에서 **Table Editor**를 클릭합니다.
2. 왼쪽 사이드바에 다음 테이블들이 표시되어야 합니다:
   - `profiles`
   - `user_roles`
   - `visit_requests`
   - `visitor_info`
   - `checklists`
   - `notices`
   - `faqs`
   - `sms_notifications`

---

## 4. 데이터베이스 구조 이해

### 4.1 테이블 관계도

```
auth.users (Supabase 기본 테이블)
    │
    ├── profiles (사용자 프로필)
    │
    ├── user_roles (사용자 역할)
    │
    └── visit_requests (방문 요청)
            │
            ├── visitor_info (방문자 정보) - 1:N 관계
            │
            ├── checklists (체크리스트) - 1:1 관계
            │
            └── sms_notifications (SMS 알림) - 1:N 관계

notices (공지사항) - 독립 테이블
faqs (FAQ) - 독립 테이블
```

### 4.2 주요 테이블 설명

#### visit_requests (방문 요청)
- **역할**: 방문 예약의 핵심 정보를 저장
- **주요 필드**:
  - `reservation_number`: 예약번호 (고유값)
  - `status`: 예약 상태 (REQUESTED, APPROVED, REJECTED 등)
  - `visit_date`: 방문 날짜
  - `purpose`: 방문 목적
- **관계**: visitor_info, checklists와 연결

#### visitor_info (방문자 정보)
- **역할**: 실제 방문하는 사람들의 정보 저장
- **주요 필드**:
  - `visitor_name`: 방문자 이름
  - `visitor_phone`: 방문자 전화번호
  - `car_number`: 차량 번호 (선택)
- **관계**: visit_requests와 다대일 관계 (한 예약에 여러 방문자 가능)

#### checklists (체크리스트)
- **역할**: 방문 전 필수 체크리스트 항목 관리
- **주요 필드**:
  - `security_agreement`: 보안 동의
  - `safety_education`: 안전 교육
  - `privacy_consent`: 개인정보 동의
  - `document_upload`: 문서 업로드
- **관계**: visit_requests와 일대일 관계

#### profiles (사용자 프로필)
- **역할**: Supabase 인증 사용자의 추가 정보 저장
- **주요 필드**:
  - `full_name`: 전체 이름
  - `company`: 회사명
  - `department`: 부서
- **관계**: auth.users와 일대일 관계

#### user_roles (사용자 역할)
- **역할**: 사용자의 권한 관리 (admin, user, visitor)
- **주요 필드**:
  - `role`: 역할 (admin, user, visitor)
- **용도**: RLS 정책에서 권한 확인에 사용

#### notices (공지사항)
- **역할**: 공지사항 관리
- **주요 필드**:
  - `title`: 제목
  - `content`: 내용
  - `is_pinned`: 고정 여부
- **특징**: 모든 사용자가 읽을 수 있음 (공개)

#### faqs (FAQ)
- **역할**: 자주 묻는 질문 관리
- **주요 필드**:
  - `category`: 카테고리
  - `question`: 질문
  - `answer`: 답변
  - `order_index`: 정렬 순서
- **특징**: 모든 사용자가 읽을 수 있음 (공개)

#### sms_notifications (SMS 알림)
- **역할**: SMS 전송 로그 저장
- **주요 필드**:
  - `status`: 전송 상태 (PENDING, SENT, FAILED)
  - `message`: 전송 메시지
- **특징**: 관리자만 접근 가능

### 4.3 Enum 타입

#### app_role
사용자 역할을 정의합니다:
- `admin`: 관리자 (모든 권한)
- `user`: 일반 사용자
- `visitor`: 방문자

#### visit_status
방문 요청 상태를 정의합니다:
- `REQUESTED`: 요청됨 (기본값)
- `APPROVED`: 승인됨
- `REJECTED`: 반려됨
- `IN_PROGRESS`: 진행 중
- `COMPLETED`: 완료됨
- `CANCELLED`: 취소됨

---

## 5. 인증 설정

### 5.1 이메일 인증 활성화

방문 예약 시스템에서 사용자 인증이 필요한 경우:

1. Supabase 대시보드에서 **Authentication** > **Providers**로 이동합니다.
2. **Email** provider를 찾습니다.
3. **Enable Email provider** 토글을 켭니다.
4. 필요에 따라 다음 설정을 조정합니다:
   - **Confirm email**: 이메일 확인 필요 여부
   - **Secure email change**: 이메일 변경 시 보안 확인

### 5.2 이메일 템플릿 커스터마이징

1. **Authentication** > **Email Templates**로 이동합니다.
2. 다음 템플릿을 커스터마이징할 수 있습니다:
   - **Confirm signup**: 회원가입 확인 이메일
   - **Magic Link**: 매직 링크 이메일
   - **Change Email Address**: 이메일 변경 확인
   - **Reset Password**: 비밀번호 재설정

### 5.3 소셜 로그인 설정 (선택사항)

Google, GitHub 등의 소셜 로그인을 추가하려면:

1. **Authentication** > **Providers**에서 원하는 provider를 선택합니다.
2. 각 provider의 설정 가이드를 따라 클라이언트 ID와 Secret을 입력합니다.

---

## 6. RLS 정책 이해

### 6.1 RLS (Row Level Security)란?

RLS는 데이터베이스 레벨에서 행(레코드) 단위로 접근을 제어하는 보안 기능입니다. 각 사용자가 자신의 데이터만 접근할 수 있도록 보장합니다.

### 6.2 현재 RLS 정책 요약

#### 공개 읽기 (모든 사용자)
- `notices`: 모든 사용자가 공지사항을 읽을 수 있음
- `faqs`: 모든 사용자가 FAQ를 읽을 수 있음

#### 사용자 자신의 데이터만 접근
- `visit_requests`: 자신이 생성한 방문 요청만 읽기/쓰기 가능
- `visitor_info`: 자신의 방문 요청에 연결된 방문자 정보만 접근 가능
- `checklists`: 자신의 방문 요청에 연결된 체크리스트만 접근 가능
- `profiles`: 자신의 프로필만 읽기/쓰기 가능

#### 관리자만 접근
- `user_roles`: 관리자만 읽기/쓰기 가능
- `sms_notifications`: 관리자만 읽기/쓰기 가능

### 6.3 RLS 정책 확인 방법

1. Supabase 대시보드에서 **Authentication** > **Policies**로 이동합니다.
2. 각 테이블별로 정책이 표시됩니다.
3. 정책을 클릭하여 상세 내용을 확인할 수 있습니다.

### 6.4 RLS 정책 테스트

RLS가 제대로 작동하는지 테스트하려면:

1. **Table Editor**에서 테이블을 열어봅니다.
2. 데이터가 보이지 않거나 제한적으로 보이는지 확인합니다.
3. SQL Editor에서 다음 쿼리로 테스트할 수 있습니다:

```sql
-- 현재 사용자 확인
SELECT auth.uid();

-- 자신의 방문 요청만 조회되는지 확인
SELECT * FROM visit_requests;
```

---

## 7. 프로젝트 실행

### 7.1 의존성 설치

프로젝트를 처음 실행하기 전에 필요한 패키지를 설치해야 합니다:

```bash
# 프로젝트 디렉토리로 이동
cd kwangdong-site

# 의존성 설치 (처음 한 번만)
npm install
```

**설치 시간**: 인터넷 속도에 따라 1-5분 정도 소요됩니다.

**설치되는 주요 패키지**:
- React 및 관련 라이브러리
- Supabase 클라이언트
- UI 컴포넌트 (shadcn-ui)
- 기타 유틸리티

### 7.2 개발 서버 실행

```bash
npm run dev
```

**예상 출력**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**접속 방법**:
1. 웹 브라우저를 엽니다.
2. 주소창에 `http://localhost:5173`을 입력합니다.
3. Enter 키를 누릅니다.

**개발 서버 특징**:
- 코드를 수정하면 자동으로 페이지가 새로고침됩니다 (Hot Module Replacement).
- 콘솔에 오류가 표시됩니다.
- 개발 도구를 사용할 수 있습니다.

### 7.3 프로덕션 빌드

실제 서비스에 배포하기 전에 빌드합니다:

```bash
npm run build
```

**빌드 결과**:
- `dist/` 폴더에 최적화된 파일들이 생성됩니다.
- 이 파일들을 웹 서버에 업로드하면 됩니다.

**빌드 파일 확인**:
```bash
npm run preview
```

이 명령어는 빌드된 파일을 로컬에서 미리 볼 수 있게 해줍니다.

---

## 8. 연결 테스트

### 8.1 테스트 스크립트 실행

Supabase 연결이 제대로 되었는지 확인합니다:

```bash
npm run test:supabase
```

또는:

```bash
node test-supabase-connection.js
```

### 8.2 테스트 결과 해석

#### 성공적인 출력 예시:
```
============================================================
Supabase 연결 테스트 시작
============================================================

1. 환경 변수 확인
------------------------------------------------------------
✅ SUPABASE_URL: https://esrvexhyrpwwyjpjeuqi.supabase.co
✅ SUPABASE_KEY: eyJhbGciOiJIUzI1NiIs...

2. Supabase 클라이언트 초기화
------------------------------------------------------------
✅ Supabase 클라이언트가 성공적으로 생성되었습니다.

3. 데이터베이스 연결 테스트
------------------------------------------------------------
✅ 데이터베이스 연결 성공

4. 주요 테이블 존재 여부 확인
------------------------------------------------------------
✅ visit_requests: 테이블이 존재합니다.
✅ visitor_info: 테이블이 존재합니다.
✅ checklists: 테이블이 존재합니다.
...
```

#### 오류가 있는 경우:

**환경 변수 오류**:
```
❌ VITE_SUPABASE_URL이 설정되지 않았습니다.
```
→ `.env` 파일을 확인하고 환경 변수를 설정하세요.

**연결 오류**:
```
❌ 데이터베이스 연결 실패: Invalid API key
```
→ API 키가 올바른지 확인하세요.

**테이블 없음**:
```
⚠️  visit_requests: 테이블이 존재하지 않습니다.
```
→ SQL Editor에서 스키마를 실행하세요.

### 8.3 수동 테스트

브라우저 개발자 도구에서도 테스트할 수 있습니다:

1. 개발 서버를 실행합니다 (`npm run dev`).
2. 브라우저에서 `http://localhost:5173`을 엽니다.
3. F12를 눌러 개발자 도구를 엽니다.
4. Console 탭에서 다음을 입력합니다:

```javascript
// Supabase 클라이언트가 제대로 로드되었는지 확인
console.log(window.supabase);
```

---

## 9. 관리자 계정 생성

### 9.1 관리자 계정이 필요한 이유

관리자 계정은 다음 기능을 사용할 수 있습니다:
- 방문 요청 승인/반려
- 공지사항 작성/수정/삭제
- FAQ 작성/수정/삭제
- 모든 방문 요청 조회
- SMS 알림 로그 확인

### 9.2 관리자 계정 생성 단계

#### 단계 1: 사용자 생성 (Supabase 인증)

**방법 A: Supabase 대시보드에서 생성**
1. Supabase 대시보드에서 **Authentication** > **Users**로 이동합니다.
2. **Add user** 버튼을 클릭합니다.
3. 이메일과 비밀번호를 입력합니다.
4. **Create user**를 클릭합니다.
5. 생성된 사용자의 **UUID**를 복사합니다 (나중에 필요).

**방법 B: 앱에서 회원가입**
1. 앱에서 회원가입을 진행합니다.
2. Supabase 대시보드 > **Authentication** > **Users**에서 새로 생성된 사용자를 찾습니다.
3. 사용자의 **UUID**를 복사합니다.

#### 단계 2: 관리자 역할 부여

1. Supabase 대시보드에서 **SQL Editor**로 이동합니다.
2. 다음 SQL 쿼리를 실행합니다:

```sql
-- 사용자 UUID를 실제 UUID로 변경하세요
-- 예시: '123e4567-e89b-12d3-a456-426614174000'
INSERT INTO user_roles (user_id, role)
VALUES ('여기에_사용자_UUID_입력', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

3. **Run** 버튼을 클릭하여 실행합니다.

#### 단계 3: 확인

관리자 역할이 제대로 부여되었는지 확인합니다:

```sql
-- 관리자 목록 확인
SELECT 
  ur.user_id,
  ur.role,
  p.full_name,
  p.email
FROM user_roles ur
LEFT JOIN profiles p ON p.user_id = ur.user_id
WHERE ur.role = 'admin';
```

### 9.3 여러 관리자 추가

여러 관리자를 추가하려면:

```sql
-- 여러 관리자 한 번에 추가
INSERT INTO user_roles (user_id, role)
VALUES 
  ('사용자1_UUID', 'admin'),
  ('사용자2_UUID', 'admin'),
  ('사용자3_UUID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 9.4 관리자 권한 제거

관리자 권한을 제거하려면:

```sql
-- 특정 사용자의 관리자 권한 제거
DELETE FROM user_roles
WHERE user_id = '사용자_UUID' AND role = 'admin';
```

---

## 10. 문제 해결

### 10.1 환경 변수 관련 문제

#### 문제: "VITE_SUPABASE_URL is not defined"

**원인**: 환경 변수가 로드되지 않았습니다.

**해결 방법**:
1. `.env` 파일이 프로젝트 루트에 있는지 확인합니다.
2. 환경 변수 이름이 정확한지 확인합니다 (`VITE_` 접두사 필수).
3. 개발 서버를 재시작합니다:
   ```bash
   # 서버 중지 (Ctrl+C)
   # 서버 재시작
   npm run dev
   ```
4. `.env` 파일에 따옴표가 올바르게 사용되었는지 확인합니다.

#### 문제: 환경 변수가 변경되지 않음

**해결 방법**:
- Vite는 시작 시 환경 변수를 로드하므로, `.env` 파일을 수정한 후에는 반드시 서버를 재시작해야 합니다.

### 10.2 데이터베이스 연결 문제

#### 문제: "Invalid API key" 오류

**원인**: API 키가 잘못되었거나 만료되었습니다.

**해결 방법**:
1. Supabase 대시보드에서 API 키를 다시 확인합니다.
2. `.env` 파일의 키가 정확히 복사되었는지 확인합니다 (앞뒤 공백 없음).
3. **anon/public key**를 사용하는지 확인합니다 (service_role key가 아님).

#### 문제: "Failed to fetch" 오류

**원인**: 네트워크 문제이거나 Supabase 프로젝트가 일시 중지되었을 수 있습니다.

**해결 방법**:
1. 인터넷 연결을 확인합니다.
2. Supabase 대시보드에서 프로젝트 상태를 확인합니다.
3. 브라우저 개발자 도구의 Network 탭에서 실제 오류를 확인합니다.

#### 문제: "relation does not exist" 오류

**원인**: 테이블이 아직 생성되지 않았습니다.

**해결 방법**:
1. SQL Editor에서 스키마를 실행했는지 확인합니다.
2. Table Editor에서 테이블이 존재하는지 확인합니다.
3. 스키마를 다시 실행합니다 (IF NOT EXISTS로 안전합니다).

### 10.3 RLS 정책 문제

#### 문제: 데이터를 읽을 수 없음

**원인**: RLS 정책이 데이터 접근을 차단하고 있습니다.

**해결 방법**:
1. 현재 로그인한 사용자 ID를 확인합니다:
   ```sql
   SELECT auth.uid();
   ```
2. RLS 정책을 확인합니다 (Authentication > Policies).
3. 필요하다면 임시로 RLS를 비활성화하여 테스트할 수 있습니다 (프로덕션에서는 권장하지 않음):
   ```sql
   ALTER TABLE 테이블명 DISABLE ROW LEVEL SECURITY;
   ```

#### 문제: 관리자 권한이 작동하지 않음

**원인**: user_roles 테이블에 관리자 역할이 없습니다.

**해결 방법**:
1. 관리자 계정 생성 섹션을 참조하여 관리자 역할을 추가합니다.
2. 사용자 ID가 정확한지 확인합니다.

### 10.4 빌드 문제

#### 문제: "Cannot find module" 오류

**원인**: 의존성이 설치되지 않았습니다.

**해결 방법**:
```bash
# node_modules 삭제
rm -rf node_modules

# package-lock.json 삭제 (선택사항)
rm package-lock.json

# 의존성 재설치
npm install
```

#### 문제: 빌드 시 환경 변수 오류

**해결 방법**:
- 빌드 시에도 `.env` 파일이 필요합니다.
- 배포 플랫폼(Vercel, Netlify 등)에 환경 변수를 설정해야 합니다.

### 10.5 일반적인 디버깅 방법

#### 1. 브라우저 개발자 도구 사용
- F12를 눌러 개발자 도구를 엽니다.
- Console 탭에서 오류 메시지를 확인합니다.
- Network 탭에서 API 요청 상태를 확인합니다.

#### 2. Supabase 로그 확인
- Supabase 대시보드 > **Logs**에서 API 요청 로그를 확인할 수 있습니다.

#### 3. SQL Editor에서 직접 테스트
```sql
-- 테이블 존재 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 데이터 확인
SELECT * FROM visit_requests LIMIT 5;
```

### 10.6 자주 묻는 질문 (FAQ)

**Q: .env 파일이 Git에 커밋되나요?**
A: 아니요. `.gitignore`에 포함되어 있어 커밋되지 않습니다. 하지만 `.env.example`은 커밋됩니다.

**Q: 여러 환경(개발/프로덕션)에서 다른 설정을 사용하려면?**
A: `.env.development`, `.env.production` 파일을 사용할 수 있습니다.

**Q: Supabase 무료 플랜의 제한은?**
A: 무료 플랜에는 데이터베이스 크기, API 요청 수 등의 제한이 있습니다. 자세한 내용은 Supabase 문서를 참조하세요.

**Q: 로컬에서 Supabase를 사용할 수 있나요?**
A: 네, Supabase CLI를 사용하여 로컬에서 실행할 수 있습니다. 하지만 이 가이드에서는 클라우드 버전을 사용합니다.

---

## 추가 리소스

### 공식 문서
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Vite 환경 변수](https://vitejs.dev/guide/env-and-mode.html)

### 유용한 링크
- [Supabase 대시보드](https://supabase.com/dashboard)
- [Supabase 커뮤니티](https://github.com/supabase/supabase/discussions)

### 도움이 필요하신가요?
문제가 해결되지 않으면:
1. 이 가이드의 문제 해결 섹션을 다시 확인하세요.
2. Supabase 공식 문서를 참조하세요.
3. Supabase 커뮤니티 포럼에서 도움을 요청하세요.

---

**마지막 업데이트**: 2025년 1월
