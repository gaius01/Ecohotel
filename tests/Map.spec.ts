import { test, expect } from '@playwright/test';
import { MapComponent } from '../components/Map';

let searchResultUrl: string;

// Setup: Run the robust homepage search once and reuse the result URL
// This ensures all tests start from the same search results page

test.describe('MAP FUNCTIONALITY', () => {
  let map: MapComponent;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    map = new MapComponent(page);
    await map.runHomePageSearch();
    searchResultUrl = page.url();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    map = new MapComponent(page);
    await page.goto(searchResultUrl);
    await expect(page.getByRole('heading', { name: /Hotels in/i })).toBeVisible();
  });

  test('MP-01 Verify that user can click on show map', async ({ page }) => {
    // Check if sign-in overlay appears and force cancel it
    try {
      await expect(page.locator('div').filter({ hasText: 'Sign in or create account to' }).nth(1)).toBeVisible();
      await page.locator('.text-gray-400').click();
    } catch (error) {
      // If overlay doesn't appear, continue with the test
      console.log('Sign-in overlay not present, continuing with test');
    }
    
    // Verify "Show on map" button is present
    await expect(page.getByRole('main')).toContainText('Show on map');
    
    // Click on "Show on map" button
    await page.getByRole('button', { name: 'Show on map' }).click();
    
    // Verify map is displayed
    await expect(page.locator('.map-body')).toBeVisible();
    
    // Close the map
    await page.locator('.close-map > svg').click();
  });

  test('MP-02 Verify that user can click on price filter', async ({ page }) => {
    // Handle sign-in overlay if present
    await map.handleSignInOverlay();
    
    // Click on "Show on map" button
    await page.getByRole('button', { name: 'Show on map' }).click();
    
    
    // Click on "Price Sort" button
    await map.clickPriceSort();
    
    // Select "Price (Lowest first)"
    await map.selectPriceLowestFirst();
    
    // Select "Price (Highest first)"
    await map.selectPriceHighestFirst();
    
    // Select "Price (Highest first)" again
    await map.selectPriceHighestFirst();
    
    // Close the map
    await page.locator('.close-map > svg').click();
  });

  test('MP-03: Verify that user can click on price Budget and scroll functionality', async ({ page }) => {
     // Handle sign-in overlay if present
     await map.handleSignInOverlay();
    
     // Click on "Show on map" button
     await page.getByRole('button', { name: 'Show on map' }).click();
    
    // Test budget functionality using exact flow
    await map.clickYourBudget();
    
    // Get initial prices before slider interaction
    const initialMinPrice = await map.getPriceText('Min €');
    const initialMaxPrice = await map.getPriceText('Max €');
    console.log('Initial Min Price:', initialMinPrice);
    console.log('Initial Max Price:', initialMaxPrice);
    
    // Scroll to center the budget filter area
    await map.scrollToCenterBudgetFilter();
    
    // Focus on the min slider and move it to the right (increase min price)
    await map.interactWithMinSlider();
    
    // Focus on the max slider and move it to the left (decrease max price)
    await map.interactWithMaxSlider();
    
    // Additional scrolling to ensure sliders are properly centered
    await map.scrollFineTune();
    
    // Click on Min and Max price displays to trigger updates
    await map.clickPriceDisplays();
    
    // Wait for price updates
    await page.waitForTimeout(2000);
    
    // Get updated prices after slider interaction
    const updatedMinPrice = await map.getPriceText('Min €');
    const updatedMaxPrice = await map.getPriceText('Max €');
    console.log('Updated Min Price:', updatedMinPrice);
    console.log('Updated Max Price:', updatedMaxPrice);
    
    // Validate that prices have changed (indicating slider is working)
    expect(updatedMinPrice).not.toBe(initialMinPrice);
    expect(updatedMaxPrice).not.toBe(initialMaxPrice);
    
    // Additional validation: check if prices are closer to center values
    if (initialMinPrice && initialMaxPrice && updatedMinPrice && updatedMaxPrice) {
      const initialMinValue = parseFloat(initialMinPrice.replace(/[^\d.]/g, ''));
      const initialMaxValue = parseFloat(initialMaxPrice.replace(/[^\d.]/g, ''));
      const updatedMinValue = parseFloat(updatedMinPrice.replace(/[^\d.]/g, ''));
      const updatedMaxValue = parseFloat(updatedMaxPrice.replace(/[^\d.]/g, ''));
      
      // Min price should increase (slider moved right)
      expect(updatedMinValue).toBeGreaterThan(initialMinValue);
      // Max price should decrease (slider moved left)
      expect(updatedMaxValue).toBeLessThan(initialMaxValue);
    }
    
    console.log('MP-03: Price budget and scroll functionality test completed');
  });

  test('MP-04 Verify that user can click on price Star rating', async ({ page }) => {
    // Handle sign-in overlay if present
    await map.handleSignInOverlay();
    
    // Click on "Show on map" button
    await page.getByRole('button', { name: 'Show on map' }).click();
    
    // Click on "Star Rating" button
    await map.clickStarRating();
    
    // Select different star ratings
    await map.selectStarRating(1);
    await map.selectStarRating(3);
    await map.selectStarRating(5);
    await map.selectStarRating(2);
    await map.selectStarRating(3);
    await map.selectStarRating(5);
    await map.selectStarRating(2);
    await map.selectStarRating(4);
    await map.selectStarRating(1);
    
    // Close the map
    await map.closeMapWithOverlay();
  });

  test('MP-05 Verify that user can click on price Facilities', async ({ page }) => {
    // Handle newsletter overlay before clicking map
    await map.handleNewsletterBeforeMap();
    
    // Click on "Show on map" button
    await page.getByRole('button', { name: 'Show on map' }).click();
    
    // Click on "Facilities" button
    await map.clickFacilities();
    
    // Select various facilities
    await map.selectFacility('Car park');
    await map.selectFacility('Free Wifi');
    await map.selectFacility('Conference room');
    await map.selectFacility('Restaurant');
    await map.selectFacility('Restaurant');
    await map.selectFacility('Car park');
    await map.selectFacility('Conference room');
    await map.selectFacility('Swimming Pool');
    await map.selectFacility('Air conditioning');
    await map.selectFacility('Gym/Fitness');
    await map.selectFacility('Free Wifi');
    await map.selectFacility('Spa');
    await map.selectFacility('Air conditioning');
    await map.selectFacility('Air conditioning');
    await map.selectFacility('Swimming Pool');
    await map.selectFacility('Spa');
    await map.selectFacility('Spa');
    
    // Click on facility combination
    await map.clickFacilityCombination();
    
    // Select additional facilities
    await map.selectFacility('Gym/Fitness');
    await map.selectFacility('Free Wifi');
    
    // Click on hidden inline flex element
    await map.clickHiddenInlineFlex();
    
    // Close the map
    await map.closeMapWithOverlay();
  });

  test('MP-06 Verify that user can click on price Property', async ({ page }) => {
    // Handle newsletter overlay before clicking map
    await map.handleNewsletterBeforeMap();
    
    // Click on "Show on map" button
    await page.getByRole('button', { name: 'Show on map' }).click();
    
    // Click on "Meal Plan" button
    await map.clickMealPlan();
    
    // Click on "Property Type" button
    await map.clickPropertyType();
    
    // Select various property types
    await map.selectPropertyType('Apartment');
    await map.selectPropertyTypeExact('Hotel');
    await map.selectPropertyType('Boat');
    await map.selectPropertyType('Resort');
    await map.selectPropertyType('Boutique hotel');
    await map.selectPropertyType('Camping');
    await map.selectPropertyType('Riad');
    await map.selectPropertyType('Hostel');
    await map.selectPropertyType('Villa');
    await map.selectPropertyType('House');
    await map.selectPropertyType('Apartment');
    await map.selectPropertyType('Camping');
    await map.selectPropertyTypeExact('Hotel');
    
    // Close the map
    await map.closeMapWithOverlay();
  });

  test('MP-07 Verify that user can click on price Meal Plan', async ({ page }) => {
    // Handle newsletter overlay before clicking map
    await map.handleNewsletterBeforeMap();
    
    // Click on "Show on map" button
    await page.getByRole('button', { name: 'Show on map' }).click();
    
    // Click on "Meal Plan" button
    await map.clickMealPlan();
    
    // Select various meal plans
    await map.selectMealPlan('Room Only');
    await map.selectMealPlan('Bed & Breakfast');
    await map.selectMealPlan('Breakfast & Dinner');
    await map.selectMealPlan('Breakfast, Lunch & Dinner');
    await map.selectMealPlan('All Inclusive');
    await map.selectMealPlan('All Inclusive');
    
    // Close the map
    await map.closeMapWithOverlay();
  });

  test('MP-08 Verify that user can click on price Free cancellation', async ({ page }) => {
    // Handle newsletter overlay before clicking map
    await map.handleNewsletterBeforeMap();
    
    // Click on "Show on map" button
    await page.getByRole('button', { name: 'Show on map' }).click();
    
    // Click on Free Cancellation (toggle on)
    await map.clickFreeCancellation();
    
    // Click on Free Cancellation again (toggle off)
    await map.clickFreeCancellation();
    
    // Close the map
    await map.closeMapWithOverlay();
  });

  test('MP-09 Verify that user can add hotel to favourite list', async ({ page }) => {
    // Handle newsletter overlay before clicking map
    await map.handleNewsletterBeforeMap();
    
    // Click on "Show on map" button
    await page.getByRole('button', { name: 'Show on map' }).click();
    
    // Click on favourite wrapper (first click)
    await map.clickFavouriteWrapper();
    
    // Click on favourite wrapper with opacity 60
    await map.clickFavouriteWrapperOpacity60();
    
    // Click on favourite wrapper again
    await map.clickFavouriteWrapper();
    
    // Click on favourite wrapper with opacity 100
    await map.clickFavouriteWrapperOpacity100();
    
    // Close the map
    await map.closeMapWithOverlay();
  });

  // Add your new tests here

});

