/**
 * Check if an issue belongs to UX category
 */
export function isUXIssue(issue: any) {
  return (
    issue.title.toLowerCase().includes('input') ||
        issue.title.toLowerCase().includes('form') ||
        issue.title.toLowerCase().includes('button') ||
        issue.title.toLowerCase().includes('validation')
  );
}

/**
 * Check if an issue belongs to Accessibility category
 */
export function isAccessibilityIssue(issue: any) {
  return (
    issue.title.toLowerCase().includes('alt') ||
        issue.title.toLowerCase().includes('label') ||
        issue.title.toLowerCase().includes('contrast') ||
        issue.title.toLowerCase().includes('keyboard')
  );
}

/**
 * Check if an issue belongs to Console category
 */
export function isConsoleIssue(issue: any) {
  return (
    issue.title.toLowerCase().includes('console') ||
        issue.issue.toLowerCase().includes('console')
  );
}

/**
 * Check if an issue belongs to Security category
 */
export function isSecurityIssue(issue: any) {
  return (
    issue.title.toLowerCase().includes('cookie') ||
        issue.title.toLowerCase().includes('localstorage') ||
        issue.issue.toLowerCase().includes('csrf') ||
        issue.issue.toLowerCase().includes('session')
  );
}

export const issueTypeChecks = (issues: any[]) => ({
  UX: issues.filter(i => isUXIssue(i)),
  Accessibility: issues.filter(i => isAccessibilityIssue(i)),
  Console: issues.filter(i => isConsoleIssue(i)),
  Security: issues.filter(i => isSecurityIssue(i)),
});
