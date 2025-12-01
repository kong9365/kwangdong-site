# 광동제약 방문예약 시스템 배포 가이드

## 🌐 인터넷에서 접속하기

현재는 로컬 개발 서버(`localhost:8080`)만 실행 중이므로 인터넷에서 접속할 수 없습니다.

## 배포 옵션

### 1. Vercel 배포 (권장) ⭐

**장점:**
- 무료
- 자동 HTTPS
- GitHub 연동 시 자동 배포
- 빠른 CDN

**단계:**

1. **GitHub에 코드 푸시**
   ```bash
   git add .
   git commit -m "배포 준비"
   git push origin main
   ```

2. **Vercel 가입 및 배포**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인
   - "Add New Project" 클릭
   - `kwangdong-site` 저장소 선택
   - Root Directory: `kwangdong-site` 선택
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables 추가:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - "Deploy" 클릭

3. **배포 완료**
   - Vercel이 자동으로 URL 제공 (예: `https://kwangdong-site.vercel.app`)
   - 이후 GitHub에 푸시할 때마다 자동 재배포

---

### 2. Netlify 배포

**장점:**
- 무료
- 드래그 앤 드롭 배포 가능
- 간단한 설정

**단계:**

1. **프로젝트 빌드**
   ```bash
   npm run build
   ```

2. **Netlify 배포**
   - https://app.netlify.com 접속
   - "Add new site" > "Deploy manually" 선택
   - `dist` 폴더를 드래그 앤 드롭
   - Site settings > Environment variables에서 환경 변수 추가:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`

3. **배포 완료**
   - Netlify가 자동으로 URL 제공 (예: `https://random-name.netlify.app`)

---

### 3. ngrok (임시 테스트용)

**장점:**
- 빠른 테스트
- 로컬 서버를 즉시 외부에 노출

**단계:**

1. **ngrok 설치**
   - https://ngrok.com 접속하여 가입
   - Windows: https://ngrok.com/download 다운로드
   - 또는 `choco install ngrok` (Chocolatey 사용 시)

2. **ngrok 실행**
   ```bash
   # 개발 서버가 8080 포트에서 실행 중일 때
   ngrok http 8080
   ```

3. **접속**
   - ngrok이 제공하는 URL 사용 (예: `https://abc123.ngrok.io`)
   - 이 URL을 다른 사람에게 공유하여 접속 가능

**주의:** ngrok 무료 버전은 세션이 종료되면 URL이 변경됩니다.

---

## 환경 변수 설정

배포 시 다음 환경 변수를 설정해야 합니다:

- `VITE_SUPABASE_URL`: `https://esrvexhyrpwwyjpjeuqi.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anon key

---

## 배포 후 확인 사항

1. ✅ 웹사이트가 정상적으로 로드되는지
2. ✅ Supabase 연결이 작동하는지
3. ✅ 방문 예약 폼이 정상 작동하는지
4. ✅ HTTPS가 적용되었는지

---

## 추천

- **프로덕션 배포**: Vercel (가장 간단하고 안정적)
- **빠른 테스트**: ngrok (임시로 외부 접속 테스트)

