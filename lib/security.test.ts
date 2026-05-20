import { sanitizeUrl, isTrustedImageHost } from "./security";

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
      url: "/../etc/passwd",
      expected: "about:blank",
      description: "Relative path with traversal",
    },
    {
      url: "/./safe",
      expected: "about:blank",
      description: "Relative path starting with dot (neutralized for safety)",
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
      url: "https://example.com/" + "a".repeat(8193),
      expected: "about:blank",
      description: "Overly long URL",
    },
    {
      url: "https://example.com/" + "\u3042".repeat(1000),
      expected: "about:blank",
      description: "URL that exceeds limit after URL encoding",
    },
    {
      url: "java\u2061script:alert(1)",
      expected: "about:blank",
      description: "Invisible mathematical operator in protocol",
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
      expected: "about:blank",
      description: "Reject credentials in absolute URL",
    },
    {
      url: "https://notion.so\t@attacker.com",
      expected: "about:blank",
      description: "Reject obfuscated credential bypass (tab)",
    },
    {
      url: "https://example.com.",
      expected: "https://example.com/",
      description: "Strip trailing dots from hostname in sanitizeUrl",
    },
    {
      url: "https:example.com",
      expected: "about:blank",
      description: "Reject single-colon http/https",
    },
    {
      url: "https\u00AD://example.com",
      expected: "https://example.com/",
      description: "Strip soft hyphen",
    },
    {
      url: "https://example.com/\u034F",
      expected: "https://example.com/",
      description: "Strip combining grapheme joiner",
    },
    {
      url: "https://example.com/\u115F\u1160\u3164\uFFA0",
      expected: "https://example.com/",
      description: "Strip Hangul fillers",
    },
    {
      url: "https://example.com/\u180E",
      expected: "https://example.com/",
      description: "Strip Mongolian vowel separator",
    },
    {
      url: "https://example.com/\u2000\u202F\u3000",
      expected: "https://example.com/",
      description: "Strip additional Unicode spaces",
    },
    {
      url: "https://example.com/\uFDD0\uFFFD\uFFFF",
      expected: "https://example.com/",
      description: "Strip non-characters and replacement character",
    },
    {
      url: "https://example.com/\u{E0001}\u{E0020}",
      expected: "https://example.com/",
      description: "Strip Tag characters",
    },
    {
      url: "java\u17B4script:alert(1)",
      expected: "about:blank",
      description: "Khmer invisible character U+17B4 in protocol",
    },
    {
      url: "java\u17B5script:alert(1)",
      expected: "about:blank",
      description: "Khmer invisible character U+17B5 in protocol",
    },
    {
      url: "https://example.com/\uFE00variation\uFE0Fselector",
      expected: "https://example.com/variationselector",
      description: "URL with variation selectors (stripped)",
    },
    {
      url: "https://example.com/\u{E0100}variant\u{E01EF}supp",
      expected: "https://example.com/variantsupp",
      description: "URL with variation selectors supplement (stripped)",
    },
    {
      url: "https://example.com/ogham\u1680space",
      expected: "https://example.com/oghamspace",
      description: "URL with Ogham space mark (stripped)",
    },
    {
      url: "https://example.com/braille\u2800blank",
      expected: "https://example.com/brailleblank",
      description: "URL with Braille pattern blank (stripped)",
    },
    {
      url: "https://example.com/annotation\uFFF9text\uFFFC",
      expected: "https://example.com/annotationtext",
      description: "URL with interlinear annotation and object replacement (stripped)",
    },
    {
      url: "/\uFF0Fattacker.com",
      expected: "about:blank",
      description: "Full-width slash bypass in relative path",
    },
    {
      url: "/\uFF3Cattacker.com",
      expected: "about:blank",
      description: "Full-width backslash bypass in relative path",
    },
    {
      url: "/\uFF0E\uFF0E/etc/passwd",
      expected: "about:blank",
      description: "Full-width dot bypass in relative path",
    },
    {
      url: "/\u2024\u2024/etc/passwd",
      expected: "about:blank",
      description: "One dot leader bypass in relative path",
    },
    {
      url: "/\u3002\u3002/etc/passwd",
      expected: "about:blank",
      description: "Ideographic full stop bypass in relative path",
    },
    {
      url: "/\u2044\u2044attacker.com",
      expected: "about:blank",
      description: "Fraction slash bypass in relative path",
    },
    {
      url: "/\u2215\u2215attacker.com",
      expected: "about:blank",
      description: "Division slash bypass in relative path",
    },
  ],
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
