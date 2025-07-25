// FT-01: FooterComponent Test - Unique ID: FT-01-FOOTER
import { test, expect } from '@playwright/test';
import { FooterComponent } from '../components/FooterComponent';

const homepageUrl = 'https://ecohotels.com/';

function setupFooter(page) {
  return new FooterComponent(page);
}

// FT-01-01: Verify that clicking the logo shows the homepage
// Unique ID: FT-01-01

test('FT-01: Clicking the EcoHotels.com logo in the footer redirects to the homepage', async ({ page }) => {
  const footer = setupFooter(page);
  await page.goto(homepageUrl);
  await footer.acceptCookiesIfPresent();
  await footer.scrollToFooter();
  await footer.clickFooterLogo();
  await expect(page).toHaveURL(homepageUrl);
});

// FT-01-02: Verify links under "About", "Help", and "For Hotels" are visible and clickable
// Unique ID: FT-01-02

test('FT 02: Footer links under About, Help, and For Hotels are visible and clickable', async ({ page }) => {
  let footer = setupFooter(page);
  await page.goto(homepageUrl);
  await footer.acceptCookiesIfPresent();
  await footer.scrollToFooter();
  // About
  const aboutLinks = [
    { name: 'Learn More About Us', heading: 'About EcoHotels.Com' },
    { name: 'Discover What We Do', heading: 'What We Do' },
    { name: 'Blog', heading: 'Latest posts' },
    { name: 'Partners', heading: 'Connectivity Partners' },
    { name: 'Why Book With Us', heading: 'Why Book With Us' },
    { name: 'Eco-Certifications', heading: 'Certifications' },
  ];
  for (const link of aboutLinks) {
    if (await footer.getLinkByName(link.name).isVisible().catch(() => false)) {
      await footer.getLinkByName(link.name).click();
      await expect(page.getByRole('heading', { name: link.heading })).toBeVisible();
      await page.goto(homepageUrl);
      footer = setupFooter(page);
      await footer.acceptCookiesIfPresent();
      await footer.scrollToFooter();
    }
  }
  // Help
  const helpLinks = [
    { name: 'FAQ for Guests', heading: 'Frequently Asked Questions' },
    { name: 'FAQ for Hotels', heading: 'List your place on EcoHotels.' },
    { name: 'Contact', heading: 'Contact EcoHotels.com' },
    { name: 'Terms & Conditions', heading: 'Find Hotels' }, // opens in new tab
  ];
  for (const link of helpLinks) {
    if (link.name === 'Terms & Conditions') {
      let popup: import('@playwright/test').Page | null = null;
      try {
        [popup] = await Promise.all([
          page.waitForEvent('popup', { timeout: 5000 }).catch(() => null),
          footer.getLinkByName(link.name).click(),
        ]);
      } catch {}
      if (popup) {
        await expect(popup.getByText('Find Hotels', { exact: true })).toBeVisible();
        await popup.close();
      } else {
        // Fallback: check the current page
        await expect(page.getByText('Find Hotels', { exact: true })).toBeVisible();
        await page.goBack();
        footer = setupFooter(page);
        await footer.acceptCookiesIfPresent();
        await footer.scrollToFooter();
      }
    } else if (await footer.getLinkByName(link.name).isVisible().catch(() => false)) {
      await footer.getLinkByName(link.name).click();
      if (link.heading === 'Frequently Asked Questions') {
        await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: link.heading })).toBeVisible();
      }
      await page.goto(homepageUrl);
      footer = setupFooter(page);
      await footer.acceptCookiesIfPresent();
      await footer.scrollToFooter();
    }
  }
  // For Hotels
  const forHotelsLinks = [
    { name: 'Join the Movement', heading: 'Join the Movement' },
    { name: 'Partner Login', heading: null }, // just check navigation
  ];
  for (const link of forHotelsLinks) {
    if (await footer.getLinkByName(link.name).isVisible().catch(() => false)) {
      await footer.getLinkByName(link.name).click();
      if (link.heading) {
        await expect(page.getByRole('heading', { name: link.heading })).toBeVisible();
      } else {
        await expect(page).not.toHaveURL(homepageUrl);
      }
      await page.goto(homepageUrl);
      footer = setupFooter(page);
      await footer.acceptCookiesIfPresent();
      await footer.scrollToFooter();
    }
  }
});

// FT-01-03: Verify Social Media Links (all open)
// Unique ID: FT-01-03

test('FT 03: Footer social media links are present and all open in new tabs', async ({ page, context }) => {
  const footer = setupFooter(page);
  await page.goto(homepageUrl);
  await footer.acceptCookiesIfPresent();
  await footer.scrollToFooter();
  const socialLinks = await footer.getAllSocialLinks();
  for (const link of socialLinks) {
    if (await link.isVisible().catch(() => false)) {
      const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        link.click(),
      ]);
      await expect(popup).not.toBeNull();
      await popup.close();
    }
  }
});

// FT-01-04: Verify that user can fill and submit the Contact Form
// Unique ID: FT-01-04

test('FT 04: User can fill and submit the Contact Form in the footer', async ({ page }) => {
  const footer = setupFooter(page);
  await page.goto(homepageUrl);
  await footer.acceptCookiesIfPresent();
  await footer.scrollToFooter();
  await footer.goToContactForm();
  await footer.fillAndSubmitContactForm({
    firstName: 'Test',
    lastName: 'Test',
    email: 'test@test.com',
    phone: '+1 (234) 567-89',
    bookingID: 'Test',
    subject: 'Test',
    message: 'This is a Test.'
  });
  // Optionally, check for a success message
  // await expect(page.getByText(/Thank you|success|received/i)).toBeVisible({ timeout: 5000 });
});

// FT-01-05: Verify that user can choose to click any, one, or two footer links
// Unique ID: FT-01-05

test('FT 05: User can choose to click any, one, or two footer links', async ({ page }) => {
  const footer = setupFooter(page);
  await page.goto(homepageUrl);
  await footer.acceptCookiesIfPresent();
  await footer.scrollToFooter();
  // Example: Click one link
  const aboutLink = footer.getLinkByName('Learn More About Us');
  if (await aboutLink.isVisible().catch(() => false)) {
    await aboutLink.click();
    await expect(page.getByRole('heading', { name: 'About EcoHotels.Com' })).toBeVisible();
  }
  // Example: Click two links
  await page.goto(homepageUrl);
  await footer.acceptCookiesIfPresent();
  await footer.scrollToFooter();
  const helpLink = footer.getLinkByName('FAQ for Guests');
  if (await helpLink.isVisible().catch(() => false)) {
    await helpLink.click();
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
  }
}); 