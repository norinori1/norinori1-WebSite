/**
 * Sanitizes a URL by whitelisting safe protocols to prevent XSS (e.g., javascript: URLs).
 * Returns 'about:blank' for unsafe URLs.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "";

  // Strip all control characters (0x00-0x1F and 0x7F) and whitespace
  // to prevent protocol obfuscation (e.g., java\0script:).
  const trimmedUrl = url.trim().replace(/[\x00-\x1F\x7F]/g, "");

  // Allow relative paths and anchor links
  // We block protocol-relative URLs (starting with //) and other variations (e.g., /\, / )
  // that some browsers might normalize to cross-origin redirects.
  if (
    (trimmedUrl.startsWith("/") && !/^\/([\\\/]|\s)/.test(trimmedUrl)) ||
    trimmedUrl.startsWith("#")
  ) {
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

const GENERIC_S3_HOSTS = [
  "s3.us-west-2.amazonaws.com",
  "s3-us-west-2.amazonaws.com",
];

/**
 * Validates that a URL belongs to a trusted image host (e.g., Notion or S3).
 * Prevents the image proxy from being used as a generic open redirect.
 * Strictly enforces HTTPS to prevent man-in-the-middle attacks.
 */
export function isTrustedImageHost(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Enforce HTTPS and basic origin validation
    if (
      parsed.protocol !== "https:" ||
      !ALLOWED_IMAGE_HOSTS.includes(parsed.hostname) ||
      (parsed.port !== "" && parsed.port !== "443") ||
      parsed.username !== "" ||
      parsed.password !== ""
    ) {
      return false;
    }

    // Defense-in-depth: For generic S3 hostnames, block path-style access
    // which could be used to proxy any public S3 bucket.
    // Legitimate Notion URLs use virtual-host style (bucket name in hostname)
    // or very specific paths on Notion's own domains.
    if (GENERIC_S3_HOSTS.includes(parsed.hostname)) {
      // If hostname is exactly the generic S3 endpoint, the path must NOT
      // look like it's addressing a bucket (path-style).
      // Notion typically doesn't use these generic endpoints for images anymore;
      // it uses prod-files-secure.s3.us-west-2.amazonaws.com.
      return false;
    }

    return true;
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
