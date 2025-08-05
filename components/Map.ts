import { Page, expect, Locator } from '@playwright/test';

export class MapComponent {
  constructor(public page: Page) {}

  async runHomePageSearch() {
    await this.page.goto('https://ecohotels.com/');
    await this.page.getByRole('button', { name: 'Accept' }).click();
    await expect(this.page.getByRole('textbox', { name: 'Where are you going to?' })).toBeVisible();
    await this.page.getByRole('textbox', { name: 'Where are you going to?' }).click();
    await this.page.getByRole('textbox', { name: 'Where are you going to?' }).fill('Babette Guldsmeden');
    await this.page.getByRole('heading', { name: 'Babette Guldsmeden' }).click();
    
    // Dynamic date selection - today and tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayDay = today.getDate().toString();
    const tomorrowDay = tomorrow.getDate().toString();
    
    await this.page.getByRole('button', { name: todayDay }).first().click();
    await this.page.getByRole('button', { name: tomorrowDay }).first().click();
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.locator('.text-gray-400').click();
    await expect(this.page.getByRole('heading', { name: /Hotels in/i })).toBeVisible();
  }

  async openMap() {
    await this.page.getByRole('button', { name: 'Show on map' }).click();
    await expect(this.page.locator('.close-map > svg')).toBeVisible();
  }

  async closeMap() {
    await this.page.locator('.close-map > svg').click();
    await expect(this.page.getByRole('button', { name: 'Show on map' })).toBeVisible();
  }

  async openAndCloseMap() {
    await this.openMap();
    await this.closeMap();
  }

  async zoomInMap() {
    await this.page.locator('.map-zoom-in').click();
  }

  async zoomOutMap() {
    await this.page.locator('.map-zoom-out').click();
  }

  async clickOnMapMarker() {
    await this.page.locator('.map-marker').first().click();
  }

  async verifyMapMarkerInfo() {
    await expect(this.page.locator('.marker-info')).toBeVisible();
  }

  async dragMap() {
    await this.page.locator('.map-container').hover();
    await this.page.mouse.down();
    await this.page.mouse.move(100, 100);
    await this.page.mouse.up();
  }

  async filterHotelsOnMap() {
    await this.page.getByText('Filter on map').click();
  }

  async toggleMapLayers() {
    await this.page.getByText('Map layers').click();
  }

  async searchLocationOnMap(location: string) {
    await this.page.getByRole('textbox', { name: 'Search on map' }).click();
    await this.page.getByRole('textbox', { name: 'Search on map' }).fill(location);
    await this.page.keyboard.press('Enter');
  }

  async getMapBounds() {
    return await this.page.evaluate(() => {
      // This would need to be adapted based on the actual map implementation
      return { lat: 0, lng: 0, zoom: 10 };
    });
  }

  async verifyMapIsLoaded() {
    await expect(this.page.locator('.map-container')).toBeVisible();
  }

  async countMapMarkers() {
    return await this.page.locator('.map-marker').count();
  }

  async clickOnHotelMarker(hotelName: string) {
    await this.page.locator(`[data-hotel="${hotelName}"]`).click();
  }

  async verifyHotelDetailsOnMap() {
    await expect(this.page.locator('.hotel-details-panel')).toBeVisible();
  }

  async toggleMapView(view: 'satellite' | 'street' | 'hybrid') {
    await this.page.getByText(`Switch to ${view} view`).click();
  }

  async getCurrentMapCenter() {
    return await this.page.evaluate(() => {
      // This would need to be adapted based on the actual map implementation
      return { lat: 0, lng: 0 };
    });
  }

  async setMapCenter(lat: number, lng: number) {
    await this.page.evaluate(({ lat, lng }) => {
      // This would need to be adapted based on the actual map implementation
      console.log(`Setting map center to ${lat}, ${lng}`);
    }, { lat, lng });
  }

  async clickYourBudget() {
    await this.page.getByRole('button', { name: 'Your Budget' }).click();
  }

  async clickPriceSort() {
    await this.page.getByRole('button', { name: 'Price Sort' }).click();
  }

  async selectPriceLowestFirst() {
    await this.page.getByText('Price (Lowest first)').first().click();
  }

  async selectPriceHighestFirst() {
    await this.page.getByText('Price (Highest first)').first().click();
  }

  async handleSignInOverlay() {
    try {
      await expect(this.page.locator('div').filter({ hasText: 'Sign in or create account to' }).nth(2)).toBeVisible();
      await this.page.locator('.text-gray-400').click();
    } catch (error) {
      console.log('Sign-in overlay not present, continuing with test');
    }
  }

  async clickStarRating() {
    await this.page.getByRole('button', { name: 'Star Rating' }).click();
  }

  async selectStarRating(stars: number) {
    await this.page.locator('div').filter({ hasText: new RegExp(`^${stars} star${stars > 1 ? 's' : ''}$`) }).click();
  }

  async forceCloseNewsletter() {
    try {
      await expect(this.page.locator('div').filter({ hasText: 'Sign in or create account to' }).nth(2)).toBeVisible();
      await this.page.locator('.text-gray-400').click();
    } catch (error) {
      console.log('Newsletter overlay not present, continuing with test');
    }
  }

  async waitForShowMapButton() {
    await this.page.waitForSelector('button:has-text("Show on map")', { timeout: 15000 });
  }

  async openMapWithTimeout() {
    // Wait for the button to be enabled
    await this.page.waitForSelector('button:has-text("Show on map"):not([disabled])', { timeout: 15000 });
    
    // Check if there's a modal overlay and close it if present
    try {
      const modalOverlay = this.page.locator('.fixed.inset-0.flex.items-center.justify-center.bg-black.bg-opacity-50');
      if (await modalOverlay.isVisible()) {
        // Try to find and click a close button in the modal
        await this.page.locator('button:has-text("×"), button:has-text("Close"), .close-button').first().click();
        await this.page.waitForTimeout(1000); // Wait for modal to close
      }
    } catch (error) {
      console.log('No modal overlay found or could not close it');
    }
    
    // Now click the Show on map button
    await this.page.getByRole('button', { name: 'Show on map' }).click({ timeout: 10000 });
  }

  async getPriceText(priceType: 'Min €' | 'Max €') {
    return await this.page.getByText(priceType).textContent();
  }

  async interactWithMinSlider() {
    const minSlider = this.page.locator('form').filter({ hasText: 'Price Sort Sort by: Price (' }).getByRole('slider').nth(2);
    await minSlider.click();
    await minSlider.focus();
    
    // Move min slider to the right multiple times to increase the price
    for (let i = 0; i < 10; i++) {
      await this.page.keyboard.press('ArrowRight');
      await this.page.waitForTimeout(50);
    }
  }

  async interactWithMaxSlider() {
    const maxSlider = this.page.locator('form').filter({ hasText: 'Price Sort Sort by: Price (' }).getByRole('slider').nth(3);
    await maxSlider.click();
    await maxSlider.focus();
    
    // Move max slider to the left multiple times to decrease the price
    for (let i = 0; i < 10; i++) {
      await this.page.keyboard.press('ArrowLeft');
      await this.page.waitForTimeout(50);
    }
  }

  async scrollToCenterBudgetFilter() {
    await this.page.mouse.wheel(0, 800);
    await this.page.waitForTimeout(500);
  }

  async scrollFineTune() {
    await this.page.mouse.wheel(0, 300);
    await this.page.waitForTimeout(300);
  }

  async clickPriceDisplays() {
    await this.page.getByText('Min €').click();
    await this.page.getByText('Max €').click();
  }

  async closeMapWithOverlay() {
    await this.page.locator('.close-map').click();
  }

  async clickFacilities() {
    await this.page.getByRole('button', { name: 'Facilities' }).click();
  }

  async selectFacility(facilityName: string) {
    await this.page.locator('div').filter({ hasText: new RegExp(`^${facilityName}$`) }).click();
  }

  async clickFacilityCombination() {
    await this.page.getByText('Car parkSpaAir').click();
  }

  async clickHiddenInlineFlex() {
    await this.page.locator('.hidden.lg\\:inline-flex.cursor-pointer').click();
  }

  async handleNewsletterBeforeMap() {
    try {
      await expect(this.page.locator('div').filter({ hasText: 'Sign in or create account to' }).nth(2)).toBeVisible();
      await this.page.locator('.text-gray-400').click();
    } catch (error) {
      console.log('Newsletter overlay not present, continuing with test');
    }
  }

  async clickMealPlan() {
    await this.page.getByRole('button', { name: 'Meal Plan' }).click();
  }

  async clickPropertyType() {
    await this.page.getByRole('button', { name: 'Property Type' }).click();
  }

  async selectPropertyType(propertyType: string) {
    await this.page.getByText(propertyType, { exact: true }).first().click();
  }

  async selectPropertyTypeExact(propertyType: string) {
    await this.page.getByText(propertyType, { exact: true }).first().click();
  }

  async selectMealPlan(mealPlan: string) {
    await this.page.getByText(mealPlan).first().click();
  }

  async clickFreeCancellation() {
    await this.page.locator('label').filter({ hasText: 'Free Cancellation' }).first().click();
  }

  async clickFavouriteWrapper() {
    await this.page.locator('.fav-wrapper').first().click();
  }

  async clickFavouriteWrapperOpacity60() {
    await this.page.locator('.fav-wrapper.flex.items-center.justify-center.max-w-\\[30px\\].max-h-\\[30px\\].rounded-full.bg-white.cursor-pointer.opacity-60').first().click();
  }

  async clickFavouriteWrapperOpacity100() {
    await this.page.locator('.fav-wrapper.flex.items-center.justify-center.max-w-\\[30px\\].max-h-\\[30px\\].rounded-full.bg-white.cursor-pointer.opacity-100').first().click();
  }
}
