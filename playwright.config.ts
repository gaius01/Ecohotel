import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  reporter: [['html', { open: 'never' }]],
  projects: [
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        headless: false,
      },
    },
  ],
  timeout: 120000,
}); 