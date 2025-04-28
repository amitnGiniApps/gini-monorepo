import { Page } from 'puppeteer';

/**
 * Scrape LocalStorage data from page
 */
export const scrapeLocalStorage = async (page: Page) => {
  const localStorageData = await page.evaluate(() => {
    return Object.keys(window.localStorage).map(key => ({
      key,
      value: window.localStorage.getItem(key),
    }));
  });
  return localStorageData;
};

/**
 * Scrape Cookies data from page
 */
export const scrapeCookies = async (page: Page) => {
  const cookies = await page.cookies();
  return cookies;
};

/**
 * Analyze LocalStorage for sensitive information
 */
export const analyzeLocalStorage = (localStorageData: { key: string, value: string | null }[]) => {
  const findings = [];

  for (const item of localStorageData) {
    const lowerKey = item.key.toLowerCase();
    if (lowerKey.includes('token') || lowerKey.includes('password') || lowerKey.includes('auth')) {
      findings.push({
        title: `Sensitive Key in LocalStorage: ${item.key}`,
        issue: `Found suspicious key in localStorage: ${item.key}`,
        fix: 'Avoid storing sensitive information like tokens or passwords in localStorage.',
        severity: 'Critical',
      });
    }
  }

  return findings;
};

/**
 * Analyze Cookies for security vulnerabilities
 */
export const analyzeCookies = (cookies: { name: string, secure: boolean, httpOnly: boolean }[]) => {
  const findings = [];

  for (const cookie of cookies) {
    if (!cookie.secure || !cookie.httpOnly) {
      findings.push({
        title: `Insecure Cookie: ${cookie.name}`,
        issue: `Cookie "${cookie.name}" is missing Secure and/or HttpOnly flags.`,
        fix: 'Ensure cookies are set with both Secure and HttpOnly flags.',
        severity: 'Major',
      });
    }
  }

  return findings;
};

/**
 * Run all security checks together (localStorage + cookies)
 */
export const runSecurityChecks = async (page: Page) => {
  const localStorageData = await scrapeLocalStorage(page);
  const cookies = await scrapeCookies(page);

  const localStorageFindings = analyzeLocalStorage(localStorageData);
  const cookieFindings = analyzeCookies(cookies);

  return [...localStorageFindings, ...cookieFindings];
};
