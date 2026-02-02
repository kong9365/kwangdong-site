# Playwright Test Agents 사용 가이드

이 프로젝트는 Playwright Test Agents를 사용하여 AI 기반 테스트 자동화를 지원합니다.

## 개요

Playwright Test Agents는 세 가지 에이전트를 제공합니다:

1. **🎭 Planner** - 앱을 탐색하고 마크다운 테스트 계획을 생성
2. **🎭 Generator** - 마크다운 계획을 Playwright 테스트 파일로 변환
3. **🎭 Healer** - 테스트 실행 후 실패한 테스트를 자동으로 수정

## 설정 완료 사항

✅ Playwright 설치 완료
✅ Test Agents 초기화 완료
✅ 기본 디렉토리 구조 생성 완료
✅ Seed 테스트 생성 완료
✅ 기본 테스트 예시 생성 완료

## 디렉토리 구조

```
kwangdong-site/
├── .github/
│   └── agents/                          # 에이전트 정의 파일
│       ├── playwright-test-planner.agent.md
│       ├── playwright-test-generator.agent.md
│       └── playwright-test-healer.agent.md
├── specs/                               # 테스트 계획 (마크다운)
│   ├── README.md
│   └── basic-operations.md             # 예시 테스트 계획
├── tests/                               # 생성된 테스트 파일
│   ├── fixtures.ts                     # 커스텀 fixtures
│   ├── seed.spec.ts                    # 시드 테스트
│   └── home.spec.ts                    # 예시 테스트
├── playwright.config.ts                # Playwright 설정
└── package.json                        # 테스트 스크립트 포함
```

## 사용 방법

### 1. Planner 에이전트 사용

Planner 에이전트는 앱을 탐색하고 테스트 계획을 생성합니다.

**VS Code에서 사용:**
1. VS Code에서 AI 도구 열기 (Cmd/Ctrl + L)
2. 다음 프롬프트 입력:
   ```
   @playwright-test-planner.agent.md Generate a test plan for the reservation flow
   ```
3. Planner가 `specs/` 디렉토리에 마크다운 테스트 계획을 생성합니다.

**예시 프롬프트:**
- "Generate a test plan for guest checkout"
- "Create a test plan for admin approval workflow"
- "Plan tests for visitor check-in process"

### 2. Generator 에이전트 사용

Generator 에이전트는 마크다운 테스트 계획을 실행 가능한 Playwright 테스트로 변환합니다.

**VS Code에서 사용:**
1. VS Code에서 AI 도구 열기
2. 다음 프롬프트 입력:
   ```
   @playwright-test-generator.agent.md Generate tests from specs/basic-operations.md
   ```
3. Generator가 `tests/` 디렉토리에 테스트 파일을 생성합니다.

**참고:** Generator는 `seed.spec.ts`를 참조하여 환경 설정을 이해합니다.

### 3. Healer 에이전트 사용

Healer 에이전트는 실패한 테스트를 자동으로 수정합니다.

**사용 시나리오:**
1. 테스트 실행: `npm test`
2. 테스트 실패 시, VS Code에서 AI 도구 열기
3. 다음 프롬프트 입력:
   ```
   @playwright-test-healer.agent.md Fix the failing test: tests/home.spec.ts
   ```
4. Healer가 실패 원인을 분석하고 자동으로 수정합니다.

## 테스트 실행

### 기본 테스트 실행
```bash
npm test
```

### UI 모드로 실행 (추천)
```bash
npm run test:ui
```

### 디버그 모드로 실행
```bash
npm run test:debug
```

### 브라우저 표시 모드로 실행
```bash
npm run test:headed
```

## 테스트 작성 가이드

### Seed 테스트 (`tests/seed.spec.ts`)

Seed 테스트는 모든 테스트의 기반이 됩니다. 다음을 포함해야 합니다:
- 앱 초기화
- 기본 환경 설정
- 공통 설정 및 fixtures

### 기본 테스트 구조

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // 테스트 코드
  });
});
```

## 에이전트 프롬프트 예시

### Planner 프롬프트
```
@playwright-test-planner.agent.md 
Create a comprehensive test plan for the visitor reservation workflow including:
- Home page navigation
- Agreement page interaction
- Reservation form submission
- Progress tracking
```

### Generator 프롬프트
```
@playwright-test-generator.agent.md
Generate Playwright tests from the plan in specs/basic-operations.md
Focus on the reservation flow section.
```

### Healer 프롬프트
```
@playwright-test-healer.agent.md
The test "Home Page > should display factory selection options" is failing.
Please analyze and fix it.
```

## VS Code MCP 설정

VS Code에서 Playwright Test Agents를 사용하려면 MCP 설정이 필요합니다.

**설정 위치:** `.vscode/mcp.json`

이미 자동으로 생성되었습니다. 필요시 수동으로 확인하세요.

## 문제 해결

### 브라우저 설치 실패
인증서 문제로 브라우저 설치가 실패할 수 있습니다. 다음 명령어로 재시도:
```bash
npx playwright install --with-deps
```

### 에이전트가 작동하지 않음
1. VS Code 버전 확인 (v1.105 이상 필요)
2. MCP 설정 확인 (`.vscode/mcp.json`)
3. Playwright 버전 확인: `npx playwright --version`

### 테스트 실행 실패
1. `playwright.config.ts`의 `baseURL` 확인
2. 네트워크 연결 확인
3. 브라우저 설치 확인: `npx playwright install`

## 추가 리소스

- [Playwright Test Agents 공식 문서](https://playwright.dev/docs/test-agents)
- [Playwright 공식 문서](https://playwright.dev/docs/intro)
- [VS Code Playwright 확장](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

## 다음 단계

1. **테스트 계획 생성**: Planner를 사용하여 추가 테스트 계획 생성
2. **테스트 생성**: Generator를 사용하여 테스트 코드 자동 생성
3. **테스트 실행**: `npm run test:ui`로 테스트 실행 및 확인
4. **테스트 수정**: 실패한 테스트는 Healer로 자동 수정

## 참고사항

- 모든 에이전트는 `seed.spec.ts`를 참조하여 환경을 이해합니다
- 테스트 계획은 `specs/` 디렉토리에 마크다운 형식으로 저장됩니다
- 생성된 테스트는 `tests/` 디렉토리에 저장됩니다
- 에이전트 정의는 Playwright 업데이트 시 재생성해야 합니다: `npm run test:agents`




