import { Page, expect, Locator } from '@playwright/test';

export class SearchComponent {
  constructor(public page: Page) {}

  async runHomePageSearch() {
    await this.page.goto('https://ecohotels.com/');
    await this.page.getByRole('button', { name: 'Accept' }).click();
    await expect(this.page.getByRole('textbox', { name: 'Where are you going to?' })).toBeVisible();
    await this.page.getByRole('textbox', { name: 'Where are you going to?' }).click();
    await this.page.getByRole('textbox', { name: 'Where are you going to?' }).fill('Axel Guldsmeden');
    await this.page.getByRole('heading', { name: 'Axel Guldsmeden' }).click();
    await this.page.getByRole('button', { name: '24' }).first().click();
    await this.page.getByRole('button', { name: '25' }).first().click();
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.locator('.text-gray-400').click();
    await expect(this.page.getByRole('heading', { name: /Hotels in/i })).toBeVisible();
  }

  async sortByPrice(order: 'Lowest' | 'Highest') {
    await this.page.getByText(`Price (${order} first)`).click();
  }

  async filterByStars(stars: number[]) {
    for (const star of stars) {
      await this.page.getByText(`${star} stars`).click();
    }
  }

  async filterByAmenities(amenities: string[]) {
    for (const amenity of amenities) {
      await this.page.getByText(amenity).click();
    }
  }

  async filterByPropertyType(types: string[]) {
    for (const type of types) {
      await this.page.getByText(type, { exact: true }).click();
    }
  }

  async filterByMealPlan(plan: string) {
    await this.page.getByText(plan).click();
  }

  async filterByCancellation() {
    await this.page.locator('label').filter({ hasText: 'Free Cancellation' }).click();
  }

  async filterBySustainability() {
    await this.page.getByText('Sustainability Certification').click();
  }

  async openPhotoModal() {
    await this.page.locator('.absolute.bottom-2').first().click();
    await expect(this.page.locator('#modal-overlay')).toBeVisible();
  }

  async addToFavourite() {
    await this.page.locator('.fav-wrapper').first().click();
  }

  async scrollImageModal() {
    await this.page.locator('#modal-overlay svg').nth(2).click(); // right
    await this.page.locator('#modal-overlay svg').nth(1).click(); // left
  }

  async closePhotoModal() {
    await this.page.locator('#modal-overlay').getByRole('button').click();
  }

  async scrollResults() {
    await this.page.mouse.wheel(0, 1000);
  }

  async openAndCloseMap() {
    await this.page.getByRole('button', { name: 'Show on map' }).click();
    await expect(this.page.locator('.close-map > svg')).toBeVisible();
    await this.page.locator('.close-map > svg').click();
    await expect(this.page.getByRole('button', { name: 'Show on map' })).toBeVisible();
  }

  async signUpViaNewsletter(email: string) {
    await this.page.getByText('Sign up', { exact: true }).click();
    await this.page.getByRole('textbox', { name: 'Enter your email address' }).click();
    await this.page.getByRole('textbox', { name: 'Enter your email address' }).fill(email);
    await this.page.locator('label').filter({ hasText: 'I agree to the processing of' }).locator('div').click();
    await this.page.getByRole('button', { name: 'Sign in with email' }).click();
    await this.page.locator('#otp-input-0').fill('1');
    await this.page.locator('#otp-input-1').fill('2');
    await this.page.locator('#otp-input-2').fill('3');
    await this.page.locator('#otp-input-3').fill('4');
    await this.page.locator('#otp-input-4').fill('5');
    await this.page.locator('#otp-input-5').fill('6');
    await this.page.getByRole('button', { name: 'Verify email' }).click();
    await expect(this.page.getByRole('textbox', { name: 'Where are you going to?' })).toBeVisible();
  }
}