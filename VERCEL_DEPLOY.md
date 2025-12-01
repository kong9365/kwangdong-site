# Vercel 배포 가이드

## ✅ 준비 완료

다음 파일들이 GitHub에 푸시되었습니다:
- ✅ `vercel.json` - Vercel 배포 설정
- ✅ `package.json` - 업데이트된 스크립트

## 🚀 Vercel 배포 단계

### 1단계: Vercel 가입 및 로그인

1. https://vercel.com 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인 (권장)

### 2단계: 프로젝트 가져오기

1. Vercel 대시보드에서 "Add New Project" 클릭
2. GitHub 저장소 목록에서 `kong9365/kwangdong-site` 선택
3. "Import" 클릭

### 3단계: 프로젝트 설정

**자동 감지된 설정 (변경 불필요):**
- Framework Preset: Vite
- Root Directory: `./` (기본값)
- Build Command: `npm run build` (자동 감지)
- Output Directory: `dist` (자동 감지)
- Install Command: `npm install` (자동 감지)

### 4단계: 환경 변수 설정 ⚠️ 중요!

**Environment Variables** 섹션에서 다음 변수를 추가하세요:

1. **VITE_SUPABASE_URL**
   - Value: `https://esrvexhyrpwwyjpjeuqi.supabase.co`

2. **VITE_SUPABASE_PUBLISHABLE_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcnZleGh5cnB3d3lqcGpldXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzU4MjUsImV4cCI6MjA3OTI1MTgyNX0.oy240kIq1c7jA1HbtI63uUTSPxR9tGwKDLbrfPP54kM`

**각 변수 추가 방법:**
- "Add" 버튼 클릭
- Key 입력
- Value 입력
- "Save" 클릭

### 5단계: 배포 실행

1. "Deploy" 버튼 클릭
2. 배포 진행 상황 확인 (약 1-2분 소요)
3. 배포 완료 후 URL 확인

## 📋 배포 후 확인

배포가 완료되면:
- ✅ Vercel이 자동으로 URL 제공 (예: `https://kwangdong-site.vercel.app`)
- ✅ HTTPS 자동 적용
- ✅ 전 세계 CDN을 통한 빠른 접속

## 🔄 자동 배포

GitHub의 `main` 브랜치에 푸시할 때마다 Vercel이 자동으로 재배포합니다.

## 🛠️ 문제 해결

### 빌드 실패 시
- Vercel 대시보드의 "Deployments" 탭에서 로그 확인
- 환경 변수가 올바르게 설정되었는지 확인

### Supabase 연결 오류 시
- 환경 변수 값이 정확한지 확인
- Supabase 대시보드에서 API 키 확인

## 📞 도움말

- Vercel 문서: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord

