import { Page, expect } from '@playwright/test';

export class ConfirmationComponent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to confirmation page
  async navigateToConfirmation(tempID: string = '1325981') {
    await this.page.goto(`https://ecohotels.com/checkout-confirm/?tempID=${tempID}`);
  }

  // Verify cancellation modal
  async verifyCancellationModal() {
    await this.page.locator('#modal-content').waitFor({ state: 'visible' });
    return await this.page.locator('#modal-content').textContent();
  }

  // Close modal
  async closeModal() {
    await this.page.locator('.flex.justify-end > svg > path:nth-child(2)').click();
  }

  // Close any popup that appears (general popup handler)
  async closeAnyPopup() {
    try {
      // Wait a moment for any animations to complete
      await this.page.waitForTimeout(500);
      
      // Try to close the "Enjoyed your booking?" review popup FIRST (most important)
      await this.cancelEnjoyedBookingPopup();
      
      // Try to close modal if it exists
      const modalCloseButton = this.page.locator('.flex.justify-end > svg > path:nth-child(2)');
      if (await modalCloseButton.isVisible()) {
        await modalCloseButton.click({ force: true });
        await this.page.waitForTimeout(300);
      }
      
      // Try to close any other popup overlays
      const popupCloseButton = this.page.locator('[data-testid="close-popup"], .popup-close, .modal-close, .overlay-close');
      if (await popupCloseButton.isVisible()) {
        await popupCloseButton.click({ force: true });
        await this.page.waitForTimeout(300);
      }
      
      // Try to close review popup specifically
      const reviewCloseButton = this.page.locator('[data-testid="close-review"], .review-close');
      if (await reviewCloseButton.isVisible()) {
        await reviewCloseButton.click({ force: true });
        await this.page.waitForTimeout(300);
      }

      // Try to close Accept button popup
      const acceptButton = this.page.getByRole('button', { name: 'Accept' });
      if (await acceptButton.isVisible()) {
        await acceptButton.click({ force: true });
        await this.page.waitForTimeout(300);
      }

      // Try to close review popup using the specific X button in the review card
      const reviewCancelButton = this.page.locator('.bg-white.rounded-lg.shadow-lg svg.text-\\[var\\(--color-greenprimary\\)\\]').first();
      if (await reviewCancelButton.isVisible()) {
        await reviewCancelButton.click({ force: true });
        await this.page.waitForTimeout(300);
      }

      // Alternative: Try to close review using the flex justify-end container
      const reviewCancelContainer = this.page.locator('.flex.justify-end svg.text-\\[var\\(--color-greenprimary\\)\\]').first();
      if (await reviewCancelContainer.isVisible()) {
        await reviewCancelContainer.click({ force: true });
        await this.page.waitForTimeout(300);
      }

      // Final attempt: Try to close any remaining popups
      await this.cancelEnjoyedBookingPopup();
      
    } catch (error) {
      // If any popup close fails, continue with the test
      console.log('No popup to close or popup already closed');
    }
  }

  // Verify main content
  async verifyMainContent() {
    await this.page.getByRole('main').waitFor({ state: 'visible' });
    return await this.page.getByRole('main').textContent();
  }

  // Click on green primary element
  async clickGreenPrimary() {
    await this.page.locator('.text-\\[var\\(--color-greenprimary\\)\\] > path:nth-child(2)').click();
  }

  // Click view trip details button
  async clickViewTripDetails() {
    await this.page.getByRole('button', { name: 'View trip details' }).click();
  }

  // Click download button
  async clickDownloadButton() {
    await this.page.getByRole('button', { name: 'Download' }).click();
  }

  // Click first image in modal content
  async clickFirstImageInModal() {
    await this.page.locator('#modal-content').getByRole('img').first().click();
  }

  // Click first green primary element
  async clickFirstGreenPrimary() {
    await this.page.locator('.text-\\[var\\(--color-greenprimary\\)\\]').first().click();
  }

  // Cancel review popup using the specific X button in the review card
  async cancelReviewPopup() {
    try {
      // Try the specific X button in the review card
      const reviewCancelButton = this.page.locator('.bg-white.rounded-lg.shadow-lg svg.text-\\[var\\(--color-greenprimary\\)\\]').first();
      if (await reviewCancelButton.isVisible()) {
        await reviewCancelButton.click();
        return;
      }

      // Alternative: Try the flex justify-end container
      const reviewCancelContainer = this.page.locator('.flex.justify-end svg.text-\\[var\\(--color-greenprimary\\)\\]').first();
      if (await reviewCancelContainer.isVisible()) {
        await reviewCancelContainer.click();
        return;
      }

      // Fallback: Try any SVG with the green primary color
      const fallbackButton = this.page.locator('svg.text-\\[var\\(--color-greenprimary\\)\\]').first();
      if (await fallbackButton.isVisible()) {
        await fallbackButton.click();
      }
    } catch (error) {
      console.log('Review popup cancel button not found or already closed');
    }
  }

  // Cancel the "Enjoyed your booking?" review popup specifically
  async cancelEnjoyedBookingPopup() {
    try {
      // Wait a moment for any animations to complete
      await this.page.waitForTimeout(1000);
      
      // Multiple strategies to find and click the cancel button
      
      // Strategy 1: Look for the review popup that contains "Enjoyed your booking?"
      const reviewPopup = this.page.locator('div:has-text("Enjoyed your booking?")');
      if (await reviewPopup.isVisible()) {
        // Find the X button within this popup - try multiple selectors
        const cancelButton1 = reviewPopup.locator('.flex.justify-end svg').first();
        if (await cancelButton1.isVisible()) {
          await cancelButton1.click({ force: true });
          await this.page.waitForTimeout(500);
          return;
        }
        
        // Try clicking the SVG directly
        const cancelButton2 = reviewPopup.locator('svg.text-\\[var\\(--color-greenprimary\\)\\]').first();
        if (await cancelButton2.isVisible()) {
          await cancelButton2.click({ force: true });
          await this.page.waitForTimeout(500);
          return;
        }
      }
      
      // Strategy 2: Direct approach - find any SVG with the specific classes
      const directCancelButton = this.page.locator('svg.text-\\[var\\(--color-greenprimary\\)\\].cursor-pointer').first();
      if (await directCancelButton.isVisible()) {
        await directCancelButton.click({ force: true });
        await this.page.waitForTimeout(500);
        return;
      }
      
      // Strategy 3: Find by the specific path content (the X icon)
      const xIconButton = this.page.locator('svg:has(path[d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"])').first();
      if (await xIconButton.isVisible()) {
        await xIconButton.click({ force: true });
        await this.page.waitForTimeout(500);
        return;
      }
      
      // Strategy 4: Try clicking on the flex justify-end container
      const flexContainer = this.page.locator('.flex.justify-end').first();
      if (await flexContainer.isVisible()) {
        await flexContainer.click({ force: true });
        await this.page.waitForTimeout(500);
        return;
      }
      
    } catch (error) {
      console.log('Enjoyed your booking popup not found or already closed');
    }
  }

  // Click accept button
  async clickAcceptButton() {
    await this.page.getByRole('button', { name: 'Accept' }).click();
  }

  // Verify eco hotels home page content
  async verifyEcoHotelsHomePage() {
    await this.page.locator('#root').waitFor({ state: 'visible' });
    return await this.page.locator('#root').textContent();
  }

  // Click leave review link
  async clickLeaveReview() {
    const pagePromise = this.page.waitForEvent('popup');
    await this.page.getByRole('link', { name: 'Leave Review' }).click();
    return await pagePromise;
  }

  // Verify hotel image
  async verifyHotelImage() {
    await this.page.getByRole('img', { name: 'Axel Guldsmeden' }).waitFor({ state: 'visible' });
    return await this.page.getByRole('img', { name: 'Axel Guldsmeden' }).isVisible();
  }

  // Verify room details
  async verifyRoomDetails() {
    await this.page.getByText('Room 1 Room Single Room').waitFor({ state: 'visible' });
    return await this.page.getByText('Room 1 Room Single Room').isVisible();
  }

  // Click room heading
  async clickRoomHeading() {
    await this.page.getByRole('heading', { name: 'Room 1' }).click();
  }

  // Verify checkout confirm content
  async verifyCheckoutConfirmContent() {
    await this.page.locator('#checkout-confirm').waitFor({ state: 'visible' });
    return await this.page.locator('#checkout-confirm').textContent();
  }

  // Click social media links
  async clickSocialMediaLinks() {
    const links: Page[] = [];
    
    // First social media link
    const page1Promise = this.page.waitForEvent('popup');
    await this.page.locator('#checkout-confirm').getByRole('link').first().click();
    links.push(await page1Promise);
    
    // Second social media link
    const page2Promise = this.page.waitForEvent('popup');
    await this.page.locator('#checkout-confirm').getByRole('link').nth(1).click();
    links.push(await page2Promise);
    
    // Third social media link
    const page3Promise = this.page.waitForEvent('popup');
    await this.page.locator('#checkout-confirm').getByRole('link').nth(2).click();
    links.push(await page3Promise);
    
    return links;
  }

  // Fill email for sharing plans
  async fillEmailForSharing(email: string = 'gaiusisaac9@gmail.com') {
    await this.page.getByRole('textbox', { name: 'Add email address' }).click();
    await this.page.getByRole('textbox', { name: 'Add email address' }).fill(email);
  }

  // Click share plans button
  async clickSharePlans() {
    await this.page.getByRole('button', { name: 'Share Plans' }).click();
  }

  // Verify plans shared successfully
  async verifyPlansSharedSuccessfully() {
    await this.page.getByText('Plans shared successfully!').waitFor({ state: 'visible' });
    return await this.page.getByText('Plans shared successfully!').isVisible();
  }

  // Click eco hotels logo to go home
  async clickEcoHotelsLogo() {
    await this.page.getByRole('link', { name: 'Eco Hotels' }).click();
  }

  // Download document (placeholder for payment page functionality)
  async downloadDocument() {
    // This would be implemented based on the actual payment page structure
    // For now, we'll assume there's a download button or link
    const downloadButton = this.page.getByRole('button', { name: 'Download' });
    if (await downloadButton.isVisible()) {
      await downloadButton.click();
    }
  }

  // Cancel hotel overlay
  async cancelHotelOverlay() {
    const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
    }
  }

  // Cancel review button
  async cancelReview() {
    const cancelReviewButton = this.page.getByRole('button', { name: 'Cancel Review' });
    if (await cancelReviewButton.isVisible()) {
      await cancelReviewButton.click();
    }
  }

  // Navigate to cancellation page
  async navigateToCancellationPage() {
    const cancellationLink = this.page.getByRole('link', { name: 'Cancel Booking' });
    if (await cancellationLink.isVisible()) {
      await cancellationLink.click();
    }
  }

  // Force close any review popup that might be interfering
  async forceCloseReviewPopup() {
    try {
      // Wait for any animations
      await this.page.waitForTimeout(1000);
      
      // Try multiple aggressive strategies
      
      // Strategy 1: Click any SVG with the X icon path
      const xButtons = this.page.locator('svg:has(path[d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"])');
      const count = await xButtons.count();
      for (let i = 0; i < count; i++) {
        const button = xButtons.nth(i);
        if (await button.isVisible()) {
          await button.click({ force: true, timeout: 5000 });
          await this.page.waitForTimeout(500);
        }
      }
      
      // Strategy 2: Click any element with the green primary color that's clickable
      const greenButtons = this.page.locator('.text-\\[var\\(--color-greenprimary\\)\\].cursor-pointer');
      const greenCount = await greenButtons.count();
      for (let i = 0; i < greenCount; i++) {
        const button = greenButtons.nth(i);
        if (await button.isVisible()) {
          await button.click({ force: true, timeout: 5000 });
          await this.page.waitForTimeout(500);
        }
      }
      
      // Strategy 3: Try pressing Escape key
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
      
      // Strategy 4: Click outside the popup (if it's a modal)
      await this.page.mouse.click(10, 10);
      await this.page.waitForTimeout(500);
      
    } catch (error) {
      console.log('Force close review popup completed');
    }
  }

  // Click first image in modal content (for CP-08)
  async clickFirstImageInModalContent() {
    await this.page.locator('#modal-content').getByRole('img').first().click();
  }

  // Click leave review and navigate to Trustpilot (for CP-08)
  async clickLeaveReviewAndNavigateToTrustpilot() {
    const page1Promise = this.page.waitForEvent('popup');
    await this.page.getByRole('link', { name: 'Leave Review' }).click();
    const page1 = await page1Promise;
    await page1.goto('https://www.trustpilot.com/evaluate/ecohotels.com');
    return page1;
  }

  // Verify Trustpilot page content (for CP-08)
  async verifyTrustpilotPage(page1: any) {
    await expect(page1.locator('h1')).toContainText('EcoHotels.com');
  }
}
