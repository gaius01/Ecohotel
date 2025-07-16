import { Page, Locator, expect } from '@playwright/test';

export class DashboardComponent {
  readonly page: Page;
  readonly logo: Locator;
  readonly profileImage: Locator;
  readonly greetingMessage: Locator;
  readonly navHome: Locator;
  readonly navProfile: Locator;
  readonly navBookings: Locator;
  readonly navLevel: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly bookingsSection: Locator;
  readonly editProfileButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly doneButton: Locator;
  readonly saveButton: Locator;
  readonly levelSection: Locator;
  readonly settingsLink: Locator;
  readonly editSettingsButton: Locator;
  readonly currencySelect: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator("img[alt='Eco Logo']");
    this.profileImage = page.locator('#dash-header svg.bi-person-circle');
    this.greetingMessage = page.getByText('Good', { exact: false });
    this.navHome = page.getByRole('link', { name: 'Home' });
    this.navProfile = page.getByRole('link', { name: 'My Profile' }).nth(1);
    this.navBookings = page.getByRole('link', { name: 'My Bookings' });
    this.navLevel = page.getByRole('link', { name: 'My Level' }).nth(1);
    this.searchBox = page.getByRole('textbox', { name: 'Where are you going to?' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.bookingsSection = page.getByRole('heading', { name: 'Cancelled' });
    this.editProfileButton = page.getByRole('button', { name: 'Edit' });
    this.firstNameInput = page.getByRole('textbox', { name: 'Enter your first name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Enter your last name' });
    this.doneButton = page.getByRole('button', { name: 'Done' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.levelSection = page.getByText('Eco Explorer - Level 1');
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.editSettingsButton = page.getByRole('button', { name: 'Edit' });
    this.currencySelect = page.locator('#Currency');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async gotoDashboard() {
    await this.page.goto('https://ecohotels.com/account/dashboard/');
  }

  async clickLogo() {
    await this.logo.click();
  }

  async isLogoLinkedCorrectly() {
    await expect(this.page).toHaveURL('https://ecohotels.com/account/dashboard/');
  }

  getProfileImage() {
    return this.profileImage;
  }

  async clickProfileImage() {
    await this.profileImage.click();
  }

  async getGreetingMessage() {
    return await this.greetingMessage.textContent();
  }

  async getNavigationItems() {
    return [this.navHome, this.navProfile, this.navBookings, this.navLevel];
  }

  async searchDestination(destination: string) {
    await this.searchBox.fill(destination);
    await this.searchButton.click();
  }

  async getBookings() {
    return this.bookingsSection;
  }

  async updateProfile(firstName: string, lastName: string) {
    await this.editProfileButton.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.doneButton.click();
    await this.saveButton.click();
  }

  async getLevel() {
    return this.levelSection;
  }

  async updateSettings(currency: string) {
    await this.settingsLink.click();
    await this.editSettingsButton.click();
    await this.currencySelect.selectOption(currency);
    await this.saveButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
} 