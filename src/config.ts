/**
 * Array of kinds that are exempted from the no operation (nop) handling.
 * Results may include false-positives, so add kinds to the list of exclusions
 * if desired.
 * Valid kinds are 'secret', 'PII', and 'field' (case-sensitive).
 */
export const nopKinds = ['field'];

/**
 * Object containing exclusion patterns for different kinds.
 */
export const excludePatterns = {
  "secret": ["Slackwebhook"],
  "PII": [],
  "field": []
}

// export