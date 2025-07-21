import { Page, Locator, expect } from '@playwright/test';

export class HomePageComponent {
  readonly page: Page;
  readonly logo: Locator;
  readonly listPropertyLink: Locator;
  readonly signInSignUpLink: Locator;
  readonly currencyDropdown: Locator;
  readonly currencySEK: Locator;
  readonly currencyEUR: Locator;
  readonly destinationInput: Locator;
  readonly checkInOutInput: Locator;
  readonly travelersInput: Locator;
  readonly searchButton: Locator;
  readonly trendingHeading: Locator;
  readonly trendingDescription: Locator;
  readonly copenhagenCard: Locator;
  readonly berlinCard: Locator;
  readonly travelTipsHeading: Locator;
  readonly travelTipsParagraph: Locator;
  readonly visitBlogLink: Locator;
  readonly emailInput: Locator;
  readonly agreeTermsCheckbox: Locator;
  readonly cookieAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByRole('link', { name: 'EcoHotels.com logo' });
    this.listPropertyLink = page.getByRole('link', { name: 'List your property' });
    this.signInSignUpLink = page.getByRole('link', { name: 'Sign in/Sign up' });
    this.currencyDropdown = page.locator('.currency-dropdown > .flex');
    this.currencySEK = page.locator('div').filter({ hasText: /^SEK - Swedish Krona \(kr\)$/ }).first();
    this.currencyEUR = page.locator('div').filter({ hasText: /^EUR - Euro \(€\)$/ }).first();
    this.destinationInput = page.getByRole('textbox', { name: 'Where are you going to?' });
    this.checkInOutInput = page.getByRole('textbox', { name: 'Check-in date — Check-out date' });
    this.travelersInput = page.getByRole('textbox', { name: 'Travelers' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.trendingHeading = page.getByRole('heading', { name: 'Trending Destinations' });
    this.trendingDescription = page.getByText('EcoHotels.com top travel destinations');
    this.copenhagenCard = page.getByRole('link', { name: 'Copenhagen Copenhagen' });
    this.berlinCard = page.getByRole('link', { name: 'Berlin Berlin' });
    this.travelTipsHeading = page.getByText('Travel tips, top sights & nearby hotels');
    this.travelTipsParagraph = page.getByText('Let us guide you to an amazing experience and a comfortable stay.');
    this.visitBlogLink = page.getByRole('link', { name: 'Visit blog' });
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email address' });
    this.agreeTermsCheckbox = page.locator('label').filter({ hasText: 'I agree to the processing of' }).locator('div');
    this.cookieAcceptButton = page.locator('button, [role="button"]').filter({ hasText: /Accept/i });
  }

  async acceptCookiesIfPresent() {
    if (await this.cookieAcceptButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.cookieAcceptButton.click();
    }
  }

  async gotoHome() {
    await this.page.goto('https://ecohotels.com/');
  }

  async clickLogo() {
    await this.logo.click();
  }

  async clickListProperty() {
    await this.listPropertyLink.click();
  }

  async clickSignInSignUp() {
    await this.signInSignUpLink.click();
  }

  async changeCurrencyToSEK() {
    await this.currencyDropdown.click();
    await this.currencySEK.click();
  }

  async changeCurrencyToEUR() {
    await this.currencyDropdown.click();
    await this.currencyEUR.click();
  }

  async fillDestination(destination: string) {
    await this.destinationInput.click();
    await this.destinationInput.fill(destination);
  }

  async selectCheckInOutDates(checkIn: string, checkOut: string) {
    await this.checkInOutInput.click();
    await this.page.getByRole('button', { name: checkIn }).first().click();
    await this.page.getByRole('button', { name: checkOut }).first().click();
  }

  async openTravelers() {
    await this.travelersInput.click();
  }

  async clickSearch() {
    await this.searchButton.click();
  }

  async clickCopenhagenCard() {
    await this.copenhagenCard.click();
  }

  async clickBerlinCard() {
    await this.berlinCard.click();
  }

  async clickVisitBlog() {
    await this.visitBlogLink.click();
  }

  async fillNewsletterEmail(email: string) {
    await this.emailInput.click();
    await this.emailInput.fill(email);
  }

  async agreeToTerms() {
    await this.agreeTermsCheckbox.click();
  }
} 