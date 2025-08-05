import { test, expect } from '@playwright/test';
import { HotelDetailPage } from '../components/HotelDetailPage';
import { HomePageComponent } from '../components/HomePageComponent';

const HOTEL_DETAIL_URL = 'https://ecohotels.com/hotels/denmark/copenhagen/babette-guldsmeden/?search=true&bookReqId=14353498&checkin=2025-07-27&checkout=2025-07-28&rooms=2&rehid=95';

// Utility: Complete navigation flow to Babette Guldsmeden hotel page
async function navigateToBabetteHotel(page) {
  await page.goto('https://ecohotels.com/');
  await page.getByRole('button', { name: 'Accept' }).click();
  await page.getByRole('textbox', { name: 'Where are you going to?' }).click();
  await page.getByRole('textbox', { name: 'Where are you going to?' }).fill('Babette Guldsmeden');
  await page.getByRole('heading', { name: 'Babette Guldsmeden' }).click();
  await page.getByRole('button', { name: '28' }).first().click();
  await page.getByRole('button', { name: '28' }).first().click();
  await page.getByRole('button', { name: '29' }).first().click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.goto('https://ecohotels.com/hotels/denmark/copenhagen/?rehid=95&checkin=2025-07-28&checkout=2025-07-29&rooms=2');
  await page.locator('.text-gray-400').click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('.bg-\\[var\\(--color-orangeprimary\\)\\].text-\\[14px\\]').first().click();
  const page1 = await page1Promise;
  return page1;
}

// Utility: Close any newsletter popup or overlay (copied from Confirmation component)
async function closeAnyPopup(page) {
  try {
    // Wait a moment for any animations to complete
    await page.waitForTimeout(500);
    
    // Try to close the "Enjoyed your booking?" review popup FIRST (most important)
    await cancelEnjoyedBookingPopup(page);
    
    // Try to close modal if it exists
    const modalCloseButton = page.locator('.flex.justify-end > svg > path:nth-child(2)');
    if (await modalCloseButton.isVisible()) {
      await modalCloseButton.click({ force: true });
      await page.waitForTimeout(300);
    }
    
    // Try to close any other popup overlays
    const popupCloseButton = page.locator('[data-testid="close-popup"], .popup-close, .modal-close, .overlay-close');
    if (await popupCloseButton.isVisible()) {
      await popupCloseButton.click({ force: true });
      await page.waitForTimeout(300);
    }
    
    // Try to close review popup specifically
    const reviewCloseButton = page.locator('[data-testid="close-review"], .review-close');
    if (await reviewCloseButton.isVisible()) {
      await reviewCloseButton.click({ force: true });
      await page.waitForTimeout(300);
    }

    // Try to close Accept button popup
    const acceptButton = page.getByRole('button', { name: 'Accept' });
    if (await acceptButton.isVisible()) {
      await acceptButton.click({ force: true });
      await page.waitForTimeout(300);
    }

    // Try to close review popup using the specific X button in the review card
    const reviewCancelButton = page.locator('.bg-white.rounded-lg.shadow-lg svg.text-\\[var\\(--color-greenprimary\\)\\]').first();
    if (await reviewCancelButton.isVisible()) {
      await reviewCancelButton.click({ force: true });
      await page.waitForTimeout(300);
    }

    // Alternative: Try to close review using the flex justify-end container
    const reviewCancelContainer = page.locator('.flex.justify-end svg.text-\\[var\\(--color-greenprimary\\)\\]').first();
    if (await reviewCancelContainer.isVisible()) {
      await reviewCancelContainer.click({ force: true });
      await page.waitForTimeout(300);
    }

    // Final attempt: Try to close any remaining popups
    await cancelEnjoyedBookingPopup(page);
    
  } catch (error) {
    // If any popup close fails, continue with the test
    console.log('No popup to close or popup already closed');
  }
}

// Helper function to cancel the "Enjoyed your booking?" review popup specifically
async function cancelEnjoyedBookingPopup(page) {
  try {
    // Wait a moment for any animations to complete
    await page.waitForTimeout(1000);
    
    // Multiple strategies to find and click the cancel button
    
    // Strategy 1: Look for the review popup that contains "Enjoyed your booking?"
    const reviewPopup = page.locator('div:has-text("Enjoyed your booking?")');
    if (await reviewPopup.isVisible()) {
      // Find the X button within this popup - try multiple selectors
      const cancelButton1 = reviewPopup.locator('.flex.justify-end svg').first();
      if (await cancelButton1.isVisible()) {
        await cancelButton1.click({ force: true });
        await page.waitForTimeout(500);
        return;
      }
      
      // Try clicking the SVG directly
      const cancelButton2 = reviewPopup.locator('svg.text-\\[var\\(--color-greenprimary\\)\\]').first();
      if (await cancelButton2.isVisible()) {
        await cancelButton2.click({ force: true });
        await page.waitForTimeout(500);
        return;
      }
    }
    
    // Strategy 2: Direct approach - find any SVG with the specific classes
    const directCancelButton = page.locator('svg.text-\\[var\\(--color-greenprimary\\)\\].cursor-pointer').first();
    if (await directCancelButton.isVisible()) {
      await directCancelButton.click({ force: true });
      await page.waitForTimeout(500);
      return;
    }
    
    // Strategy 3: Find by the specific path content (the X icon)
    const xIconButton = page.locator('svg:has(path[d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"])').first();
    if (await xIconButton.isVisible()) {
      await xIconButton.click({ force: true });
      await page.waitForTimeout(500);
      return;
    }
    
    // Strategy 4: Try clicking on the flex justify-end container
    const flexContainer = page.locator('.flex.justify-end').first();
    if (await flexContainer.isVisible()) {
      await flexContainer.click({ force: true });
      await page.waitForTimeout(500);
      return;
    }
    
  } catch (error) {
    console.log('Enjoyed your booking popup not found or already closed');
  }
}

test.describe('Hotel Detail Page', () => {
  let hotelDetail: HotelDetailPage;
  let generatedUrl: string;

  test.beforeEach(async ({ page }) => {
    // Skip setup for HD-01 since it will handle its own flow
    if (test.info().title.includes('HD-01')) {
      return;
    }
    
    // For other tests, check if URL was captured
    if (!generatedUrl) {
      throw new Error('HD-01 must run first to capture the generated URL');
    }
  });

  // All other tests assume the hotel detail page is already open, so only unique assertions/interactions remain

  test('HD-01: Complete search flow and capture generated URL', async ({ page }) => {
    // Navigate to ecohotels.com
    await page.goto('https://ecohotels.com/');
    
    // Accept cookies
    await page.getByRole('button', { name: 'Accept' }).click();
    
    // Enter search destination
    await page.getByRole('textbox', { name: 'Where are you going to?' }).click();
    await page.getByRole('textbox', { name: 'Where are you going to?' }).fill('Babette Guldsmeden');
    await page.getByRole('heading', { name: 'Babette Guldsmeden' }).click();
    
    // Select dates (today and tomorrow)
    await page.getByRole('button', { name: '28' }).first().click();
    await page.getByRole('button', { name: '29' }).first().click();
    
    // Click search
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Navigate to search results page
    await page.goto('https://ecohotels.com/hotels/denmark/copenhagen/?rehid=95&checkin=2025-07-28&checkout=2025-07-29&rooms=2');
    
    // Click cancel button to bypass sign-in
    await page.locator('.text-gray-400').click();
    
    // Click the reserve button to open hotel detail page
    const page1Promise = page.waitForEvent('popup');
    await page.locator('.bg-\\[var\\(--color-orangeprimary\\)\\].text-\\[14px\\]').first().click();
    const page1 = await page1Promise;
    
    // Wait for the page to load
    await page1.waitForLoadState('networkidle');
    
    // Capture the generated URL
    generatedUrl = page1.url();
    console.log('Generated URL captured:', generatedUrl);
    
    // Close the popup
    await page1.close();
    
    // Close the main page
    await page.close();
    
    console.log('HD-01: Complete flow finished, URL captured, both pages closed');
  });

  test('HD-02: Users can click on Reserve button', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);

    // Perform the test
    await hotelDetail.clickReserve();
    
    // Close the page
    await page.close();
    
    console.log('HD-02: Test completed and page closed');
  });

  test('HD-03: Users can click on hotel detail navigation tabs', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);
    
    // Perform the test
    await hotelDetail.navigateAllTabs();
    
    // Close the page
    await page.close();
    
    console.log('HD-03: Test completed and page closed');
  });

  test('HD-04: Users can select hotels in similar properties', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);
    
    // Perform the test
    await hotelDetail.selectSimilarProperty();
    
    // Close the page
    await page.close();
    
    console.log('HD-04: Test completed and page closed');
  });

  test('HD-05: User can click on map', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);
    
    // Perform the test
    await hotelDetail.clickMapButton();
    await hotelDetail.expectMapVisible();
    
    // Close the page
    await page.close();
    
    console.log('HD-05: Test completed and page closed');
  });

  test('HD-06: User can view hotel story', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);
    
    // Perform the test
    await hotelDetail.openHotelStory();
    
    // Close the page
    await page.close();
    
    console.log('HD-06: Test completed and page closed');
  });

  test('HD-07: Best deal price is visible', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);
    
    // Perform the test
    await hotelDetail.verifyBestDeal();
    
    // Close the page
    await page.close();
    
    console.log('HD-07: Test completed and page closed');
  });

  test('HD-08: User can enter search, check in date, check out date and click search', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);
    
    // Perform the test
    const checkIn = '28';
    const checkOut = '29';
    const destination = 'Babette Guldsmeden';
    // Dynamically get the current year and month name for the assertion
    const today = new Date();
    const year = today.getFullYear() + 1; // Assuming the test is for next year as in the original example
    const monthIndex = 6; // July is month 6 (0-based index)
    const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'long' });
    await hotelDetail.fillDestination(destination);
    await hotelDetail.selectCheckInOutDates(checkIn, checkOut);
    await hotelDetail.clickSearch();
    await expect(page.locator('div').filter({ hasText: new RegExp(`^${monthName} ${year}$`) })).toBeVisible();
    await hotelDetail.openTravelers();
    await expect(page.getByText('Rooms1')).toBeVisible();
    
    // Close the page
    await page.close();
    
    console.log('HD-08: Test completed and page closed');
  });

  test('HD-09: User can scroll through similar hotel cards', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);
    
    // Perform the test
    await hotelDetail.scrollSimilarHotelCards();
    
    // Close the page
    await page.close();
    
    console.log('HD-09: Test completed and page closed');
  });

  test('HD-10: User can open hotel image and view and scroll too', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);
    
    // Perform the test
    await hotelDetail.openImageGallery();
    await hotelDetail.navigateImageGallery();
    await hotelDetail.navigateModalOverlay();
    
    // Close the page
    await page.close();
    
    console.log('HD-10: Test completed and page closed');
  });

  test('HD-11: User can add hotel to favourite list', async ({ page }) => {
    // Navigate to the captured URL
    await page.goto(generatedUrl);
    
    // Create hotel detail component (toolbox for hotel page interactions)
    hotelDetail = new HotelDetailPage(page);
    
    // Perform the test
    await hotelDetail.shareHotel();
    
    // Close the page
    await page.close();
    
    console.log('HD-11: Test completed and page closed');
  });
});
