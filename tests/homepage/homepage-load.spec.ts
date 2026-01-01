import { test, expect } from '@playwright/test';

test.describe('홈페이지 로드 테스트', () => {
  test('홈페이지가 성공적으로 로드되어야 함', async ({ page }) => {
    // 홈페이지 접속
    await page.goto('/');

    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/광동제약 방문 관리 시스템/);

    // 주요 헤딩 확인
    const heading = page.getByRole('heading', { name: /광동제약 공장 방문예약/ });
    await expect(heading).toBeVisible();

    // 환영 메시지 확인
    const welcomeText = page.getByText('방문예약시스템에 오신 것을 환영합니다');
    await expect(welcomeText).toBeVisible();
  });

  test('네비게이션 메뉴가 표시되어야 함', async ({ page }) => {
    await page.goto('/');

    // 네비게이션 영역의 링크 확인
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: '방문예약' })).toBeVisible();
    await expect(nav.getByRole('link', { name: '예약현황' })).toBeVisible();
    await expect(nav.getByRole('link', { name: '공지사항' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'FAQ' })).toBeVisible();

    // 임직원모드는 네비 바 외부에 있음
    await expect(page.getByRole('link', { name: '임직원모드' }).first()).toBeVisible();
  });

  test('방문절차 5단계가 표시되어야 함', async ({ page }) => {
    await page.goto('/');

    // 방문절차 단계 확인 - 각 STEP과 함께 확인
    await expect(page.getByText('STEP 01').first()).toBeVisible();
    await expect(page.getByText('STEP 02').first()).toBeVisible();
    await expect(page.getByText('STEP 03').first()).toBeVisible();
    await expect(page.getByText('STEP 04').first()).toBeVisible();
    await expect(page.getByText('STEP 05').first()).toBeVisible();

    // 절차 내용도 페이지에 존재하는지 확인 (여러 개 있을 수 있으므로 count 사용)
    await expect(page.getByText('방문신청')).toHaveCount(2); // 네비 + 절차
    await expect(page.getByText('내부승인')).toBeVisible();
    await expect(page.getByText('문자알림')).toBeVisible();
    await expect(page.getByText('방문수속')).toBeVisible();
  });

  test('공장 정보가 표시되어야 함', async ({ page }) => {
    await page.goto('/');

    // 송탄공장 정보 확인
    await expect(page.getByText(/송탄공장/)).toBeVisible();
    await expect(page.getByText(/평택시 경기대로 1081/)).toBeVisible();
    await expect(page.getByText(/031-8030-1777/)).toBeVisible();

    // GMP공장 정보 확인
    await expect(page.getByText(/GMP공장/)).toBeVisible();
    await expect(page.getByText(/평택시 산단로 114/)).toBeVisible();
    await expect(page.getByText(/031.*612-1111/)).toBeVisible();
  });

  test('신청하기 버튼이 표시되고 클릭 가능해야 함', async ({ page }) => {
    await page.goto('/');

    // 신청하기 버튼 확인
    const applyButton = page.getByRole('link', { name: '신청하기' });
    await expect(applyButton).toBeVisible();
    await expect(applyButton).toBeEnabled();

    // 클릭 시 약관 페이지로 이동
    await applyButton.click();
    await expect(page).toHaveURL(/\/reservation\/agreement/);
  });

  test('페이지가 3초 이내에 로드되어야 함', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // 3초 이내 로드 확인
    expect(loadTime).toBeLessThan(3000);
  });
});
