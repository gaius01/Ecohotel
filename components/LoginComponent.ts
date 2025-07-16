import { Page, Locator, expect } from '@playwright/test';

export class LoginComponent {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerHereLink: Locator;
  readonly showPasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.rememberMeCheckbox = page.locator('label').filter({ hasText: 'Remember me' }).locator('div');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
    this.registerHereLink = page.getByRole('link', { name: 'Register here' });
    this.showPasswordButton = this.passwordInput.locator('..').getByRole('button', { name: 'Show' });
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('https://ecohotels.com/account/corporatelogin/');
  }

  /**
   * Fill in email address
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill in password
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Fill in both email and password
   */
  async fillCredentials(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  /**
   * Click the login button
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Complete login process with credentials
   */
  async login(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.clickLogin();
  }

  /**
   * Toggle the "Remember me" checkbox
   */
  async toggleRememberMe() {
    await this.rememberMeCheckbox.click();
  }

  /**
   * Check if "Remember me" checkbox is visible and clickable
   */
  async isRememberMeVisible(): Promise<boolean> {
    return await this.rememberMeCheckbox.isVisible();
  }

  /**
   * Click the "Forgot Password" link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click the "Register here" link
   */
  async clickRegisterHere() {
    await this.registerHereLink.click();
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility() {
    if (await this.showPasswordButton.isVisible()) {
      await this.showPasswordButton.click();
    }
  }

  /**
   * Check if password is visible (type="text") or hidden (type="password")
   */
  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'text';
  }

  /**
   * Check if show password button is available
   */
  async isShowPasswordButtonAvailable(): Promise<boolean> {
    return await this.showPasswordButton.isVisible();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    } catch (error) {
      // If domcontentloaded times out, try with a shorter timeout
      await this.page.waitForLoadState('load', { timeout: 10000 });
    }
  }

  /**
   * Check if user is still on login page (for failed login scenarios)
   */
  async isOnLoginPage(): Promise<boolean> {
    return this.page.url() === 'https://ecohotels.com/account/corporatelogin/';
  }

  /**
   * Get error message text (if any visible error messages exist)
   */
  async getErrorMessageText(): Promise<string> {
    // Look for common error message patterns
    const errorSelectors = [
      'div[role="alert"]',
      '.error-message',
      '.alert-error',
      '[data-testid="error-message"]'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = this.page.locator(selector);
      if (await errorElement.isVisible()) {
        return await errorElement.textContent() || '';
      }
    }
    
    return '';
  }

  /**
   * Clear email field
   */
  async clearEmail() {
    await this.emailInput.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword() {
    await this.passwordInput.clear();
  }

  /**
   * Clear both fields
   */
  async clearAllFields() {
    await this.clearEmail();
    await this.clearPassword();
  }

  /**
   * Verify that we are on the login page
   */
  async verifyOnLoginPage() {
    await expect(this.page).toHaveURL('https://ecohotels.com/account/corporatelogin/');
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Verify successful login (redirected away from login page)
   */
  async verifySuccessfulLogin() {
    await expect(this.page).not.toHaveURL('https://ecohotels.com/account/corporatelogin/');
  }

  /**
   * Verify login failed (still on login page)
   */
  async verifyLoginFailed() {
    await expect(this.page).toHaveURL('https://ecohotels.com/account/corporatelogin/');
    await expect(this.emailInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Verify all form elements are visible and functional
   */
  async verifyFormElementsVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.rememberMeCheckbox).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.registerHereLink).toBeVisible();
  }

  /**
   * Verify form elements are functional by testing input
   */
  async verifyFormElementsFunctional() {
    // Test email input
    await this.emailInput.fill('test@example.com');
    await expect(this.emailInput).toHaveValue('test@example.com');
    
    // Test password input
    await this.passwordInput.fill('testpassword');
    await expect(this.passwordInput).toHaveValue('testpassword');
    
    // Test login button is enabled
    await expect(this.loginButton).toBeEnabled();
  }
} 