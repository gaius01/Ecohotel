import { Page } from '@playwright/test';

export async function signUp(
  page: Page,
  email: string,
  otp: string[] = ['1','2','3','4','5','6'],
  marketingConsent: boolean = false
) {
  await page.goto('https://ecohotels.com/account/login/', { timeout: 120000 });
  await page.getByRole('textbox', { name: 'Enter your email address' }).click({ timeout: 120000 });
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill(email, { timeout: 120000 });
  await page.locator('label').filter({ hasText: 'I agree to the processing of' }).locator('div').click({ timeout: 120000 });
  if (marketingConsent) {
    const marketingCheckbox = page.locator('label:has-text("I want to receive marketing emails") input[type="checkbox"]');
    if (!(await marketingCheckbox.isChecked())) {
      await marketingCheckbox.click();
    }
  }
  await page.getByRole('button', { name: 'Continue with email' }).click({ timeout: 120000 });
  await page.locator('#otp-input-0').waitFor({ state: 'visible', timeout: 120000 });
  for (let i = 0; i < otp.length; i++) {
    await page.locator(`#otp-input-${i}`).fill(otp[i], { timeout: 120000 });
  }
  await page.getByRole('button', { name: 'Verify email' }).click({ timeout: 120000 });
} 