/**
 * Sanitizes a URL by whitelisting safe protocols to prevent XSS (e.g., javascript: URLs).
 * Returns 'about:blank' for unsafe URLs.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "";

  const trimmedUrl = url.trim();

  // Allow relative paths and anchor links
  if (trimmedUrl.startsWith("/") || trimmedUrl.startsWith("#")) {
    return trimmedUrl;
  }

  // Check for safe protocols
  const safeProtocols = /^(https?|mailto|tel):/i;
  if (safeProtocols.test(trimmedUrl)) {
    return trimmedUrl;
  }

  // If it doesn't match a safe protocol and isn't a relative path,
  // it might be a javascript: or other unsafe protocol.
  // Note: We return 'about:blank' to safely neutralize the link.
  return "about:blank";
}
