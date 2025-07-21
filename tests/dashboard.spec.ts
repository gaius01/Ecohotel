import { test, expect } from '@playwright/test';
import { DashboardComponent } from '../components/DashboardComponent';

async function loginAndValidateDashboard(page) {
  const dashboard = new DashboardComponent(page);
  await page.goto('https://ecohotels.com/account/login/');
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill('maria+404@ecohotels.com');
  await page.locator('label').filter({ hasText: 'I agree to the processing of' }).locator('div').click();
  await page.getByRole('button', { name: 'Continue with email' }).click();
  await page.waitForSelector('#otp-input-0');
  await page.locator('#otp-input-0').fill('1');
  await page.locator('#otp-input-1').fill('2');
  await page.locator('#otp-input-2').fill('3');
  await page.locator('#otp-input-3').fill('4');
  await page.locator('#otp-input-4').fill('5');
  await page.locator('#otp-input-5').fill('6');
  await page.getByRole('button', { name: 'Verify email' }).click();
  
  // Debug: Check what happens after login
  await page.waitForTimeout(3000);
  const currentUrl = await page.url();
  console.log('URL after login:', currentUrl);
  
  // Wait for dashboard elements with fallback
  try {
    await page.waitForSelector("img[alt='Eco Logo']", { timeout: 10000 });
  } catch (e) {
    console.log('Logo not found, checking if we need to navigate to dashboard');
    if (!currentUrl.includes('/dashboard')) {
      await dashboard.gotoDashboard();
      await page.waitForSelector("img[alt='Eco Logo']", { timeout: 10000 });
    }
  }
  
  await page.getByText('Good', { exact: false }).waitFor({ timeout: 15000 });
  return dashboard;
}

test.describe('Dashboard Test Cases', () => {
  test('DB-01 Check that the logo is visible and click it to open home page', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    await expect(dashboard.logo).toBeVisible();
    await dashboard.logo.click();
    await expect(page).toHaveURL('https://ecohotels.com/');
  });

  test('DB-02 Validate that the user profile image is visible and clickable', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    await expect(dashboard.getProfileImage()).toBeVisible();
    await dashboard.getProfileImage().click();
  });

  test('DB-03 Verify the greeting message and other visible greeting elements', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    const greeting = await dashboard.getGreetingMessage();
    expect(greeting).toContain('Good');
    // Optionally check for username or other elements in the greeting area
    await expect(dashboard.greetingMessage).toBeVisible();
  });

  test('DB-04 Check that all navigation items are visible', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Bookings' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Profile' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Level' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('DB-05 Search for "Axel", select it, pick dates, and press search', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    // Use the codegen flow for search
    await page.getByRole('textbox', { name: 'Where are you going to?' }).click();
    await page.getByRole('textbox', { name: 'Where are you going to?' }).fill('Axel Guldsmeden');
    await page.locator('h4.font-ManropeBold').filter({ hasText: 'Axel Guldsmeden' }).click();
    // Dynamic date selection (today and tomorrow)
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const todayDate = today.getDate().toString();
    const tomorrowDate = tomorrow.getDate().toString();
    await page.getByRole('button', { name: todayDate }).first().click();
    await page.getByRole('button', { name: todayDate }).first().click(); // double click as in codegen
    await page.getByRole('button', { name: tomorrowDate }).first().click();
    await dashboard.searchButton.click();
    // Wait for search results page to load
    await page.waitForLoadState('networkidle');
    // Verify we're on a search results page (URL should change)
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('DB-06 Verify that the user can see their bookings in the dashboard', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    await dashboard.navBookings.click();
    await expect(await dashboard.getBookings()).toBeVisible();
  });

  test('DB-07 Verify that the user can update profile and press save', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    // Use the codegen flow for profile update
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('link', { name: 'My Profile' }).click();
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await page.getByRole('textbox', { name: 'Enter your first name' }).click();
    // Generate dynamic name with timestamp
    const timestamp = Date.now();
    const dynamicName = `Test${timestamp}`;
    await page.getByRole('textbox', { name: 'Enter your first name' }).fill(dynamicName);
    await page.getByRole('button', { name: 'Save' }).click();
  });

  test('DB-08 Open the My Level page', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    await dashboard.navLevel.click();
    await expect(await dashboard.getLevel()).toBeVisible();
  });

  test('DB-09 Select currency and click save in settings', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    await dashboard.settingsLink.click();
    await dashboard.editSettingsButton.click();
    await dashboard.currencySelect.selectOption('CHF');
    await dashboard.saveButton.click();
  });

  test('DB-10 Logout from the dashboard', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    await dashboard.logout();
    await expect(page).toHaveURL(/login/);
  });

  test('DB-11 Navigate to Home, My Profile, My Bookings, My Level', async ({ page }) => {
    const dashboard = await loginAndValidateDashboard(page);
    await dashboard.navHome.click();
    await dashboard.navProfile.click();
    await dashboard.navBookings.click();
    await dashboard.navLevel.click();
  });
}); 