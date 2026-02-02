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
