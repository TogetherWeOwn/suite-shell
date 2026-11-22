import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the shell renders consumer-supplied navigation, search and settings', async ({ page }) => {
  await page.goto('/');
  const banner = page.getByRole('banner');
  await expect(banner.getByRole('link', { name: 'Riaklo Mail' })).toHaveAttribute('href', '/mail');
  await expect(banner.getByRole('searchbox', { name: 'Search mail' })).toBeVisible();
  await expect(banner.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings');
  const menu = banner.getByRole('button', { name: 'Navigation menu' });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
});

test('app links support arrow keys, normal tab order and Escape', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Suite apps' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const grid = page.getByRole('navigation', { name: 'Apps', exact: true });
  const mail = grid.getByRole('link', { name: 'Mail' });
  const drive = grid.getByRole('link', { name: 'Drive' });
  const account = grid.getByRole('link', { name: 'Account' });
  const docs = grid.getByRole('link', { name: 'Docs' });
  await expect(mail).toBeFocused();
  await expect(mail).toHaveAttribute('aria-current', 'page');
  await expect(drive).toHaveAttribute('href', 'https://drive.example.com');
  await expect(docs).toHaveAttribute('href', 'https://docs.example.com');
  await expect(grid.getByRole('link', { name: 'Sheets' })).toHaveCount(0);
  await page.keyboard.press('ArrowDown');
  await expect(docs).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowRight');
  await expect(drive).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(account).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(account).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(grid).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('switching disclosures or leaving them closes the old panel without stealing focus', async ({ page }) => {
  await page.goto('/');
  const apps = page.getByRole('button', { name: 'Suite apps' });
  const account = page.getByRole('button', { name: 'Account menu' });
  await apps.click();
  await account.click();
  await expect(apps).toHaveAttribute('aria-expanded', 'false');
  await expect(account).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Manage your account' })).toBeFocused();
  await page.getByRole('button', { name: 'Outside' }).focus();
  await expect(account).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Outside' })).toBeFocused();
  await apps.click();
  await page.getByRole('heading', { name: 'Inbox' }).click();
  await expect(apps).toHaveAttribute('aria-expanded', 'false');
});

test('the account panel presents identity and calls the consumer on sign-out', async ({ page }) => {
  await page.goto('/');
  const account = page.getByRole('button', { name: 'Account menu' });
  await account.click();
  await expect(page.getByText('member@example.com')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Manage your account' })).toHaveAttribute('href', 'https://account.example.com');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('status')).toHaveText('Sign-out requested');
  await expect(account).toHaveAttribute('aria-expanded', 'false');
  await expect(account).toBeFocused();
});

test('standalone disclosures stay within the viewport at either edge', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/?standalone');
  for (const name of ['Suite apps', 'Account menu']) {
    const trigger = page.getByRole('button', { name });
    await trigger.click();
    const id = await trigger.getAttribute('aria-controls');
    const bounds = await page.locator(`[id="${id}"]`).boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    await page.keyboard.press('Escape');
  }
});

test('Escape dismisses a panel after a pointer click on its heading', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Suite apps' });
  await trigger.click();
  await page.getByRole('heading', { name: 'Apps', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});

for (const { name, colorScheme, query, background } of [
  { name: 'system dark', colorScheme: 'dark', query: '', background: 'rgb(20, 22, 20)' },
  { name: 'console light', colorScheme: 'dark', query: '?host-theme=light', background: 'rgb(246, 246, 243)' },
  { name: 'console dark', colorScheme: 'light', query: '?host-theme=dark', background: 'rgb(20, 22, 20)' },
  { name: 'explicit shell theme', colorScheme: 'light', query: '?host-theme=light&theme=dark', background: 'rgb(20, 22, 20)' },
] as const) {
  test(`${name}: preview preserves compiled console colours`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto(`/${query}`);
    await expect(page.getByRole('banner')).toHaveCSS('background-color', background);
    if (name === 'system dark') {
      await expect(page.locator('.fixture')).toHaveCSS('background-color', 'rgb(15, 16, 15)');
    }
  });
}

test('the sign-out action can be scrolled fully into view at high zoom', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 160 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Account menu' });
  await trigger.click();
  const signOut = page.getByRole('button', { name: 'Sign out' });
  await signOut.scrollIntoViewIfNeeded();
  await expect(signOut).toBeInViewport({ ratio: 1 });
  await signOut.click();
  await expect(page.getByRole('status')).toHaveText('Sign-out requested');
});

test('a shell theme override does not restyle native host controls', async ({ page }) => {
  await page.goto('/?theme=dark');
  await expect(page.getByRole('banner')).toHaveCSS('color-scheme', 'dark');
  await expect(page.getByRole('button', { name: 'Outside' })).toHaveCSS('color-scheme', 'normal');
});

for (const theme of ['light', 'dark'] as const) {
  test(`${theme}: no serious or critical axe violations in either panel`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme === 'light' ? 'dark' : 'light' });
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`/?theme=${theme}`);
    await expect(page.getByRole('banner')).toHaveCSS('background-color', theme === 'light' ? 'rgb(246, 246, 243)' : 'rgb(20, 22, 20)');
    for (const name of ['Suite apps', 'Account menu']) {
      await page.getByRole('button', { name }).click();
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
      await page.keyboard.press('Escape');
    }
  });
}
