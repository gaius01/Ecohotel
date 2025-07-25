import { Page, Locator, expect } from '@playwright/test';

export class FooterComponent {
  readonly page: Page;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footer = page.getByRole('contentinfo');
  }

  async getFooterLogo(): Promise<Locator> {
    // Find the logo link only within the footer
    return this.footer.getByRole('link', { name: /Ecohotels.com Logo/i });
  }

  async acceptCookiesIfPresent() {
    const cookieButton = this.page.getByRole('button', { name: 'Accept' });
    if (await cookieButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cookieButton.click();
    }
  }

  async scrollToFooter() {
    // Always re-query the footer in case of navigation/DOM changes
    const footer = this.page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  }

  async clickFooter() {
    await this.footer.click();
  }

  async clickFooterLogo() {
    const logo = await this.getFooterLogo();
    await logo.click();
  }

  async goToContactForm() {
    await this.footer.click();
    await this.page.getByRole('link', { name: 'Contact' }).click();
  }

  getContactFormFields() {
    return {
      firstName: this.page.getByRole('textbox', { name: 'First Name' }),
      lastName: this.page.getByRole('textbox', { name: 'Last Name' }),
      email: this.page.locator('#Email'),
      phone: this.page.getByRole('textbox', { name: '1 (702) 123-' }),
      bookingID: this.page.locator('#bookingID'),
      subject: this.page.locator('div').filter({ hasText: /^Subject$/ }).getByRole('textbox'),
      message: this.page.getByRole('textbox', { name: 'Write your message...' }),
      sendButton: this.page.getByRole('button', { name: 'Send Message' })
    };
  }

  async fillAndSubmitContactForm(data: { firstName: string, lastName: string, email: string, phone: string, bookingID: string, subject: string, message: string }) {
    const fields = this.getContactFormFields();
    await fields.firstName.fill(data.firstName);
    await fields.lastName.fill(data.lastName);
    await fields.email.fill(data.email);
    await fields.phone.fill(data.phone);
    await fields.bookingID.fill(data.bookingID);
    await fields.subject.fill(data.subject);
    await fields.message.fill(data.message);
    await fields.sendButton.click();
  }

  getLinkByName(name: string): Locator {
    return this.page.getByRole('link', { name });
  }

  getAllSocialLinks(): Locator[] {
    // Assume 4 social links in the footer, adjust if needed
    const base = this.page.getByRole('contentinfo').getByRole('link').filter({ hasText: /^$/ });
    return [base.nth(0), base.nth(1), base.nth(2), base.nth(3)];
  }
} 