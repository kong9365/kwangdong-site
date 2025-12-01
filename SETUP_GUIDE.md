# 광동제약 방문예약 시스템 설정 가이드 (초보자용)

## 📋 준비물
- Supabase 계정 (이미 있으시죠!)
- 프로젝트: `esrvexhyrpwwyjpjeuqi`

## 🔑 1단계: Supabase API 키 확인하기

### 방법:
1. 브라우저에서 이 주소로 가세요: https://supabase.com/dashboard/project/esrvexhyrpwwyjpjeuqi
2. 왼쪽 메뉴에서 **"Settings"** (설정) 클릭
3. **"API"** 메뉴 클릭
4. 다음 두 가지를 찾아서 복사하세요:
   - **Project URL**: `https://esrvexhyrpwwyjpjeuqi.supabase.co` (이미 알려진 주소)
   - **anon public key**: `eyJ...`로 시작하는 긴 텍스트 (이게 중요해요!)

## 📝 2단계: .env 파일 수정하기

프로젝트 폴더에 있는 `.env` 파일을 열어서 아래처럼 수정하세요:

```env
VITE_SUPABASE_PROJECT_ID="esrvexhyrpwwyjpjeuqi"
VITE_SUPABASE_URL="https://esrvexhyrpwwyjpjeuqi.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="여기에_복사한_anon_public_키를_붙여넣기"
```

**주의**: `VITE_SUPABASE_PUBLISHABLE_KEY` 부분에 Supabase에서 복사한 키를 붙여넣으세요!

## 🗄️ 3단계: 데이터베이스 테이블 만들기

1. Supabase 대시보드에서 왼쪽 메뉴 **"SQL Editor"** 클릭
2. **"New query"** 버튼 클릭
3. 아래 파일을 열어서 내용을 모두 복사하세요:
   - 파일 위치: `supabase/migrations/001_add_notices_and_faq.sql`
4. 복사한 내용을 SQL Editor에 붙여넣기
5. 오른쪽 아래 **"Run"** 버튼 클릭
6. 성공 메시지가 나오면 완료!

## ✅ 4단계: 확인하기

1. 왼쪽 메뉴에서 **"Table Editor"** 클릭
2. 다음 테이블들이 보이면 성공!
   - `notices` (공지사항)
   - `faqs` (FAQ)
   - `sms_notifications` (문자 알림)
   - `visit_requests` (방문 요청)

## 🚀 5단계: 사이트 실행하기

터미널에서 다음 명령어를 실행하세요:

```bash
npm run dev
```

브라우저에서 `http://localhost:8080`으로 접속하면 사이트가 실행됩니다!

## ❓ 문제 해결

### "연결 오류"가 나오면?
- `.env` 파일의 키가 올바른지 확인하세요
- Supabase 대시보드에서 프로젝트가 활성화되어 있는지 확인하세요

### "테이블을 찾을 수 없습니다" 오류가 나오면?
- 3단계(데이터베이스 테이블 만들기)를 다시 실행하세요
- SQL Editor에서 오류 메시지를 확인하세요

## 📞 도움이 필요하시면
각 단계에서 막히는 부분을 알려주시면 더 자세히 안내해드리겠습니다!

