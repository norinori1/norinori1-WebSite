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

## 2025-05-30 - URL Normalization Bypass via Full-width Characters
**Vulnerability:** Potential open redirect or path traversal via full-width Unicode characters in relative paths.
**Learning:** Some browsers and libraries normalize full-width characters like U+FF0F (／), U+FF3C (＼), and U+FF0E (．) into their standard ASCII equivalents (/, \, .). If a sanitizer only checks for the standard ASCII characters when validating relative paths (e.g., checking for // to prevent protocol-relative redirects), an attacker can use full-width versions to bypass the filter while still achieving the malicious effect after browser normalization.
**Prevention:** Always include full-width equivalents (U+FF0F, U+FF3C, U+FF0E) in regex-based blacklists for URL path prefixes.
