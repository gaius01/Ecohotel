<<<<<<< HEAD
# EcoHotel Login Tests

This project contains comprehensive automated tests for the EcoHotel login functionality using Playwright.

## Test Files

### 1. `tests/login.spec.ts`

Direct test implementation using Playwright selectors captured from the actual website.

### 2. `tests/login-with-component.spec.ts`

Test implementation using the `LoginComponent` class for better maintainability and reusability.

### 3. `components/LoginComponent.ts`

Page Object Model component that encapsulates all login page interactions.

## Test Cases

The following test cases are implemented:

- **LG-01**: Verify that a user can login with valid credentials
- **LG-02**: Verify that users can't login with invalid credentials
- **LG-03**: Check if the "Remember me" checkbox retains the user's email for future logins
- **LG-04**: Validate that clicking the "Forgot Password" link redirects to the correct password recovery page
- **LG-05**: Confirm that the "Register here" link directs users to the registration page
- **LG-06**: Test that the "Show" option reveals the password when clicked

## Test Credentials

- **Valid Email**: `maria+3000@ecohotels.com`
- **Valid Password**: `Test@123`

## Running Tests

### Install Dependencies

```bash
npm install
```

### Install Playwright Browsers

```bash
npx playwright install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Headed Mode (with browser visible)

```bash
npm run test:headed
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Tests with UI Mode

```bash
npm run test:ui
```

### Run Specific Login Tests

```bash
# Run direct login tests
npm run test:login

# Run login tests using component
npm run test:login-component
```

## Selectors Used

The tests use the following selectors captured from the actual EcoHotel login page:

- **Email Input**: `page.getByRole('textbox', { name: 'Enter your email address' })`
- **Password Input**: `page.getByRole('textbox', { name: 'Enter your password' })`
- **Login Button**: `page.getByRole('button', { name: 'Log in' })`
- **Remember Me Checkbox**: `page.locator('label').filter({ hasText: 'Remember me' }).locator('div')`
- **Forgot Password Link**: `page.getByRole('link', { name: 'Forgot Password' })`
- **Register Here Link**: `page.getByRole('link', { name: 'Register here' })`

## LoginComponent Methods

The `LoginComponent` class provides the following methods:

- `goto()` - Navigate to login page
- `fillEmail(email)` - Fill email field
- `fillPassword(password)` - Fill password field
- `fillCredentials(email, password)` - Fill both fields
- `login(email, password)` - Complete login process
- `clickLogin()` - Click login button
- `toggleRememberMe()` - Toggle remember me checkbox
- `isRememberMeChecked()` - Check if remember me is selected
- `clickForgotPassword()` - Click forgot password link
- `clickRegisterHere()` - Click register here link
- `togglePasswordVisibility()` - Toggle password visibility
- `isPasswordVisible()` - Check if password is visible
- `clearAllFields()` - Clear all input fields
- `verifyOnLoginPage()` - Verify we're on login page
- `verifySuccessfulLogin()` - Verify successful login
- `verifyLoginFailed()` - Verify login failed

## Configuration

The project uses the default Playwright configuration in `playwright.config.ts` with:

- Multiple browser support (Chrome, Firefox, Safari)
- 120-second timeout
- Desktop viewport settings

## Notes

- Some assertions may need adjustment based on the actual behavior of the website
- Error message selectors may need updates if the website changes
- The "Show password" functionality selector may need adjustment based on the actual implementation
=======
# Ecohotel
>>>>>>> 57c315241715ce649bc4adb4195df7172367e665
