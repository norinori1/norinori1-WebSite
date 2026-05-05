import { sanitizeUrl, isTrustedImageHost } from "./security";

// Mock NOTION_ID_REGEX for testing since it's defined in the route file
const NOTION_ID_REGEX =
  /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{32})$/i;

const testCases = {
  isTrustedImageHost: [
    {
      url: "https://prod-files-secure.s3.us-west-2.amazonaws.com/uuid/image.png",
      expected: true,
      description: "Valid S3 signed URL",
    },
    {
      url: "https://s3.us-west-2.amazonaws.com/attacker-bucket/malicious.png",
      expected: false,
      description: "Generic S3 host (removed from allowlist)",
    },
    {
      url: "http://prod-files-secure.s3.us-west-2.amazonaws.com/uuid/image.png",
      expected: false,
      description: "Insecure HTTP URL",
    },
    {
      url: "https://attacker.com",
      expected: false,
      description: "Untrusted host",
    },
    {
      url: "https://user:pass@prod-files-secure.s3.us-west-2.amazonaws.com/uuid/image.png",
      expected: false,
      description: "URL with credentials",
    },
    {
      url: "https://prod-files-secure.s3.us-west-2.amazonaws.com./uuid/image.png",
      expected: true,
      description: "URL with trailing dot in hostname (normalized)",
    },
    {
      url: "https://prod-files-secure.s3.us-west-2.amazonaws.com/" + "a".repeat(8193),
      expected: false,
      description: "Overly long URL in isTrustedImageHost",
    },
  ],
  sanitizeUrl: [
    {
      url: "https://example.com",
      expected: "https://example.com/",
      description: "Safe HTTPS URL",
    },
    {
      url: "javascript:alert(1)",
      expected: "about:blank",
      description: "Unsafe javascript protocol",
    },
    {
      url: "java\x00script:alert(1)",
      expected: "about:blank",
      description: "Null byte in protocol",
    },
    {
      url: "/path/to/resource",
      expected: "/path/to/resource",
      description: "Safe relative path",
    },
    {
      url: "//attacker.com",
      expected: "about:blank",
      description: "Protocol-relative URL",
    },
    {
      url: "/\\attacker.com",
      expected: "about:blank",
      description: "Normalization bypass /\\",
    },
    {
      url: "https://example.com/\x08",
      expected: "https://example.com/",
      description: "URL with backspace control character",
    },
    {
      url: "java\r\nscript:alert(1)",
      expected: "about:blank",
      description: "CRLF in protocol",
    },
    {
      url: "https://exa mple.com",
      expected: "https://example.com/",
      description: "Whitespace in hostname (stripped)",
    },
    {
      url: "java\x80script:alert(1)",
      expected: "about:blank",
      description: "C1 control character in protocol",
    },
    {
      url: "https://example.com/safe.png\u202Egnp.evil",
      expected: "https://example.com/safe.pnggnp.evil",
      description: "URL with RTL override (stripped)",
    },
    {
      url: "https://example.com/\u200Bzero-width",
      expected: "https://example.com/zero-width",
      description: "URL with zero-width space (stripped)",
    },
    {
      url: "https://example.com/\u200D\u2060\uFEFFmore-stripped",
      expected: "https://example.com/more-stripped",
      description: "URL with ZWJ, word joiner, and BOM (stripped)",
    },
    {
      url: "https://example.com/\u2066isolates\u2069",
      expected: "https://example.com/isolates",
      description: "URL with BiDi isolates (stripped)",
    },
    {
      url: "https://example.com/line\u2028separator\u2029",
      expected: "https://example.com/lineseparator",
      description: "URL with line/paragraph separators (stripped)",
    },
    {
      url: "https://example.com/mongolian\u180Evowel",
      expected: "https://example.com/mongolianvowel",
      description: "URL with Mongolian vowel separator (stripped)",
    },
    {
      url: "https://example.com/soft\u00ADhyphen",
      expected: "https://example.com/softhyphen",
      description: "URL with soft hyphen (stripped)",
    },
    {
      url: "https://example.com/hangul\u3164filler",
      expected: "https://example.com/hangulfiller",
      description: "URL with Hangul filler (stripped)",
    },
    {
      url: "https://example.com/" + "a".repeat(8193),
      expected: "about:blank",
      description: "Overly long URL",
    },
    {
      url: "https://notion.so\\attacker.com",
      expected: "https://notion.so/attacker.com",
      description: "Backslash normalization in authority",
    },
    {
      url: "https://notion。so",
      expected: "https://notion.so/",
      description: "Full-width character normalization",
    },
    {
      url: "https://user:pass@example.com",
      expected: "https://example.com/",
      description: "Strip credentials from absolute URL",
    },
    {
      url: "https://example.com.",
      expected: "https://example.com/",
      description: "Strip trailing dots from hostname in sanitizeUrl",
    },
  ],
  notionIdRegex: [
    { id: "01234567-89ab-cdef-0123-456789abcdef", expected: true, description: "Valid 36-char UUID" },
    { id: "0123456789abcdef0123456789abcdef", expected: true, description: "Valid 32-char hex ID" },
    { id: "0123456789abcdef0123456789abcde", expected: false, description: "Too short hex ID" },
    { id: "0123456789abcdef0123456789abcdef0", expected: false, description: "Too long hex ID" },
    { id: "01234567-89ab-cdef-0123-456789abcde", expected: false, description: "Malformed UUID (too short)" },
    { id: "01234567-89ab-cdef-0123-456789abcdef0", expected: false, description: "Malformed UUID (too long)" },
    { id: "01234567-89ab-cdef-0123-456789abc-ef", expected: false, description: "Malformed UUID (wrong dash position)" },
    { id: "0123456789ab-cdef-0123-456789abcdef", expected: false, description: "Malformed UUID (missing dash)" },
  ]
};

function runTests() {
  let failed = false;

  console.log("--- Testing isTrustedImageHost ---");
  for (const tc of testCases.isTrustedImageHost) {
    const actual = isTrustedImageHost(tc.url);
    if (actual !== tc.expected) {
      console.error(`❌ FAILED: ${tc.description}`);
      console.error(`   URL: ${tc.url}`);
      console.error(`   Expected: ${tc.expected}, Actual: ${actual}`);
      failed = true;
    } else {
      console.log(`✅ PASSED: ${tc.description}`);
    }
  }

  console.log("\n--- Testing sanitizeUrl ---");
  for (const tc of testCases.sanitizeUrl) {
    const actual = sanitizeUrl(tc.url);
    if (actual !== tc.expected) {
       console.error(`❌ FAILED: ${tc.description}`);
       console.error(`   URL: ${tc.url}`);
       console.error(`   Expected: ${tc.expected}, Actual: ${actual}`);
       failed = true;
    } else {
      console.log(`✅ PASSED: ${tc.description}`);
    }
  }

  console.log("\n--- Testing NOTION_ID_REGEX ---");
  for (const tc of testCases.notionIdRegex) {
    const actual = NOTION_ID_REGEX.test(tc.id);
    if (actual !== tc.expected) {
       console.error(`❌ FAILED: ${tc.description}`);
       console.error(`   ID: ${tc.id}`);
       console.error(`   Expected: ${tc.expected}, Actual: ${actual}`);
       failed = true;
    } else {
      console.log(`✅ PASSED: ${tc.description}`);
    }
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log("\n✨ All security tests passed!");
  }
}

// In a real environment with Vitest, we would use describe/it,
// but since we don't have it configured, we run this as a script.
if (require.main === module || !process.env.VITEST) {
    runTests();
}
