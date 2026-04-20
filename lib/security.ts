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

const ALLOWED_IMAGE_HOSTS = [
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "secure.notion-static.com",
  "www.notion.so",
  "s3.us-west-2.amazonaws.com",
  "s3-us-west-2.amazonaws.com",
  "notion.so",
];

/**
 * Validates that a URL belongs to a trusted image host (e.g., Notion or S3).
 * Prevents the image proxy from being used as a generic open redirect.
 * Strictly enforces HTTPS to prevent man-in-the-middle attacks.
 */
export function isTrustedImageHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      ALLOWED_IMAGE_HOSTS.includes(parsed.hostname) &&
      (parsed.port === "" || parsed.port === "443")
    );
  } catch {
    return false;
  }
}

const ALLOWED_IMAGE_PROPERTIES = ["Thumbnail", "CoverImage"];

/**
 * Validates that the requested Notion property name is on the allowlist.
 * Prevents probing for sensitive page properties via the image proxy.
 */
export function isAllowedImageProperty(prop: string | null): boolean {
  return !!prop && ALLOWED_IMAGE_PROPERTIES.includes(prop);
}
