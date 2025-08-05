import { Page, Locator, expect } from '@playwright/test';

export class HotelDetailPage {
  readonly page: Page;
  readonly reserveButton: Locator;
  readonly imagesTab: Locator;
  readonly roomsTab: Locator;
  readonly amenitiesTab: Locator;
  readonly certifiedByTab: Locator;
  readonly needToKnowTab: Locator;
  readonly viewOnMapTab: Locator;
  readonly similarPropertiesTab: Locator;
  readonly similarPropertyLink: Locator;
  readonly mapButton: Locator;
  readonly mapPopup: Locator;
  readonly hotelStoryButton: Locator;
  readonly hotelStoryContainer: Locator;
  readonly readMoreButton: Locator;
  readonly hotelStoryTitle: Locator;
  readonly bestDealText: Locator;
  readonly searchDestinationInput: Locator;
  readonly checkInInput: Locator;
  readonly checkOutInput: Locator;
  readonly travelersInput: Locator;
  readonly searchButton: Locator;
  readonly similarHotelCards: Locator;
  readonly imageGalleryButton: Locator;
  readonly imageGalleryNext: Locator;
  readonly imageGalleryPrev: Locator;
  readonly favouriteButton: Locator;
  readonly showMorePhotosButton: Locator;
  readonly imageThumbnails: Locator;
  readonly imagePreviews: Locator;
  readonly modalOverlay: Locator;
  readonly modalCloseButton: Locator;
  readonly reviewsText: Locator;
  readonly shareHotelButton: Locator;
  readonly greenPrimaryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reserveButton = page.locator('button', { hasText: /^Reserve$/ });
    this.imagesTab = page.getByRole('button', { name: 'Images' });
    this.roomsTab = page.getByRole('button', { name: 'Rooms' });
    this.amenitiesTab = page.getByRole('button', { name: 'Hotel amenities' });
    this.certifiedByTab = page.getByRole('button', { name: 'Certified by' });
    this.needToKnowTab = page.getByRole('button', { name: 'Need to know' });
    this.viewOnMapTab = page.getByRole('button', { name: 'View on map' });
    this.similarPropertiesTab = page.getByRole('button', { name: 'Similar Properties' });
    this.similarPropertyLink = page.getByRole('link', { name: 'Bryggen Guldsmeden - Urban' });
    this.mapButton = page.getByRole('button', { name: /Show on map|View on map/ });
    this.mapPopup = page.locator('.gm-style > div > div:nth-child(2)').first();
    this.hotelStoryButton = page.locator('.w-min');
    this.hotelStoryContainer = page.locator('.hotel-story-container');
    this.readMoreButton = page.getByRole('button', { name: 'Read More' });
    this.hotelStoryTitle = page.locator('div').filter({ hasText: /^Babette Guldsmeden - Hotel Story$/ });
    this.bestDealText = page.getByText('Best Deal: € 201');
    this.searchDestinationInput = page.getByRole('textbox', { name: /Where to\?|Where are you going to\?/ });
    this.checkInInput = page.getByRole('textbox', { name: /Check in|Check-in date/ });
    this.checkOutInput = page.getByRole('textbox', { name: /Check out|Check-out date/ });
    this.travelersInput = page.getByRole('textbox', { name: 'Travelers' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.similarHotelCards = page.locator('.swiper-slide');
    this.imageGalleryButton = page.locator('.bg-\[var\(--color-orangeprimary\)\].text-\[14px\]').first();
    this.imageGalleryNext = page.locator('.swiper-button-next');
    this.imageGalleryPrev = page.locator('.swiper-button-prev');
    this.favouriteButton = page.locator('button[aria-label="Add to favourite"], button[aria-label="Add to favorite"]');
    this.showMorePhotosButton = page.getByRole('button', { name: 'Show more photos' });
    this.imageThumbnails = page.getByRole('img', { name: /Thumbnail/ });
    this.imagePreviews = page.getByRole('img', { name: /Preview/ });
    this.modalOverlay = page.locator('#modal-overlay');
    this.modalCloseButton = this.modalOverlay.getByRole('button');
    this.reviewsText = page.getByText(/\+1Excellent\([0-9,]+ reviews\)/);
    this.shareHotelButton = page.getByRole('button', { name: 'Share Hotel' });
    this.greenPrimaryButton = page.locator('.text-\\[var\\(--color-greenprimary\\)\\].text-xl').first();
  }

  async clickReserve() {
    await this.reserveButton.click();
  }

  async navigateToTab(tab: 'Images' | 'Rooms' | 'Hotel amenities' | 'Certified by' | 'Need to know' | 'View on map' | 'Similar Properties') {
    switch (tab) {
      case 'Images':
        await this.imagesTab.click();
        break;
      case 'Rooms':
        await this.roomsTab.click();
        break;
      case 'Hotel amenities':
        await this.amenitiesTab.click();
        break;
      case 'Certified by':
        await this.certifiedByTab.click();
        break;
      case 'Need to know':
        await this.needToKnowTab.click();
        break;
      case 'View on map':
        await this.viewOnMapTab.click();
        break;
      case 'Similar Properties':
        await this.similarPropertiesTab.click();
        break;
    }
  }

  async selectSimilarProperty() {
    await this.similarPropertyLink.click();
  }

  async clickMapButton() {
    await this.mapButton.click();
  }

  async expectMapVisible() {
    await expect(this.mapPopup).toBeVisible();
  }

  async viewHotelStory() {
    await this.hotelStoryButton.click();
    await expect(this.hotelStoryContainer).toBeVisible();
    await this.readMoreButton.click();
    await expect(this.hotelStoryTitle).toBeVisible();
    await this.hotelStoryTitle.getByRole('button').click();
  }

  async expectBestDealVisible() {
    await expect(this.bestDealText).toBeVisible();
  }

  async fillDestination(destination: string) {
    await this.searchDestinationInput.click();
    await this.searchDestinationInput.fill(destination);
  }

  async selectCheckInOutDates(checkIn: string, checkOut: string) {
    await this.checkInInput.click();
    await this.page.getByRole('button', { name: checkIn }).first().click();
    await this.page.getByRole('button', { name: checkOut }).first().click();
  }

  async openTravelers() {
    await this.travelersInput.click();
  }

  async clickSearch() {
    await this.searchButton.click();
  }

  // Optionally, keep performSearch for convenience, but use the above methods
  async performSearch(destination: string, checkIn: string, checkOut: string) {
    await this.fillDestination(destination);
    await this.selectCheckInOutDates(checkIn, checkOut);
    await this.clickSearch();
  }

  async scrollSimilarHotelCards() {
    await this.similarHotelCards.nth(0).scrollIntoViewIfNeeded();
    await this.similarHotelCards.nth(1).scrollIntoViewIfNeeded();
  }

  async openAndScrollImageGallery() {
    await this.imageGalleryButton.click();
    await this.imageGalleryNext.click();
    await this.imageGalleryNext.click();
    await this.imageGalleryPrev.click();
  }

  async addToFavourite() {
    await this.favouriteButton.click();
  }

  // New methods for complete flow
  async verifyBestDeal() {
    await expect(this.bestDealText).toBeVisible();
    await expect(this.page.getByRole('main')).toContainText('Best Deal:');
  }

  async clickLocation() {
    await this.page.getByText('Copenhagen, Denmark, Bredgade').click();
  }

  async clickReserveButton() {
    await this.reserveButton.click();
  }

  async openImageGallery() {
    await this.showMorePhotosButton.click();
  }

  async navigateImageGallery() {
    // Click various thumbnails and previews
    await this.page.getByRole('img', { name: 'Thumbnail 24' }).click();
    await this.page.getByRole('img', { name: 'Thumbnail 2', exact: true }).click();
    await this.page.getByRole('img', { name: 'Preview 2', exact: true }).click();
    await this.page.getByRole('img', { name: 'Thumbnail 25' }).click();
    await this.page.getByRole('img', { name: 'Preview 25' }).click();
    await this.page.getByRole('img', { name: 'Thumbnail 1', exact: true }).click();
    await this.page.getByRole('img', { name: 'Preview 1', exact: true }).click();
  }

  async navigateModalOverlay() {
    // Navigate modal overlay controls
    await this.modalOverlay.locator('svg').nth(2).click();
    await this.modalOverlay.locator('svg').nth(2).click();
    await this.modalOverlay.locator('svg').nth(1).click();
    await this.modalOverlay.locator('svg').nth(1).click();
    await this.modalCloseButton.click();
  }

  async clickShowOnMap() {
    await this.mapButton.click();
  }

  async clickReviews() {
    await this.reviewsText.click();
  }

  async openHotelStory() {
    await this.readMoreButton.click();
    await expect(this.hotelStoryTitle).toBeVisible();
    await this.hotelStoryTitle.getByRole('button').click();
  }

  async navigateSimilarProperties() {
    await this.imageGalleryNext.click();
    await this.imageGalleryNext.click();
    await this.imageGalleryPrev.click();
    await this.imageGalleryPrev.click();
    await this.imageGalleryPrev.click();
    await this.similarPropertyLink.click();
  }

  async navigateAllTabs() {
    await this.imagesTab.click();
    await this.roomsTab.click();
    await this.amenitiesTab.click();
    await this.certifiedByTab.click();
    await this.needToKnowTab.click();
    await this.viewOnMapTab.click();
    await this.similarPropertiesTab.click();
  }

  async clickGreenPrimaryButton() {
    await this.greenPrimaryButton.click();
    await this.greenPrimaryButton.click();
  }

  async shareHotel() {
    this.page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await this.shareHotelButton.click();
  }
}
