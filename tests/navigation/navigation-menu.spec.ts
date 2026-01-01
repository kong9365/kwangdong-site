import { test, expect } from '@playwright/test';

test.describe('네비게이션 메뉴 테스트', () => {
  test('"방문예약" 메뉴 클릭 시 홈페이지로 이동', async ({ page }) => {
    await page.goto('/notice'); // 다른 페이지에서 시작

    await page.getByRole('link', { name: '방문예약' }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('"예약현황" 메뉴 클릭 시 예약현황 페이지로 이동', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: '예약현황' }).first().click();
    await expect(page).toHaveURL('/progress');
  });

  test('"공지사항" 메뉴 클릭 시 공지사항 페이지로 이동', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: '공지사항' }).click();
    await expect(page).toHaveURL('/notice');
  });

  test('"FAQ" 메뉴 클릭 시 FAQ 페이지로 이동', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'FAQ' }).first().click();
    await expect(page).toHaveURL('/faq');
  });

  test('"임직원모드" 클릭 시 임직원 로그인 페이지로 이동', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: '임직원모드' }).first().click();
    await expect(page).toHaveURL('/employee');
  });

  test('모든 페이지에서 네비게이션 메뉴가 일관되게 표시됨', async ({ page }) => {
    const pages = ['/', '/progress', '/notice', '/faq'];

    for (const url of pages) {
      await page.goto(url);

      // 각 페이지에서 네비게이션 링크 확인
      const nav = page.getByRole('navigation');
      await expect(nav.getByRole('link', { name: '방문예약' })).toBeVisible();
      await expect(nav.getByRole('link', { name: '공지사항' })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'FAQ' })).toBeVisible();
    }
  });
});
