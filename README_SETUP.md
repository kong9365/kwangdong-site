# 광동제약 방문예약 시스템 설정 가이드

## 데이터베이스 설정

### 1. Supabase 마이그레이션 실행

프로젝트 루트의 `supabase/migrations/001_add_notices_and_faq.sql` 파일을 Supabase 대시보드에서 실행하거나, Supabase CLI를 사용하여 마이그레이션을 적용하세요.

```bash
# Supabase CLI 사용 시
supabase db push
```

### 2. 환경 변수 설정

`.env` 파일에 다음 환경 변수를 설정하세요:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3. 데이터베이스 테이블 확인

다음 테이블들이 생성되어야 합니다:
- `notices` - 공지사항
- `faqs` - FAQ
- `sms_notifications` - 문자 알림 로그
- `visit_requests` - 방문 요청 (기존 테이블에 필드 추가)

## 주요 기능

### 1. 예약현황 검색
- 예약번호 또는 연락처로 방문 예약 조회
- `/progress` 페이지에서 검색 가능

### 2. 공지사항
- 공지사항 목록 및 상세 보기
- 관리자는 공지사항 작성/수정/삭제 가능
- `/notice` 페이지

### 3. FAQ
- 카테고리별 FAQ 조회
- 검색 기능 제공
- `/faq` 페이지

### 4. 예약 취소/수정
- 예약현황 페이지에서 예약 취소 가능
- 취소 사유 입력 필수

### 5. 관리자 승인 워크플로우
- `/admin/approval` 페이지에서 방문 요청 승인/반려
- 승인/반려 시 자동으로 문자 알림 전송

### 6. 문자 알림
- 방문 요청 승인/반려 시 자동 문자 전송
- Supabase Edge Function `send-sms` 구현 필요
- 또는 외부 SMS API 연동 필요

## 문자 알림 설정

### Supabase Edge Function 사용 (권장)

1. Supabase 대시보드에서 Edge Function 생성
2. `send-sms` 함수 생성
3. SMS API 키 설정 (환경 변수)

### 외부 SMS API 연동

`src/lib/api.ts`의 `sendSMSNotification` 함수를 수정하여 실제 SMS API를 호출하도록 구현하세요.

예시:
- 알리고 API
- 카카오톡 비즈니스 메시지
- 네이버 클라우드 플랫폼 SMS

## 관리자 권한 설정

관리자 기능을 사용하려면 `user_roles` 테이블에 관리자 권한을 부여해야 합니다:

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('user_id_here', 'admin');
```

## 배포

### 빌드

```bash
npm run build
```

### 배포 플랫폼

- Vercel
- Netlify
- Supabase Hosting

환경 변수를 배포 플랫폼에 설정하는 것을 잊지 마세요.

## 문제 해결

### 타입 오류
Supabase 타입이 자동 생성되지 않은 경우, `supabase/migrations`를 실행한 후 타입을 다시 생성하세요:

```bash
npx supabase gen types typescript --project-id your_project_id > src/integrations/supabase/types.ts
```

### 문자 알림이 작동하지 않는 경우
- Supabase Edge Function이 배포되었는지 확인
- SMS API 키가 올바르게 설정되었는지 확인
- `sms_notifications` 테이블의 로그 확인

