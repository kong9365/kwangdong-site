# 문자 발송 (SOLAPI) 설정 가이드

## 1. SOLAPI 발신번호 등록

1. [솔라피 콘솔](https://console.solapi.com/senderids) 접속
2. **발신번호 등록** 완료 (미등록 시 문자 발송 불가)
3. 등록된 발신번호 확인 (예: 01012345678)

## 2. 환경 변수 설정

### 로컬 개발 (.env)

`.env` 파일에 다음 변수가 설정되어 있는지 확인하세요:

```
SOLAPI_API_KEY="발급받은_API_KEY"
SOLAPI_API_SECRET="발급받은_API_SECRET"
SOLAPI_SENDER="등록한_발신번호"   # 예: 01012345678
```

**중요**: `SOLAPI_SENDER`를 솔라피 콘솔에 등록한 실제 발신번호로 변경해야 합니다.

### Vercel 배포

1. Vercel 프로젝트 > **Settings** > **Environment Variables**
2. 아래 변수 추가:
   - `SOLAPI_API_KEY`
   - `SOLAPI_API_SECRET`
   - `SOLAPI_SENDER` (발신번호)

## 3. 로컬 테스트

로컬에서 문자 발송을 테스트하려면:

```bash
npx vercel dev
```

일반 `npm run dev`(Vite)로 실행 시 `/api` 경로가 없어 문자 발송이 동작하지 않습니다.

## 4. 발송 시점

- **승인 완료 시**: 방문예약 승인 시 첫 번째 방문자 전화번호로 문자 발송
- **반려 완료 시**: 방문예약 반려 시 사유와 함께 문자 발송

## 5. 발송 로그

Supabase `sms_notifications` 테이블에서 발송 내역을 확인할 수 있습니다.

## 6. 문자 미발송 시 점검

### 6-1. 브라우저 개발자 도구 (F12) → Network 탭

1. 예약 완료 또는 승인 시 `send-sms` 요청 확인
2. 요청이 **404** → Vercel 배포/rewrite 설정 확인
3. 요청이 **500** → Response 탭에서 `error` 메시지 확인

### 6-2. Supabase `sms_notifications` 테이블

| status | 의미 |
|--------|------|
| PENDING | API 호출 전 또는 응답 대기 |
| SENT | 발송 성공 |
| FAILED | 발송 실패 (`error_message` 컬럼 확인) |

### 6-3. Vercel Functions 로그

Vercel 대시보드 → Logs → Request Path에 `send-sms` 필터 → 에러 메시지 확인

### 6-4. SOLAPI 점검

- **발신번호**: [솔라피 콘솔](https://console.solapi.com/senderids)에서 등록·승인 완료 여부 확인
- **API Key**: 콘솔에서 재발급 후 Vercel 환경 변수 업데이트 → **Redeploy** 필요
- **에러 코드**: `InvalidAPIKey`(403), `SignatureDoesNotMatch`(403), `RequestTimeTooSkewed`(403) 등
