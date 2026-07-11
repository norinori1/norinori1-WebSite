const MAX_URL_LENGTH = 8192;

/**
 * Sanitizes a URL by whitelisting safe protocols to prevent XSS (e.g., javascript: URLs).
 * Returns 'about:blank' for unsafe URLs.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  // Defensive check for non-string inputs at runtime
  if (typeof url !== "string" || !url) return "";

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
  // - Non-breaking space (U+00A0)
  const trimmedUrl = normalizedUrl.replace(
    /[\x00-\x1F\x7F-\x9F\s\u00A0\u200E\u200F\u202A-\u202E\u2060-\u206F\u200B-\u200D\uFEFF\u2028\u2029\u00AD\u034F\u115F\u1160\u3164\uFFA0\u180E\u2000-\u200A\u202F\u205F\u3000\uFDD0-\uFDEF\uFFFD\uFFFE\uFFFF\u{E0000}-\u{E007F}\uFE00-\uFE0F\u{E0100}-\u{E01EF}\u1680\u2800\uFFF9-\uFFFC\u17B4\u17B5\u061C\u180B-\u180D\u180F]/gu,
    "",
  );

  // Allow relative paths and anchor links
  // We block protocol-relative URLs (starting with //) and other variations (e.g., /\, / )
  // including full-width equivalents and other Unicode homoglyphs that some browsers
  // might normalize to cross-origin redirects or use for path traversal.
  // Homoglyphs and dangerous delimiters included:
  // - Slashes: / (U+002F), \ (U+005C), ⁄ (U+2044), ∕ (U+2215), ∖ (U+2216), ⧵ (U+29F5), ⧸ (U+29F8), ⧹ (U+29F9), ／ (U+FF0F), ＼ (U+FF3C), ﹨ (U+FE68), ⫽ (U+2AFD), ⫾ (U+2AFE), ⸗ (U+2E17), ⹊ (U+2E4A), ⹋ (U+2E4B), ⹍ (U+2E4D), ⹎ (U+2E4E), ⹆ (U+2E46), ⹌ (U+2E4C), ⹏ (U+2E4F), ⹒ (U+2E52)
  // - Dots: . (U+002E), ․ (U+2024), ‥ (U+2025), … (U+2026), ‧ (U+2027), 。 (U+3002), ﹒ (U+FE52), ． (U+FF0E), ｡ (U+FF61), ۔ (U+06D4), ᙮ (U+166E), ᠃ (U+1803), ᠉ (U+1809), ꓸ (U+A4F8), ꘎ (U+A60E), ⸳ (U+2E33), ܂ (U+0701), ܂ (U+0702), ჻ (U+10FB), ። (U+1362), · (U+00B7), ˙ (U+02D9), · (U+0387), ։ (U+0589), ׉ (U+05C9), ׈ (U+05C8), ︒ (U+FE12), ∙ (U+2219), ⋅ (U+22C5), • (U+2022), ֹ (U+05B9), ּ (U+05BC), ֹ (U+05BA), ֻ (U+05BB), ٠ (U+0660), ۰ (U+06F0), ‣ (U+2023), ⁃ (U+2043), ְ (U+05B0), ֱ (U+05B1), ֲ (U+05B2), ֳ (U+05B3), ִ (U+05B4), ֵ (U+05B5), ֶ (U+05B6), ׁ (U+05C1), ׂ (U+05C2), ׄ (U+05C4), ׅ (U+05C5), ⁒ (U+2052), ᛫ (U+16EB), ᛬ (U+16EC), ᛭ (U+16ED), ⸷ (U+2E37), ⸸ (U+2E38), ⸹ (U+2E39), ⋮ (U+22EE), ⋯ (U+22EF), ⋰ (U+22F0), ⋱ (U+22F1), ؍ (U+060D), ַ (U+05B7), ָ (U+05B8), ׇ (U+05C7), ٫ (U+066B), ٬ (U+066C), ⁞ (U+205E), ⁚ (U+205A), ⁛ (U+205B), ⁜ (U+205C), ⁝ (U+205D), ⁖ (U+2056), ⁘ (U+2058), ⁙ (U+2059), ⸬ (U+2E2C), ⸭ (U+2E2D), ⸼ (U+2E3C), ⸽ (U+2E3D), ⸾ (U+2E3E), ⹈ (U+2E48), ⹁ (U+2E41), ⹔ (U+2E54), ⹕ (U+2E55), ⹖ (U+2E56), ⹗ (U+2E57), ⹘ (U+2E58), ⹙ (U+2E59), ⹝ (U+2E5D), ⸪ (U+2E2A), ⸫ (U+2E2B), ⹑ (U+2E51), ⹚ (U+2E5A), ⹛ (U+2E5B), ⹜ (U+2E5C), ؞ (U+061E), ܀ (U+0700), ܃ (U+0703), ፥ (U+1365), ፦ (U+1366), ᛮ (U+16EE), ⹄ (U+2E44), ᠄ (U+1804), ᠅ (U+1805), ⁑ (U+2051), ⹐ (U+2E50), ⹓ (U+2E53), ܄ (U+0704), ܅ (U+0705), ܆ (U+0706), ܇ (U+0707), ܈ (U+0708), ܉ (U+0709), ⳹ (U+2CF9), ⳺ (U+2CFA), ⵰ (U+2D70), ꓿ (U+A4FF), ⸁ (U+2E01), ⸄ (U+2E04), ⸅ (U+2E05), ⸇ (U+2E07), ⸈ (U+2E08), ⸉ (U+2E09), ⸊ (U+2E0A), ⸌ (U+2E0C), ⸍ (U+2E0D), ⸒ (U+2E12), ⸓ (U+2E13), ⸖ (U+2E16), ⸞ (U+2E1E), ⸟ (U+2E1F), ⸘ (U+2E18), ⸙ (U+2E19), ፡ (U+1361), ⸱ (U+2E31), ⸰ (U+2E30), 𐄀 (U+10100), 𐄁 (U+10101), 𐄂 (U+10102), ⸋ (U+2E0B), ⸚ (U+2E1A), ⸛ (U+2E1B), ⸲ (U+2E32), ⸴ (U+2E34), ⸵ (U+2E35), ⹉ (U+2E49), ⁏ (U+204F), ⸼ (U+2E1C), ⸽ (U+2E1D), ܏ (U+070F), ⹀ (U+2E40), ⳻ (U+2CFB), ⳼ (U+2CFC), ⳽ (U+2CFD), ⳾ (U+2CFE), ⳿ (U+2CFF), ፣ (U+1363), ፤ (U+1364), ፧ (U+1367), ፨ (U+1368), ׀ (U+05C0), ׃ (U+05C3), ׆ (U+05C6), ٭ (U+066D), ܊ (U+070A), ܋ (U+070B), ܌ (U+070C), ܍ (U+070D), ܎ (U+070E)
  // - Other visible delimiters/punctuation: ⸮ (U+2E2E), ⸣ (U+2E23), ⸤ (U+2E24), ⸥ (U+2E25), ⸦ (U+2E26), ⸧ (U+2E27), ⸨ (U+2E28), ⸩ (U+2E29), ⹅ (U+2E45), ⹇ (U+2E47), ⸠ (U+2E20), ⸡ (U+2E21), ⸢ (U+2E22), ⸶ (U+2E36), ⸺ (U+2E3A), ⸻ (U+2E3B), ⸿ (U+2E3F), ⹂ (U+2E42), ⹃ (U+2E43)
  // - Script-specific word dividers: 𐊐 (U+10290), 𐊑 (U+10291), 𔖱 (U+145B1), 𒑰 (U+12470), 𐏐 (U+103D0), 𐎟 (U+1039F), 𐤟 (U+1091F), 𐊟 (U+1029F), 𐤿 (U+1093F), 𐦾 (U+109BE), 𐦿 (U+109BF), 𐩿 (U+10A7F), 𐫶 (U+10AF6), 𐬹 (U+10B39), 𐬺 (U+10B3A), 𐹾 (U+10E7E), 𐪟 (U+10A9F)
  // - URL-encoded: %2f (slash), %5c (backslash), %2e (dot), %00-%1f (controls), %20 (space), %7f (delete), %25 (percent), %80-%9f (C1 controls), %a0 (non-breaking space) - case insensitive
  if (
    (trimmedUrl.startsWith("/") &&
      !/^\/([\\\/]|\s|\.|%0[0-9a-f]|%1[0-9a-f]|%20|%2[fe]|%5c|%7f|%25|%8[0-9a-f]|%9[0-9a-f]|%a0|\u2044|\u2215|\u2216|\u29F5|\u29F8|\u29F9|\u2024|\u2025|\u2026|\u2027|\u3002|\uFE52|\uFF0E|\uFF61|\uFF0F|\uFF3C|\u06D4|\u166E|\u1803|\u1809|\uA4F8|\uA4FF|\uA60E|\u2E3C|\u2E33|\u0701|\u0702|\u10FB|\u1362|\u00B7|\u02D9|\u0387|\u0589|\u05C9|\u05C8|\uFE68|\uFE12|\u2219|\u22C5|\u2022|\u05B9|\u05BC|\u2E30|\u05BA|\u05BB|\u0660|\u06F0|\u2023|\u2043|\u05B0|\u05B1|\u05B2|\u05B3|\u05B4|\u05B5|\u05B6|\u05C1|\u05C2|\u05C4|\u05C5|\u2052|\u16EB|\u16EC|\u16ED|\u2E37|\u2E38|\u2E39|\u22EE|\u22EF|\u22F0|\u22F1|\u060D|\u05B7|\u05B8|\u05C7|\u066B|\u066C|\u205E|\u205A|\u205B|\u205C|\u205D|\u2056|\u2058|\u2059|\u2E2C|\u2E2D|\u2E3D|\u2E48|\u2E4A|\u2E3E|\u2E41|\u2E54|\u2E55|\u2E56|\u2E57|\u2E58|\u2E59|\u2E5D|\u2AFD|\u2AFE|\u2E2A|\u2E2B|\u2E51|\u2E5A|\u2E5B|\u2E5C|\u061E|\u0700|\u0703|\u1365|\u1366|\u16EE|\u2E44|\u1804|\u1805|\u2E46|\u2E4B|\u2E4C|\u2E4D|\u2E4E|\u2E4F|\u2E52|\u2051|\u2E50|\u2E53|\u0704|\u0705|\u0706|\u0707|\u0708|\u0709|\u2CF9|\u2CFA|\u2D70|\u2E01|\u2E04|\u2E05|\u2E07|\u2E08|\u2E09|\u2E0A|\u2E0C|\u2E0D|\u2E12|\u2E13|\u2E16|\u2E17|\u2E18|\u2E19|\u2E1E|\u2E1F|\u1361|\u2E31|\u{10100}|\u{10101}|\u{10102}|\u{10290}|\u{10291}|\u{145B1}|\u{12470}|\u{103D0}|\u{1039F}|\u{1091F}|\u{1029F}|\u{1093F}|\u{109BE}|\u{109BF}|\u{10A7F}|\u{10AF6}|\u{10B39}|\u{10B3A}|\u{10E7E}|\u{10A9F}|\u2E0B|\u2E1A|\u2E1B|\u2E32|\u2E34|\u2E35|\u2E49|\u204F|\u2E1C|\u2E1D|\u070F|\u2E40|\u2E2E|\u2E23|\u2E24|\u2E25|\u2E26|\u2E27|\u2E28|\u2E29|\u2E45|\u2E47|\u2E20|\u2E21|\u2E22|\u2E36|\u2E3A|\u2E3B|\u2E3F|\u2E42|\u2E43|\u2CFB|\u2CFC|\u2CFD|\u2CFE|\u2CFF|\u1363|\u1364|\u1367|\u1368|\u05C0|\u05C3|\u05C6|\u066D|\u070A|\u070B|\u070C|\u070D|\u070E)/ui.test(
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
  // Defensive check for non-string inputs at runtime
  if (typeof url !== "string" || !url || url.length > MAX_URL_LENGTH) return false;

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
