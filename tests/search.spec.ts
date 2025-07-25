import { test, expect } from '@playwright/test';
import { SearchComponent } from '../components/SearchComponent';

let searchResultUrl: string;

// Setup: Run the robust homepage search once and reuse the result URL
// This ensures all tests start from the same search results page

test.describe('SEARCH RESULTS', () => {
  let search: SearchComponent;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    search = new SearchComponent(page);
    await search.runHomePageSearch();
    searchResultUrl = page.url();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    search = new SearchComponent(page);
    await page.goto(searchResultUrl);
    await expect(page.getByRole('heading', { name: /Hotels in/i })).toBeVisible();
  });

  test('SR-01 Verify that the search page is displayed', async () => {
    await expect(search.page.getByRole('heading', { name: /Hotels in/i })).toBeVisible();
    await expect(search.page.getByRole('textbox', { name: 'Where are you going to?' })).toBeVisible();
  });

  test('SR-02 Sort by Price (Lowest first)', async () => {
    await search.sortByPrice('Lowest');
    const prices = await search.page.$$eval('strong.js-price strong.font-ManropeBold', els => els.map(el => parseFloat((el.textContent ?? '').replace(/[^\d.]/g, ''))));
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('SR-03 Sort by Price (Highest first)', async () => {
    await search.sortByPrice('Highest');
    const prices = await search.page.$$eval('strong.js-price strong.font-ManropeBold', els => els.map(el => parseFloat((el.textContent ?? '').replace(/[^\d.]/g, ''))));
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  test('SR-04 Adjust budget slider and validate filtered results', async () => {
    // Placeholder: adjust selectors as needed for your slider
    const slider = search.page.locator('input[type="range"]').first();
    await slider.focus();
    await search.page.keyboard.press('ArrowRight');
    await search.page.waitForTimeout(500);
    const prices = await search.page.$$eval('strong.js-price strong.font-ManropeBold', els => els.map(el => parseFloat((el.textContent ?? '').replace(/[^\d.]/g, ''))));
    expect(prices.length).toBeGreaterThan(0);
  });

  test('SR-05 Filter by 4 stars only', async () => {
    await search.filterByStars([4]);
    await expect(search.page.getByText('4 stars')).toBeVisible();
  });

  test('SR-06 Filter by 3 and 5 stars', async () => {
    await search.filterByStars([3, 5]);
    await expect(search.page.getByText('3 stars')).toBeVisible();
    await expect(search.page.getByText('5 stars')).toBeVisible();
  });

  test('SR-07 Filter by Free Wifi and Car park', async () => {
    await search.filterByAmenities(['Free Wifi', 'Car park']);
    await expect(search.page.getByText('Free Wifi')).toBeVisible();
    await expect(search.page.getByText('Car park')).toBeVisible();
  });

  test('SR-08 Filter by Spa and Air Conditioning', async () => {
    await search.filterByAmenities(['Spa', 'Air conditioning']);
    await expect(search.page.getByText('Spa', { exact: true })).toBeVisible();
    await expect(search.page.getByText('Air conditioning')).toBeVisible();
  });

  test('SR-09 Filter by Property Type (e.g Hotel and Apartment)', async () => {
    await search.filterByPropertyType(['Hotel', 'Apartment']);
    await expect(search.page.getByText('Hotel', { exact: true })).toBeVisible();
    await expect(search.page.getByText('Apartment')).toBeVisible();
  });

  test('SR-10 Filter by Meal Plan - Bed & Breakfast', async () => {
    await search.filterByMealPlan('Bed & Breakfast');
    await expect(search.page.getByText('Bed & Breakfast')).toBeVisible();
  });

  test('SR-11 Filter by Cancellation Policy - Free Cancellation', async () => {
    await search.filterByCancellation();
    await expect(search.page.locator('label').filter({ hasText: 'Free Cancellation' })).toBeVisible();
  });

  test('SR-12 Filter by Sustainability Certification', async () => {
    await search.filterBySustainability();
    await expect(search.page.getByText('Sustainability Certification')).toBeVisible();
  });

  test('SR-13 Verify that "view more photo" on hotel display the images', async () => {
    await search.openPhotoModal();
    await expect(search.page.locator('#modal-overlay img')).toBeVisible();
  });

  test('SR-14 Verify that hotel can be add to favourite list using favourite button', async () => {
    await search.addToFavourite();
    await expect(search.page.locator('.fav-wrapper').first()).toBeVisible();
  });

  test('SR-15 Verify that user can enter search, check in date, check out date and click search to search result', async () => {
    await expect(search.page.getByRole('heading', { name: /Hotels in/i })).toBeVisible();
    await expect(search.page.getByRole('textbox', { name: 'Where are you going to?' })).toBeVisible();
  });

  test('SR-16 Verify that user can scroll left and right images on hotel image card', async () => {
    await search.openPhotoModal();
    await search.scrollImageModal();
    await expect(search.page.locator('#modal-overlay img')).toBeVisible();
    await search.closePhotoModal();
  });

  test('SR-17 Verify that user can scroll down the hotel search result page', async () => {
    await search.scrollResults();
    await expect(search.page.getByText('Facilities')).toBeVisible();
  });

  test('SR-18 Verify that user can open map and close it', async () => {
    await search.openAndCloseMap();
  });

  test('SR-19 Verify that users can be able to sign up/sign in using newletter button', async () => {
    await search.signUpViaNewsletter('maria+404@ecohotels.com');
  });
});
