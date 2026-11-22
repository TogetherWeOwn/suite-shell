import { defineConfig } from '@playwright/test';

const port = Number(process.env.SUITE_SHELL_TEST_PORT ?? 45537);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: 'tests',
  testMatch: '*.spec.ts',
  workers: 2,
  forbidOnly: true,
  use: { browserName: 'chromium', baseURL },
  webServer: {
    command: `npm exec -- vite build && npm exec -- vite preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
  },
});
