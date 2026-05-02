const MAX_URL_LENGTH = 8192;

/**
 * Sanitizes a URL by whitelisting safe protocols to prevent XSS (e.g., javascript: URLs).
 * Returns 'about:blank' for unsafe URLs.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.length > MAX_URL_LENGTH) return "about:blank";

  // Apply NFC normalization first to ensure consistent representation.
  // We do this before length check to be accurate, but here it's after for perf.
  // Actually, let's do it before length check to be safe against normalization growth.
  const normalizedUrl = url.normalize("NFC");
  if (normalizedUrl.length > MAX_URL_LENGTH) return "about:blank";

  // Strip all control characters (0x00-0x1F, 0x7F-0x9F), all whitespace,
  // and dangerous Unicode characters (BiDi, zero-width) to prevent
  // protocol obfuscation or UI spoofing.
  const trimmedUrl = normalizedUrl.replace(
    /[\x00-\x1F\x7F-\x9F\s\u200E\u200F\u202A-\u202E\u2066-\u2069\u2028\u2029\u200B-\u200D\uFEFF]/gu,
    "",
  );

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
    try {
      // Use URL constructor to normalize the URL (e.g., converting \ to / in host)
      // and ensure it's a valid absolute URL.
      const parsed = new URL(trimmedUrl);
      // Security Hardening: Strip credentials (username/password) from URLs.
      parsed.username = "";
      parsed.password = "";
      return parsed.href;
    } catch {
      // Fallback for edge cases where the regex matched but URL parsing failed
      return "about:blank";
    }
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

    // Normalize hostname by stripping trailing dots (e.g., notion.so. -> notion.so)
    const hostname = parsed.hostname.replace(/\.+$/, "");

    // Enforce HTTPS and basic origin validation
    if (
      parsed.protocol !== "https:" ||
      !ALLOWED_IMAGE_HOSTS.includes(hostname) ||
      (parsed.port !== "" && parsed.port !== "443") ||
      parsed.username !== "" ||
      parsed.password !== ""
    ) {
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
