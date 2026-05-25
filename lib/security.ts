const MAX_URL_LENGTH = 8192;

/**
 * Sanitizes a URL by whitelisting safe protocols to prevent XSS (e.g., javascript: URLs).
 * Returns 'about:blank' for unsafe URLs.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "";

  // Preliminary length check to prevent DoS during normalization.
  if (url.length > MAX_URL_LENGTH) return "about:blank";

  // Apply Unicode normalization (NFC) and check length again to ensure
  // the limit is applied to the final canonical form.
  const normalizedUrl = url.normalize("NFC");
  if (normalizedUrl.length > MAX_URL_LENGTH) return "about:blank";

  // Strip all control characters (0x00-0x1F, 0x7F-0x9F), all whitespace,
  // and dangerous/invisible Unicode characters to prevent protocol obfuscation,
  // UI spoofing, or bypasses via obscure characters.
  // We include:
  // - BiDi overrides (U+200E, U+200F, U+202A-U+202E)
  // - Invisible operators and isolates (U+2060-U+206F)
  // - Zero-width characters (U+200B-U+200D, U+FEFF)
  // - Separators and formatters (U+2028, U+2029, U+00AD, U+034F, U+115F, U+1160, U+3164, U+FFA0, U+180E)
  // - Additional Unicode spaces (U+2000-U+200A, U+202F, U+205F, U+3000)
  // - Non-characters and replacement (U+FDD0-U+FDEF, U+FFFD, U+FFFE, U+FFFF)
  // - Tag characters (U+E0000-U+E007F)
  // - Variation selectors (U+FE00-U+FE0F, U+E0100-U+E01EF)
  // - Mongolian variation selectors (U+180B-U+180D, U+180F)
  // - Obscure spaces and blanks (U+1680, U+2800)
  // - Special purpose and annotation characters (U+FFF9-U+FFFC)
  // - Khmer invisible characters (U+17B4, U+17B5)
  // - Arabic Letter Mark (U+061C)
  const trimmedUrl = normalizedUrl.replace(
    /[\x00-\x1F\x7F-\x9F\s\u200E\u200F\u202A-\u202E\u2060-\u206F\u200B-\u200D\uFEFF\u2028\u2029\u00AD\u034F\u115F\u1160\u3164\uFFA0\u180E\u2000-\u200A\u202F\u205F\u3000\uFDD0-\uFDEF\uFFFD\uFFFE\uFFFF\u{E0000}-\u{E007F}\uFE00-\uFE0F\u{E0100}-\u{E01EF}\u1680\u2800\uFFF9-\uFFFC\u17B4\u17B5\u061C\u180B-\u180D\u180F]/gu,
    "",
  );

  // Allow relative paths and anchor links
  // We block protocol-relative URLs (starting with //) and other variations (e.g., /\, / )
  // including full-width equivalents and other Unicode homoglyphs that some browsers
  // might normalize to cross-origin redirects or use for path traversal.
  // Homoglyphs included:
  // - Slashes: / (U+002F), \ (U+005C), ⁄ (U+2044), ∕ (U+2215), ∖ (U+2216), ⧵ (U+29F5), ⧸ (U+29F8), ⧹ (U+29F9), ／ (U+FF0F), ＼ (U+FF3C)
  // - Dots: . (U+002E), ․ (U+2024), ‥ (U+2025), … (U+2026), ‧ (U+2027), 。 (U+3002), ﹒ (U+FE52), ． (U+FF0E), ｡ (U+FF61)
  if (
    (trimmedUrl.startsWith("/") &&
      !/^\/([\\\/]|\s|\.|\u2044|\u2215|\u2216|\u29F5|\u29F8|\u29F9|\u2024|\u2025|\u2026|\u2027|\u3002|\uFE52|\uFF0E|\uFF61|\uFF0F|\uFF3C)/.test(
        trimmedUrl,
      )) ||
    trimmedUrl.startsWith("#")
  ) {
    return trimmedUrl;
  }

  // Check for safe protocols
  // We require :// for http/https to prevent single-colon bypasses (e.g., https:example.com)
  const safeProtocols = /^(?:https?:\/\/|mailto:|tel:)/i;
  if (safeProtocols.test(trimmedUrl)) {
    try {
      // Use URL constructor to normalize the URL (e.g., converting \ to / in host)
      // and ensure it's a valid absolute URL.
      const parsed = new URL(trimmedUrl);

      // Security Hardening: Reject URLs with credentials (user:pass@host).
      // This prevents authority bypass vulnerabilities where an attacker
      // hides their real host behind a trusted one (e.g., https://notion.so@attacker.com)
      // and also mitigates phishing.
      if (parsed.username !== "" || parsed.password !== "") {
        return "about:blank";
      }

      // Normalize hostname by stripping trailing dots for consistent representation.
      parsed.hostname = parsed.hostname.replace(/\.+$/, "");
      const finalUrl = parsed.href;

      // Final length check after all normalization and parsing.
      // This ensures that if parsing/encoding significantly increased the length,
      // we still enforce the limit.
      if (finalUrl.length > MAX_URL_LENGTH) return "about:blank";

      return finalUrl;
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
  if (!url || url.length > MAX_URL_LENGTH) return false;

  try {
    const parsed = new URL(url);
    // Normalize hostname by stripping all trailing dots to prevent bypasses.
    const normalizedHostname = parsed.hostname.replace(/\.+$/, "");

    // Enforce HTTPS and basic origin validation
    if (
      parsed.protocol !== "https:" ||
      !ALLOWED_IMAGE_HOSTS.includes(normalizedHostname) ||
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
