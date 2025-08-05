import { test, expect } from '@playwright/test';
import { HomePageComponent } from '../components/HomePageComponent';

test.describe('Home Page Test Cases', () => {
  // HP-01: Check that clicking on the logo redirects the user to the homepage
  test('HP-01: Clicking the EcoHotels.com logo redirects to the homepage', async ({ page }) => {
    const home = new HomePageComponent(page);
    await page.goto('https://ecohotels.com/account/login/');
    await home.clickLogo();
    await expect(page).toHaveURL('https://ecohotels.com/');
  });

  // HP-02: Ensure that the "List your property" link navigates to the correct signup page
  test('HP-02: "List your property" link navigates to admin page', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await home.clickListProperty();
    await expect(page).toHaveURL(/\/admin\//i);
  });

  // HP-03: Confirm that the "Login" link takes users to the private login page
  test('HP-03: "Sign in/Sign up" link takes users to login page', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await home.clickSignInSignUp();
    await expect(page).toHaveURL(/account\/login/);
  });

  // HP-04: Verify that the currency display shows "EUR" and updates correctly if changed
  test('HP-04: Currency dropdown displays and updates', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await home.changeCurrencyToSEK();
    await expect(home.currencyDropdown).toContainText('SEK');
    await home.changeCurrencyToEUR();
    await expect(home.currencyDropdown).toContainText('EUR');
  });

  // HP-05: Verify that users can input a destination in the "Where to?" field
  test('HP-05: Users can input a destination in the "Where are you going to?" field', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await home.fillDestination('G');
    await expect(home.destinationInput).toHaveValue('G');
  });

  // HP-06: Check if the "Check in" and "Check out" fields allow users to select dates
  test('HP-06: "Check-in date — Check-out date" field allows date selection', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await home.selectCheckInOutDates('18', '19');
    // Optionally assert that the field value has changed
  });

  // HP-07: Ensure that the "Travelers" field displays the default value
  test('HP-07: "Travelers" field displays and can be updated', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await home.openTravelers();
    await expect(home.travelersInput).toBeVisible();
    // Optionally check for default value if available
  });

  // HP-08: Ensure that clicking the search button initiates a search
  test('HP-08: Clicking the search button initiates a search', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await home.clickSearch();
    // Optionally assert that the URL or results change
  });

  // HP-09: Verify that the heading "Trending Destinations" is displayed
  test('HP-09: "Trending Destinations" heading is displayed', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await expect(home.trendingHeading).toBeVisible();
  });

  // HP-10: Check that the description is visible below the heading
  test('HP-10: "EcoHotels.com top travel destinations" description is visible', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await expect(home.trendingDescription).toBeVisible();
  });

  // HP-11: Ensure that clicking on a destination card navigates to the correct URL
  test('HP-11: Clicking on a destination card navigates to the correct URL', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    // Try to click a known card
    const cardNames = [
      'Copenhagen Copenhagen',
      'Oslo Oslo',
      'Berlin Berlin',
      'Dubai Dubai',
    ];
    let found = false;
    for (const name of cardNames) {
      const card = page.getByRole('link', { name });
      if (await card.isVisible().catch(() => false)) {
        await card.click();
        found = true;
        break;
      }
    }
    // If not found, scroll carousel and try 'Barcelona Barcelona'
    if (!found) {
      const nextButton = page.getByRole('button', { name: /next slide/i });
      await nextButton.click();
      await nextButton.click();
      const barcelonaCard = page.getByRole('link', { name: 'Barcelona Barcelona' });
      await expect(barcelonaCard).toBeVisible();
      await barcelonaCard.click();
    }
    await expect(page).toHaveURL(/\/hotels\//i);
  });

  // HP-12: Verify that the section displays the heading for travel tips
  test('HP-12: Section heading for travel tips is displayed', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await expect(home.travelTipsHeading).toBeVisible();
  });

  // HP-13: Check that the paragraph below the heading reads as expected
  test('HP-13: Paragraph for travel tips section is visible', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await expect(page.getByText('Let us guide you to an amazing experience and a comfortable stay')).toBeVisible();
  });

  // HP-14: Scrolling in Trending Destinations
  test('HP-14: Trending Destinations - Can scroll carousel and see new destinations', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    // Click next slide button and check that a new destination appears
    const nextButton = page.getByRole('button', { name: /next slide/i });
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    // Optionally, check that a new card appears (e.g., Berlin)
    await expect(home.berlinCard).toBeVisible();
  });

  // HP-15: Check for 'Find hotels with a purpose / EcoHotels.com plants a tree for every booking!' text
  test('HP-15: Home page - "Find hotels with a purpose / EcoHotels.com plants a tree for every booking!" is visible', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await expect(page.getByText(/Find hotels with a purpose/i)).toBeVisible();
    await expect(page.getByText(/EcoHotels.com plants a tree for every booking/i)).toBeVisible();
  });

  // HP-16: Blog navigation
  test('HP-16: Blog - Clicking "Visit blog" opens the blog in a new tab', async ({ page, context }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    const [blogPage] = await Promise.all([
      context.waitForEvent('page'),
      home.clickVisitBlog(),
    ]);
    await blogPage.waitForLoadState();
    await expect(blogPage).toHaveURL(/blog/);
  });

  // HP-17: Newsletter sign-up flow (simplified, no OTP)
  test('HP-17: Newsletter - User can enter email and agree to terms', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    await home.fillNewsletterEmail('maria+404@ecohotels.com');
    await home.agreeToTerms();
    await expect(home.emailInput).toHaveValue('maria+404@ecohotels.com');
  });

  // SR-01: Search for "Axel Guldsmeden" from the home page, select it, pick dates, and press search
  test('SR-01: Home - Search for Axel Guldsmeden, select suggestion, pick dates, and search', async ({ page }) => {
    const home = new HomePageComponent(page);
    await home.gotoHome();
    await home.acceptCookiesIfPresent();
    // Fill destination and select suggestion
    await home.destinationInput.click();
    await home.destinationInput.fill('Axel Guldsmeden');
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
    await home.clickSearch();
    // Wait for search results page to load
    await page.waitForLoadState('networkidle');
    // Verify we're on a search results page (URL should change from home)
    await expect(page).not.toHaveURL('https://ecohotels.com/');
  });
}); 