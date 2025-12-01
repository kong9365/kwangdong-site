# GitHub MCP 연결 가이드 (초보자용) 🐙

## 🤔 GitHub MCP가 뭔가요?

**GitHub MCP**는 Cursor에서 GitHub 저장소를 직접 관리할 수 있게 해주는 기능입니다.

### 장점:
- ✅ 코드를 GitHub에 바로 업로드
- ✅ 저장소 정보 확인
- ✅ 이슈, Pull Request 관리
- ✅ 파일 읽기/쓰기

## 📋 준비물

1. GitHub 계정 (이미 있으시죠!)
2. GitHub Personal Access Token (만들어야 함)

## 🔑 1단계: GitHub Personal Access Token 만들기

### 방법:

1. **GitHub 웹사이트 접속**
   - https://github.com 로그인

2. **Settings로 이동**
   - 오른쪽 위 프로필 사진 클릭
   - "Settings" 클릭

3. **Developer settings 찾기**
   - 왼쪽 메뉴 맨 아래 "Developer settings" 클릭
   - 또는 직접: https://github.com/settings/developers

4. **Personal access tokens 클릭**
   - "Personal access tokens" → "Tokens (classic)" 클릭
   - 또는 직접: https://github.com/settings/tokens

5. **새 토큰 생성**
   - "Generate new token" → "Generate new token (classic)" 클릭
   - GitHub 비밀번호 입력

6. **토큰 설정**
   - **Note**: "Cursor MCP" (이름 아무거나)
   - **Expiration**: 원하는 기간 선택 (90일, 1년 등)
   - **권한 선택 (Scopes)**:
     - ✅ `repo` (전체 체크) - 저장소 접근
     - ✅ `workflow` - GitHub Actions 사용 시
     - ✅ `read:org` - 조직 정보 읽기 (선택)
   
7. **토큰 생성**
   - 맨 아래 "Generate token" 클릭
   - ⚠️ **중요**: 토큰을 복사해두세요! (다시 볼 수 없습니다)

## ⚙️ 2단계: Cursor에 MCP 서버 추가하기

### 방법:

1. **Cursor 설정 열기**
   - Cursor 메뉴 → "Settings" (또는 `Ctrl + ,`)

2. **MCP 설정 찾기**
   - 왼쪽 메뉴에서 "Tools & MCP" 클릭
   - 또는 검색창에 "MCP" 입력

3. **새 MCP 서버 추가**
   - "New MCP Server" 또는 "+" 버튼 클릭

4. **설정 입력**
   ```json
   {
     "mcpServers": {
       "github": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-github"
         ],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "여기에_복사한_토큰_붙여넣기"
         }
       }
     }
   }
   ```

5. **저장**
   - 설정 저장
   - Cursor 재시작 (필요시)

## 🔍 3단계: 연결 확인하기

1. **MCP 서버 상태 확인**
   - Settings → Tools & MCP
   - GitHub 서버가 "enabled" 상태인지 확인
   - 초록색 점이면 정상 연결 ✅

2. **테스트**
   - Cursor 채팅에서 GitHub 관련 명령 시도
   - 예: "GitHub 저장소 목록 보여줘"

## 📝 설정 예시 (전체)

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=esrvexhyrpwwyjpjeuqi"
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

## 🎯 사용 가능한 기능

연결 후 사용할 수 있는 기능:

1. **저장소 관리**
   - 저장소 목록 보기
   - 파일 읽기/쓰기
   - 커밋 생성
   - 브랜치 관리

2. **이슈 관리**
   - 이슈 생성/수정
   - 이슈 목록 보기

3. **Pull Request**
   - PR 생성
   - PR 리뷰

## ⚠️ 주의사항

1. **토큰 보안**
   - 토큰을 절대 공개하지 마세요!
   - `.env` 파일이나 설정 파일에 저장하지 마세요
   - Cursor 설정에만 저장하세요

2. **토큰 만료**
   - 만료되면 새로 만들어야 합니다
   - 만료 전에 갱신하는 것을 권장합니다

3. **권한 관리**
   - 필요한 최소한의 권한만 부여하세요
   - `repo` 권한은 모든 저장소에 접근 가능합니다

## 🔧 문제 해결

### "연결 실패" 오류가 나오면?
- 토큰이 올바른지 확인
- 토큰에 필요한 권한이 있는지 확인
- Cursor를 재시작해보세요

### "권한 없음" 오류가 나오면?
- 토큰에 `repo` 권한이 있는지 확인
- 저장소가 private인 경우 토큰에 접근 권한이 있어야 합니다

## 📚 참고 자료

- GitHub Personal Access Token: https://github.com/settings/tokens
- MCP GitHub 서버: https://github.com/modelcontextprotocol/servers/tree/main/src/github

---

**연결 후에는 Cursor에서 GitHub 저장소를 직접 관리할 수 있습니다!** 🎉

