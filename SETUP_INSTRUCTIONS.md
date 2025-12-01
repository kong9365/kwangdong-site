# Supabase 설정 완료 가이드

## ✅ 완료된 작업

1. ✅ API 키 확인 완료
   - **Project URL**: `https://esrvexhyrpwwyjpjeuqi.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcnZleGh5cnB3d3lqcGpldXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzU4MjUsImV4cCI6MjA3OTI1MTgyNX0.oy240kIq1c7jA1HbtI63uUTSPxR9tGwKDLbrfPP54kM`

2. ✅ 환경 변수 파일 준비 완료
   - `.env.example` 파일 생성됨

## 📋 남은 작업

### 1. .env 파일 생성

프로젝트 루트 디렉토리(`kwangdong-site`)에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
VITE_SUPABASE_PROJECT_ID="esrvexhyrpwwyjpjeuqi"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcnZleGh5cnB3d3lqcGpldXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzU4MjUsImV4cCI6MjA3OTI1MTgyNX0.oy240kIq1c7jA1HbtI63uUTSPxR9tGwKDLbrfPP54kM"
VITE_SUPABASE_URL="https://esrvexhyrpwwyjpjeuqi.supabase.co"
```

**Windows에서 .env 파일 생성 방법:**
1. 메모장을 엽니다
2. 위 내용을 복사해서 붙여넣습니다
3. "다른 이름으로 저장"을 선택합니다
4. 파일 이름을 `.env`로 입력합니다 (확장자 없음)
5. 파일 형식을 "모든 파일"로 선택합니다
6. 저장 위치를 `kwangdong-site` 폴더로 지정합니다

### 2. 데이터베이스 스키마 실행

Supabase SQL Editor에서 다음 파일들을 순서대로 실행하세요:

#### 2-1. Enum 타입 생성

SQL Editor에서 "New query"를 클릭하고 다음 SQL을 실행하세요:

```sql
-- Enum 타입 생성 (이미 있으면 오류 무시)
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'user', 'visitor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE visit_status AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
```

#### 2-2. 전체 스키마 실행

`supabase/migrations/000_initial_schema.sql` 파일의 전체 내용을 복사하여 SQL Editor에 붙여넣고 실행하세요.

**중요**: 파일을 열어서 전체 내용을 복사(Ctrl+A, Ctrl+C)한 후 SQL Editor에 붙여넣으세요.

#### 2-3. 추가 스키마 실행

`supabase/migrations/001_add_notices_and_faq.sql` 파일의 내용도 실행하세요.

### 3. 테이블 생성 확인

SQL Editor에서 다음 쿼리를 실행하여 테이블이 생성되었는지 확인하세요:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

다음 테이블들이 보여야 합니다:
- checklists
- faqs
- notices
- profiles
- sms_notifications
- user_roles
- visit_requests
- visitor_info

### 4. 프로젝트 실행

```bash
cd kwangdong-site
npm install
npm run dev
```

### 5. 연결 테스트

```bash
npm run test:supabase
```

## 🔗 유용한 링크

- Supabase 프로젝트: https://supabase.com/dashboard/project/esrvexhyrpwwyjpjeuqi
- SQL Editor: https://supabase.com/dashboard/project/esrvexhyrpwwyjpjeuqi/sql
- Table Editor: https://supabase.com/dashboard/project/esrvexhyrpwwyjpjeuqi/editor

## ⚠️ 문제 해결

### SQL 실행 오류가 발생하는 경우

1. **Enum 타입 오류**: 이미 생성된 Enum 타입이 있으면 오류가 발생할 수 있습니다. 위의 DO 블록을 사용하면 안전하게 처리됩니다.

2. **정책 생성 오류**: 정책이 이미 존재하면 오류가 발생할 수 있습니다. 다음 SQL로 기존 정책을 삭제한 후 다시 실행하세요:

```sql
-- 기존 정책 삭제 (필요시)
DROP POLICY IF EXISTS "사용자는 자신의 프로필 읽기" ON profiles;
DROP POLICY IF EXISTS "사용자는 자신의 프로필 쓰기" ON profiles;
-- ... (다른 정책들도 동일하게)
```

3. **함수 생성 오류**: 함수가 이미 존재하면 `CREATE OR REPLACE FUNCTION`을 사용하므로 문제없습니다.

## 📝 다음 단계

스키마 실행이 완료되면:
1. Table Editor에서 테이블 구조 확인
2. 테스트 데이터 입력 (선택사항)
3. 관리자 계정 생성 (필요시)
4. 웹사이트 테스트

