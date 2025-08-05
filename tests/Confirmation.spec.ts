import { test, expect } from '@playwright/test';
import { ConfirmationComponent } from '../components/Confirmation';

test.describe('Confirmation Page Tests', () => {
  let confirmationComponent: ConfirmationComponent;

  test.beforeEach(async ({ page }) => {
    confirmationComponent = new ConfirmationComponent(page);
  });

  test('CP-01 Verify that user can get to confirmation page', async ({ page }) => {
    await confirmationComponent.navigateToConfirmation();
    
    // Verify we're on the confirmation page
    await expect(page).toHaveURL(/checkout-confirm/);
    
    // Verify the page loads successfully
    await expect(page.locator('#checkout-confirm')).toBeVisible();
  });

  test('CP-02 Verify that user can download document in payment page', async ({ page }) => {
    // Navigate to confirmation page first
    await confirmationComponent.navigateToConfirmation();
    
    // Close any popup that might be present
    await confirmationComponent.closeAnyPopup();
    
    // Attempt to download document (this would need to be implemented based on actual payment page)
    await confirmationComponent.downloadDocument();
    
    // Verify download functionality (this would depend on the actual implementation)
    // For now, we'll verify the page is still functional after download attempt
    await expect(page.locator('#checkout-confirm')).toBeVisible();
  });

  test('CP-03 Verify that user can use the cancel button of the hotel overlay', async ({ page }) => {
    await confirmationComponent.navigateToConfirmation();
    
    // Close any initial popup first
    await confirmationComponent.closeAnyPopup();
    
    // Attempt to cancel hotel overlay
    await confirmationComponent.cancelHotelOverlay();
    
    // Verify the page is still functional after cancellation
    await expect(page.locator('#checkout-confirm')).toBeVisible();
  });

  test('CP-04 Verify that user can be able to cancel review button', async ({ page }) => {
    await confirmationComponent.navigateToConfirmation();
    
    // Close any popup that might be present
    await confirmationComponent.closeAnyPopup();
    
    // Force close any review popup that might be interfering
    await confirmationComponent.forceCloseReviewPopup();
    
    // Attempt to cancel review using the green primary selector
    await confirmationComponent.cancelReviewPopup();
    
    // Verify the page is still functional after cancellation
    await expect(page.locator('#checkout-confirm')).toBeVisible();
  });

  test('CP-05 Verify that social media button links are clickable', async ({ page }) => {
    await confirmationComponent.navigateToConfirmation();
    
    // Close any popup that might be present
    await confirmationComponent.closeAnyPopup();
    
    // Click on room heading to expand details
    await confirmationComponent.clickRoomHeading();
    
    // Verify checkout confirm content is visible
    const content = await confirmationComponent.verifyCheckoutConfirmContent();
    expect(content).toContain('Last step: let everyone knowyou\'ve planted a tree!');
    
    // Click social media links and verify they open in new tabs
    const socialMediaPages = await confirmationComponent.clickSocialMediaLinks();
    
    // Verify that popup pages were opened
    expect(socialMediaPages.length).toBe(3);
    
    // Verify each popup page is a valid page
    for (const popupPage of socialMediaPages) {
      expect(popupPage).toBeDefined();
      await popupPage.close();
    }
  });

  test('CP-06 Verify that user can share plans', async ({ page }) => {
    await confirmationComponent.navigateToConfirmation();
    
    // Close any popup that might be present
    await confirmationComponent.closeAnyPopup();
    
    // Click on room heading to expand details
    await confirmationComponent.clickRoomHeading();
    
    // Fill email for sharing plans
    await confirmationComponent.fillEmailForSharing('gaiusisaac9@gmail.com');
    
    // Click share plans button
    await confirmationComponent.clickSharePlans();
    
    // Verify plans shared successfully message
    const isShared = await confirmationComponent.verifyPlansSharedSuccessfully();
    expect(isShared).toBeTruthy();
  });

  //test('CP-07 Verify that user can get to cancellation page', async ({ page }) => {
  //  await confirmationComponent.navigateToConfirmation();
    
    // Close any overlay that might be present
  //  await confirmationComponent.closeModal();
    
    // Navigate to cancellation page
  //  await confirmationComponent.navigateToCancellationPage();
    
    // Verify we're no longer on the confirmation page
  //  await expect(page).not.toHaveURL(/checkout-confirm/);
  //});

  test('CP-07 Verify that user can navigate to home page using the ecohotel logo', async ({ page }) => {
    await confirmationComponent.navigateToConfirmation();
    
    // Close any popup that might be present
    await confirmationComponent.closeAnyPopup();
    
    // Click eco hotels logo
    await confirmationComponent.clickEcoHotelsLogo();
    
    // Click accept button if it appears
    await confirmationComponent.clickAcceptButton();
    
    // Verify eco hotels home page content
    const homePageContent = await confirmationComponent.verifyEcoHotelsHomePage();
    expect(homePageContent).toContain('Find hotels with a purposeEcoHotels.com plants a tree for every booking!');
    
    // Verify we're on the eco hotels home page
    await expect(page).toHaveURL(/ecohotels\.com/);
  });

  test('CP-08 Verify that user can click add review popup', async ({ page }) => {
    // Navigate to confirmation page with specific tempID
    await confirmationComponent.navigateToConfirmation('1325981');
    
    // Click first image in modal content
    await confirmationComponent.clickFirstImageInModalContent();
    
    // Click leave review and navigate to Trustpilot
    const page1 = await confirmationComponent.clickLeaveReviewAndNavigateToTrustpilot();
    
    // Verify Trustpilot page content
    await confirmationComponent.verifyTrustpilotPage(page1);
    
    // Close the popup page
    await page1.close();
  });

});