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
