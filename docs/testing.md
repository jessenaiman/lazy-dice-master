# E2E Testing Setup and Guidelines

## Overview

This project uses Playwright for end-to-end (E2E) testing of key user flows in the Next.js application. Playwright is configured to run tests in a headless browser environment, simulating real user interactions across critical paths such as navigation, form submissions, dynamic content generation, and error handling.

Tests are located in the `e2e/` directory and use data-testid selectors where possible to ensure resilience against UI changes. The framework supports mocking external services (e.g., Firebase, AI endpoints) to make tests independent of live data.

## Installation

The following devDependencies are required for E2E testing:

- `@playwright/test`
- `playwright`
- `jest` (for unit integration if needed)
- `jest-environment-jsdom`
- `csv-parse` (for loading CSV test data)

Install them with:
```
pnpm add -D @playwright/test playwright jest jest-environment-jsdom csv-parse
```

After installation, run:
```
npx playwright install
```

This downloads the required browsers (Chromium, Firefox, WebKit).

## Configuration

- **Playwright Config:** `playwright.config.ts` is configured for the app running on `http://localhost:9002` (the project's dev port).
  - Tests are in `./e2e`.
  - Reporters: HTML report generated.
  - Projects: Tests run on Chromium, Firefox, WebKit, and Mobile Chrome.
  - WebServer: Automatically starts `pnpm run dev` before tests and shuts it down after.

- **Jest Config:** `jest.config.js` is set up for unit tests if needed, but E2E uses Playwright's test runner.

- **Test Data:** Structured datasets are stored in `e2e/test-data/`:
  - `test-users.json`: Sample users for authentication and role-based tests.
  - `form-inputs.csv`: Valid and edge case inputs for form validation.
  - `campaign-data.json`: Sample campaign data for testing flows.

## Running Tests

1. **Run E2E Tests:**
   ```
   pnpm run test:e2e
   ```
   - Runs all tests in `e2e/`.
   - Starts the dev server automatically.
   - Generates an HTML report in `playwright-report/`.
   - View report: `pnpm exec playwright show-report`.

2. **Run Specific Test:**
   ```
   npx playwright test e2e/navigation.spec.ts
   ```

3. **Run with UI Mode (for debugging):**
   ```
   pnpm run test:ui
   ```
   - Opens the Playwright UI for interactive test debugging.

4. **Run Headless (CI):**
   Tests run headless by default in CI environments.

## Test Structure

Tests are organized into separate `.spec.ts` files:

- `navigation.spec.ts`: Basic navigation and URL checks.
- `form-submission.spec.ts`: Form creation, validation, and submission (campaigns, prep notes).
- `user-flow.spec.ts`: End-to-end flows like load campaign, generate content, modals/toasts.
- `dynamic-content.spec.ts`: Mocked AI flows and interactive elements.
- `error-handling.spec.ts`: Invalid inputs, network mocks, error states.

All tests use fixtures from `e2e/test-data/` for independence.

## Best Practices

- **Selectors:** Use `data-testid` attributes in components for stable selectors (e.g., `<button data-testid="submit-btn">`).
- **Mocks:** External services (Firebase, AI APIs) are mocked in tests to avoid live data dependencies.
- **Coverage:** Aim for 80% coverage on critical paths. Generate report with `npx playwright show-report`.
- **Resilience:** Tests are written to be independent; no shared state between tests.
- **Screenshots/Videos:** Enabled on failure for debugging.

## CI/CD Integration

E2E tests are integrated into GitHub Actions via `.github/workflows/e2e.yml`:
- Runs on push/PR to main.
- Installs dependencies and browsers.
- Uploads reports as artifacts.

## Troubleshooting

- **Dev Server Not Starting:** Ensure no port conflicts on 9002. Check console for errors.
- **Selector Failures:** Update data-testid in components to match test expectations.
- **Timeouts:** Increase timeouts in `playwright.config.ts` if needed for slower environments.

For more details, see Playwright docs: https://playwright.dev/docs/intro