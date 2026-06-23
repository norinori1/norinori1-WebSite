## 2025-05-15 - XSS via JSON-LD Script Injection
**Vulnerability:** Potential XSS via script termination in JSON-LD blocks.
**Learning:** Using `dangerouslySetInnerHTML` to inject `JSON.stringify(data)` into a `<script>` tag is unsafe if `data` contains Notion-sourced content. An attacker could include `</script><script>alert(1)</script>` in a title or description, terminating the structured data block and executing arbitrary JS.
**Prevention:** Always escape the `<` character as `\u003c` after `JSON.stringify()` when injecting into a script tag.

## 2025-05-16 - URL and Proxy Hardening
**Vulnerability:** Protocol-relative URLs and embedded credentials in proxy destinations.
**Learning:** Functions like `sanitizeUrl` and `isTrustedImageHost` need to explicitly block protocol-relative URLs (`//attacker.com`) and URLs with embedded credentials (`https://user:pass@host`). While `new URL()` correctly parses these, simply checking `hostname` or `startsWith("/")` is insufficient to prevent all forms of obfuscation or unexpected redirects.
**Prevention:** Always verify `username` and `password` are empty in `URL` objects for proxy destinations, and ensure path-based sanitizers specifically exclude the `//` prefix.

## 2025-05-20 - Open Redirect via Path Normalization
**Vulnerability:** Potential open redirect via URL normalization in browsers.
**Learning:** Simply checking for `//` at the start of a URL is not enough to prevent open redirects. Some browsers normalize paths starting with `/\`, `/ ` (whitespace), or `/\t` (tabs) into protocol-relative URLs (e.g., `https://example.com/\attacker.com` might redirect to `attacker.com` on some platforms).
**Prevention:** Path-based sanitizers should block any URL starting with `/` followed by another slash, a backslash, or whitespace/control characters.

## 2025-05-21 - URL Sanitization Hardening against Newline Injection
**Vulnerability:** Potential newline injection (CR/LF) in URLs.
**Learning:** While `sanitizeUrl` blocked unsafe protocols, it didn't strip carriage returns (\r) or line feeds (\n). Attackers can sometimes use these characters to bypass string-based filters (e.g., `java\r\nscript:`) or, if the URL is ever reflected in an HTTP header, perform response splitting.
**Prevention:** Always strip CR and LF characters from URLs during the sanitization process before any protocol or path validation.

## 2025-05-22 - Cache Poisoning Prevention in Image Proxy
**Vulnerability:** Potential cache poisoning in the internal image URL proxy.
**Learning:** Even if the final redirect is sanitized, caching unsanitized URLs from a CMS (like Notion) can lead to a "negative cache" bypass or potentially serve malicious payloads if sanitization logic changes or has edge cases. Validating the URL *before* it enters the cache (and caching a null/failure state for invalid URLs) prevents the cache from being used as a staging area for malformed data.
**Prevention:** Implement URL validation (sanitization and host allowlisting) both at the point of ingestion (before caching) and at the point of consumption (before redirecting).

## 2025-05-23 - URL Hardening against BiDi and Zero-Width Attacks
**Vulnerability:** Potential UI spoofing or filter bypass via malicious Unicode characters.
**Learning:** Even with protocol whitelisting, URLs can contain Bidirectional (BiDi) override characters (e.g., U+202E) that flip text direction, potentially spoofing file extensions in the UI. Additionally, zero-width characters (e.g., U+200B) can be used to obfuscate protocols or bypass simple string checks. Extremely long URLs can also lead to resource exhaustion.
**Prevention:** Harden `sanitizeUrl` to strip BiDi control characters, zero-width spaces/joiners, and enforce a reasonable `MAX_URL_LENGTH` (e.g., 8192 characters). Always use the `u` flag in regex for correct Unicode handling.

## 2025-05-24 - URL Normalization against Authority Bypass
**Vulnerability:** Potential open redirect or spoofing via non-standard authority characters.
**Learning:** Even if protocols are whitelisted, characters like backslashes (`\`) or full-width dots (`。`) in the authority part of a URL can be interpreted differently by different browsers or libraries. For instance, `https://notion.so\attacker.com` might be normalized to `https://notion.so/attacker.com` by some, but could potentially lead to an open redirect if used raw in certain contexts.
**Prevention:** Always normalize absolute URLs using the `URL` constructor (`new URL(url).href`) before use. This ensures a consistent, standard representation (e.g., backslashes converted to forward slashes, full-width characters normalized) and helps prevent bypasses of hostname-based security checks.

## 2025-05-25 - Robust Hostname Validation and DoS Mitigation
**Vulnerability:** Allowlist bypass via trailing dots and potential DoS via Unicode normalization.
**Learning:** Browsers may treat `example.com.` and `example.com` identically, allowing an attacker to bypass simple string-based hostname allowlists by adding a trailing dot. Furthermore, performing Unicode normalization (NFC) on extremely long strings can be computationally expensive; checking length *before* and *after* normalization is necessary for robust DoS protection and ensuring canonical forms stay within limits.
**Prevention:** Always strip trailing dots from hostnames before validation in `isTrustedImageHost`. In `sanitizeUrl`, apply a preliminary length check before `normalize("NFC")`, and a final check after normalization. Also, avoid allowing generic regional S3 hostnames (e.g., `s3.us-west-2.amazonaws.com`) in CSP as they can be abused via path-style access to other buckets.

## 2025-05-26 - Credential and Hostname Normalization Hardening
**Vulnerability:** Potential phishing via embedded credentials and allowlist bypass via trailing dots in absolute URLs.
**Learning:** The `URL` constructor preserves embedded credentials (`user:pass@`) and trailing dots in hostnames in its `.href` output. While useful for technical correctness, these can be exploited for phishing (making a URL look like it's on a trusted host) or to bypass security filters that expect a canonical hostname. Furthermore, third-party libraries or internal systems might not handle these variations consistently.
**Prevention:** When sanitizing absolute URLs, explicitly strip `username` and `password` and normalize the `hostname` by removing any trailing dots before using the resulting `href`. Always apply a `MAX_URL_LENGTH` check before parsing to mitigate DoS risks.

## 2025-05-27 - Protocol Enforcement against Single-Colon Bypasses
**Vulnerability:** Potential filter bypass or ambiguous parsing via single-colon http:/https: URLs.
**Learning:** Browsers and many URL parsers often "fix" https:example.com by treating it as https://example.com/. However, some security filters or backend systems might only look for https:// or might treat https: as a relative path if not careful. Explicitly requiring the :// sequence for standard web protocols prevents this ambiguity and ensures consistent behavior across different parts of the application and external systems.
**Prevention:** In URL sanitizers, always enforce the full :// delimiter for protocols that require it (like http and https), while allowing the standard : for others (like mailto: and tel:).

## 2025-05-28 - Authority Bypass via Obfuscated Credentials
**Vulnerability:** Authority bypass and phishing via embedded credentials in URLs.
**Learning:** Simply stripping credentials (`user:pass@`) from absolute URLs in a sanitizer is insufficient and potentially dangerous. Characters like tabs, backslashes, or other whitespace can be used to obfuscate the authority part, causing parsers to see a "trusted" host as a username for a malicious host (e.g., `https://notion.so\t@attacker.com`). If the sanitizer merely strips what it thinks are credentials, it might inadvertently transform a malicious URL into a valid-looking one or fail to catch the bypass.
**Prevention:** Instead of stripping credentials, URL sanitizers should explicitly reject any absolute URL that contains a non-empty username or password. This prevents authority bypass attacks and mitigates phishing by ensuring only standard, credential-free URLs are allowed.

## 2025-05-28 - Defense in Depth against Advanced Unicode Obfuscation
**Vulnerability:** Potential filter bypass or UI spoofing via obscure Unicode characters and length expansion.
**Learning:** Standard URL sanitization often misses advanced Unicode obfuscation vectors like Tag characters (U+E0000+), non-characters, and obscure whitespace. These can be used to hide malicious data from simple filters or cause inconsistent parsing. Furthermore, URLs that pass initial length checks might expand significantly after URL encoding (e.g., non-ASCII characters becoming %XX sequences), potentially leading to resource exhaustion or buffer overflows in downstream systems.
**Prevention:** Harden URL sanitizers to strip Tag characters, non-characters, and all Unicode whitespace categories. Crucially, apply a final `MAX_URL_LENGTH` check *after* all normalization, stripping, and `new URL()` parsing to ensure the canonical, encoded form remains within safe bounds.

## 2025-05-29 - Relative Path Bypass via Full-Width Characters
**Vulnerability:** Open redirect and protocol-relative URL bypass via Unicode normalization.
**Learning:** Browsers and some servers normalize full-width characters like `／` (U+FF0F), `＼` (U+FF3C), and `．` (U+FF0E) to their standard ASCII equivalents. Security filters that only check for standard characters (e.g., `startsWith("//")` or `startsWith("/\\")`) can be bypassed by using these full-width variants, which then get normalized to a malicious cross-origin redirect by the browser.
**Prevention:** Relative path sanitizers must explicitly include full-width equivalents in their blocklists for characters like slashes, backslashes, and dots when they appear at the start of a path.

## 2025-05-30 - Path Bypass via Unicode Homoglyphs
**Vulnerability:** Open redirect and path traversal bypass via non-full-width Unicode homoglyphs.
**Learning:** Beyond full-width characters (U+FFxx), other Unicode characters like Fraction Slash (U+2044), Division Slash (U+2215), One Dot Leader (U+2024), and Ideographic Full Stop (U+3002) can be interpreted as slashes or dots by various components in the web stack (parsers, browsers, or downstream OS APIs). Sanitizers that only block ASCII or full-width variants remain vulnerable to these homoglyph-based bypasses.
**Prevention:** Ensure relative path blocklists comprehensively include known Unicode homoglyphs for slashes and dots, especially in logic designed to prevent protocol-relative URLs (starting with `//`) or directory traversal (starting with `..`).

## 2025-05-31 - Path Bypass via Advanced Unicode Homoglyphs
**Vulnerability:** Open redirect and path traversal bypass via obscure Unicode homoglyphs for slashes and dots.
**Learning:** Beyond common full-width and slash-like characters, more obscure Unicode characters such as Set Minus (\u2216), Reverse Solidus Operator (\u29F5), Big Solidus (\u29F8), and Two Dot Leader (\u2025) can be interpreted as path delimiters or traversal tokens by various components.
**Prevention:** Ensure relative path blocklists in URL sanitizers are comprehensive and include advanced Unicode homoglyphs (\u2216, \u29F5, \u29F8, \u29F9, \u2025, \u2026, \uFE52, \uFF61) specifically at the start of a path to prevent protocol-relative URL and traversal bypasses.

## 2025-06-01 - URL Sanitization Hardening against Advanced Unicode Obfuscation
**Vulnerability:** Potential filter bypass via obscure Unicode characters.
**Learning:** Even with comprehensive stripping, certain characters like Arabic Letter Mark (U+061C) and Mongolian Variation Selectors (U+180B-U+180F) can be used to obfuscate protocols. Additionally, characters like Hyphenation Point (U+2027) can be interpreted as dots by some parsers, potentially leading to path traversal or open redirect bypasses if not properly handled at the start of a path.
**Prevention:** Continuously update sanitization regexes to include newly discovered or less common "ignorable" or "dangerous" Unicode characters. Ensure homoglyph lists for path delimiters are comprehensive.

## 2025-06-02 - Path Bypass via Regional Dot Homoglyphs
**Vulnerability:** Potential path traversal or open redirect bypass via Arabic and Canadian syllabics dot homoglyphs.
**Learning:** Characters like Arabic Full Stop (U+06D4) and Canadian Syllabics Full Stop (U+166E) can be interpreted as standard dots by various components in the web stack. If these are not included in the blocklist for relative paths (e.g., preventing `//` or `..`), they can be used to bypass security filters.
**Prevention:** Maintain a comprehensive list of Unicode homoglyphs for dots and slashes, including regional variations like U+06D4 and U+166E, and ensure they are blocked at the start of paths in URL sanitizers.

## 2026-05-27 - Path Bypass via URL Encoding
**Vulnerability:** Potential open redirect or path traversal bypass via URL-encoded characters in relative paths.
**Learning:** Security filters that only check for literal characters like `/`, `\`, or `.` can be bypassed if the browser or a downstream component decodes the URL before processing it. For example, `/%2f/attacker.com` might be normalized to `//attacker.com` by some browsers, leading to an open redirect.
**Prevention:** URL sanitizers should explicitly include URL-encoded variants (e.g., `%2f`, `%5c`, `%2e`) in their blocklists for relative paths, especially when used to prevent protocol-relative URLs or directory traversal.

## 2026-05-28 - Relative Path Bypass via Encoded Control Characters
**Vulnerability:** Potential open redirect bypass via URL-encoded control characters and spaces.
**Learning:** Security filters that block protocol-relative URLs (e.g., `//`) can be bypassed if the browser or a downstream component decodes or ignores URL-encoded control characters (e.g., `%09`, `%0a`, `%0d`) or spaces (`%20`) at the start of a path. For example, `/%09/attacker.com` might be normalized to `//attacker.com` by some browsers, leading to an open redirect.
**Prevention:** Relative path sanitizers must explicitly include URL-encoded control characters (`%00` through `%1f`) and space (`%20`) in their blocklists when used to prevent protocol-relative URL bypasses.

## 2026-05-29 - URL Sanitization Hardening against Obscure Dot Homoglyphs
**Vulnerability:** Potential open redirect and path traversal bypass via obscure Unicode dot-like characters.
**Learning:** Beyond common homoglyphs, characters like Ethiopic Full Stop (U+1362), Middle Dot (U+00B7), Dot Above (U+02D9), Greek Ano Teleia (U+0387), and Armenian Full Stop (U+0589) can be interpreted as standard dots by various parsers or environments. Furthermore, invisible word separators like Ethiopic Wordspace (U+1361) and Aegean Word Separator Dot (U+10101) can be used to obfuscate protocols if not stripped.
**Prevention:** Path-based sanitizers should block a comprehensive list of Unicode homoglyphs for dots and slashes at the start of a path. Additionally, all known Unicode "word separators" and "ignorable" characters should be stripped during the sanitization process to prevent protocol-related bypasses.

## 2026-05-30 - URL Sanitization Hardening against Punctuation Homoglyphs
**Vulnerability:** Potential open redirect and path traversal bypass via mathematical and religious punctuation homoglyphs.
**Learning:** Mathematical operators like Bullet Operator (U+2219) and Dot Operator (U+22C5), along with religious marks like Hebrew Point Holam (U+05B9) and Dagesh (U+05BC), can be visually similar to dots and sometimes normalized or interpreted as such by different components. Additionally, Small Reverse Solidus (U+FE68) and Vertical Full Stop (U+FE12) are often overlooked.
**Prevention:** Maintain an exhaustive list of dot and slash homoglyphs in path-based sanitizers, specifically targeting characters that could be interpreted as path delimiters or traversal tokens at the start of a URL.

## 2026-06-03 - URL Sanitization Hardening against Word Separator Homoglyphs
**Vulnerability:** Potential open redirect and protocol obfuscation via obscure Word Separator characters.
**Learning:** Characters like Word Separator Bar (U+2E30) can be interpreted as dots by some environments, while Word Separator Middle Dot (U+2E31) and Aegean Word Separator Line (U+10100) can be used to obfuscate protocols if not stripped. Furthermore, Hebrew points like Holam Haser (U+05BA) and Qubuts (U+05BB) are additional dot-like homoglyphs that can bypass path-based filters.
**Prevention:** Ensure that all known Unicode Word Separator characters are either stripped during sanitization or included in the blocklist for relative paths if they can be interpreted as path delimiters or traversal tokens.

## 2026-06-04 - Path Bypass via Combining Marks and Digit Homoglyphs
**Vulnerability:** Potential open redirect and path traversal bypass via Arabic-Indic digit zero and Hebrew combining marks.
**Learning:** Arabic-Indic digits zero (U+0660, U+06F0) and various Hebrew vowel points/combining marks (U+05B0-U+05B6, U+05C1-U+05C5) can be visually similar to dots or interpreted as path separators by certain parsers. Furthermore, when using these in JavaScript regular expressions, ranges (e.g., `\u05B0-\u05B6`) inside an alternation group `(a|b|c)` might not always behave as expected for combining marks unless handled carefully.
**Prevention:** Maintain an exhaustive list of dot-like homoglyphs and combining marks in relative path blocklists, using individual character literals within the regex for maximum reliability. Additionally, enforce HSTS on all sensitive API routes for defense-in-depth.

## 2026-06-05 - Path Bypass via Punctuation and Ellipses Homoglyphs
**Vulnerability:** Open redirect and path traversal bypass via punctuation marks and ellipses interpreted as delimiters.
**Learning:** Obscure Unicode characters such as Commercial Minus Sign (\u2052), vertical and diagonal ellipses (\u22EE-\u22F1), and Arabic Date Separator (\u060D) can be normalized or interpreted as slashes/dots. Furthermore, various Hebrew points and Runic punctuation marks can be used as homoglyphs for path delimiters at the start of a URL.
**Prevention:** Maintain an exhaustive list of dot and slash homoglyphs in relative path blocklists. Additionally, strip obscure "ignorable" characters like Infix Wedge (\u2E0B), Hyphen with Diaeresis (\u2E1A), and Siglum (\u2E1B) to prevent protocol-relative URL and protocol obfuscation bypasses.

## 2026-06-08 - Path Bypass via Double Encoding and Multi-Dot Homoglyphs
**Vulnerability:** Open redirect and path traversal bypass via double URL encoding and obscure multi-dot homoglyphs.
**Learning:** URL sanitizers can be bypassed if they don't account for the percent sign (`%25`) at the start of a path, which can be used to double-encode dangerous characters (e.g., `/%252f/` becomes `//`). Additionally, obscure multi-dot Unicode characters like Two Dot Punctuation (\u205A), Four Dot Mark (\u205B), Dotted Cross (\u205C), and Tricolon (\u205D) can be interpreted as path delimiters or traversal tokens.
**Prevention:** Include `%25` and multi-dot homoglyphs (\u205A, \u205B, \u205C, \u205D) in the blocklist for relative paths starting with dangerous characters. Furthermore, strip obscure characters like Ring Point (\u2E30) and Aegean Check Mark (\u10102) to prevent protocol obfuscation.

## 2026-06-10 - URL Sanitization Hardening against Advanced Punctuation Homoglyphs
**Vulnerability:** Open redirect and protocol obfuscation via obscure punctuation and dotted homoglyphs.
**Learning:** Obscure Unicode characters such as Three/Four/Five Dot Punctuation (\u2056, \u2058, \u2059), Squared Four Dot Punctuation (\u2E2C), and Dotted Solidus (\u2E4A) can be used as homoglyphs for dots and slashes to bypass path-based filters. Additionally, characters like Turned Comma (\u2E32) and Raised Comma (\u2E34) can be used to obfuscate protocols like `javascript:` if they are not stripped before validation.
**Prevention:** Maintain an exhaustive blocklist for relative paths and a comprehensive strip list for "ignorable" or "dangerous" punctuation in URL sanitizers. Always verify suspected bypasses with a reproduction script to ensure coverage.

## 2026-06-11 - URL Sanitization Hardening against Obscure Unicode Homoglyphs
**Vulnerability:** Open redirect and protocol-relative URL bypass via obscure Unicode dot and slash homoglyphs.
**Learning:** Obscure Unicode characters such as Double/Triple Solidus Operators (\u2AFD, \u2AFE), Two/Three Dots Over One Dot Punctuation (\u2E2A, \u2E2B), and various dotted punctuation marks (e.g., \u2E5A-\u2E5C, \u0700, \u0703) can be interpreted as path delimiters or dots by different environments. Furthermore, Syriac Abbreviation Mark (\u070F) and Double Hyphen (\u2E40) are additional "ignorable" characters that can be used to obfuscate protocols if not stripped.
**Prevention:** Maintain an exhaustive blocklist for relative paths and a comprehensive strip list for "ignorable" or "dangerous" characters in URL sanitizers. Always verify suspected bypasses with a reproduction script to ensure coverage of obscure Unicode ranges.

## 2026-06-12 - URL Sanitization Hardening against Supplemental Dot Homoglyphs
**Vulnerability:** Open redirect and path traversal bypass via supplemental Unicode dot-over/under punctuation.
**Learning:** Obscure Unicode characters from the Supplemental Punctuation block, specifically One/Two/Three/Four/Five/Six Dot Over/Under Punctuation (\u2E54-\u2E59), were not included in the blocklist for relative paths. These characters can be interpreted as dots by various parsers and browsers, potentially allowing protocol-relative URL (e.g., //) or path traversal bypasses.
**Prevention:** Maintain an exhaustive blocklist for relative paths that includes all variants of dot and slash homoglyphs across different Unicode blocks. Use reproduction scripts to systematically test ranges of related characters.

## 2026-06-13 - URL Sanitization Hardening against Advanced Supplemental Punctuation Homoglyphs
**Vulnerability:** Open redirect and path traversal bypass via obscure Supplemental Punctuation homoglyphs.
**Learning:** Characters like Inverted low kavyka with dot (\u2E46), Virgule with middle dot (\u2E4B), and Triple-dotted punctuation (\u2E4F) can be interpreted as dots or slashes by some parsers or browsers. If these are not explicitly blocked at the start of a relative path, they can be used to bypass protocol-relative URL (//) or path traversal (..) filters.
**Prevention:** Continuously monitor and update relative path blocklists to include newly identified Unicode homoglyphs from supplemental blocks (e.g., U+2E46, U+2E4B, U+2E4C, U+2E4D, U+2E4E, U+2E4F, U+2E52).

## 2026-06-14 - URL Sanitization Hardening against Multi-Block Homoglyphs
**Vulnerability:** Open redirect and path traversal bypass via obscure Unicode homoglyphs from multiple blocks.
**Learning:** Beyond common supplemental punctuation, obscure characters from Syriac (U+0704-U+0709), Coptic (U+2CF9-U+2CFA), Tifinagh (U+2D70), and Lisu (U+A4FF) blocks, as well as specific General/Supplemental Punctuation like Two Dot Punctuation (U+2051), Cross Punti (U+2E50), and Medieval Comma (U+2E53), can be interpreted as path delimiters or dots.
**Prevention:** Maintain an exhaustive, multi-block blocklist for relative paths in URL sanitizers. Use reproduction scripts to systematically identify and verify homoglyphs across the entire Unicode space.

## 2026-06-15 - URL Sanitization Hardening against Supplemental Dotted Homoglyphs
**Vulnerability:** Potential open redirect and path traversal bypass via obscure Unicode dotted punctuation.
**Learning:** Obscure Unicode characters from the Supplemental Punctuation block (U+2E01, U+2E04, U+2E05, U+2E07, U+2E08, U+2E13, U+2E16, U+2E1E, U+2E1F) were not included in the blocklist for relative paths or the strip list for protocols. These can be used to bypass security filters.
**Prevention:** Maintain an exhaustive blocklist for relative paths and a comprehensive strip list for "ignorable" or "dangerous" characters in URL sanitizers. Use reproduction scripts to systematically identify and verify homoglyphs across the entire Unicode space.

## 2026-06-16 - URL Sanitization: Avoiding "Security Theater" in Stripping
**Vulnerability:** Potential protocol obfuscation via character stripping.
**Learning:** Globally stripping characters from a URL before protocol validation can be dangerous. If a sanitizer strips a character like an "oblique slant" (\u2E17), an attacker can use it to hide a dangerous protocol (e.g., `java\u2E17script:`). The sanitizer then "helps" the attacker by reconstructing the malicious string.
**Prevention:** Only strip characters that are truly invisible or purely ignorable. For other obscure punctuation, prefer blocking them at the start of relative paths (to prevent open redirects) but leaving them in absolute URLs so they cause protocol validation to fail naturally.

## 2026-06-23 - Path Bypass via Middle Eastern and African Homoglyphs
**Vulnerability:** Open redirect and path traversal bypass via homoglyphs in Coptic, Ethiopic, Hebrew, and Arabic blocks.
**Learning:** Characters like Coptic Direct Question Mark (U+2CFC), Ethiopic Preface Colon (U+1363), Hebrew Paseq (U+05C0), and Arabic Five Pointed Star (U+066D) can be interpreted as path separators or dots by some components. These were missing from the relative path blocklist.
**Prevention:** Maintain an exhaustive list of dot and slash homoglyphs across all Unicode blocks in relative path blocklists to prevent protocol-relative URL and traversal bypasses.
