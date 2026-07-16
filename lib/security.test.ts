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
    {
      url: null as unknown as string,
      expected: false,
      description: "Null input in isTrustedImageHost",
    },
    {
      url: 123 as unknown as string,
      expected: false,
      description: "Non-string input in isTrustedImageHost",
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
      url: "java\u2E0Bscript:alert(1)",
      expected: "about:blank",
      description: "Infix wedge in protocol",
    },
    {
      url: "java\u2E1Ascript:alert(1)",
      expected: "about:blank",
      description: "Hyphen with diaeresis in protocol",
    },
    {
      url: "java\u2E1Bscript:alert(1)",
      expected: "about:blank",
      description: "Siglum in protocol",
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
    {
      url: "/\u2216\u2216attacker.com",
      expected: "about:blank",
      description: "Set minus (slash-like) bypass in relative path",
    },
    {
      url: "/\u29F5\u29F5attacker.com",
      expected: "about:blank",
      description: "Reverse solidus operator bypass in relative path",
    },
    {
      url: "/\u29F8\u29F8attacker.com",
      expected: "about:blank",
      description: "Big solidus bypass in relative path",
    },
    {
      url: "/\u29F9\u29F9attacker.com",
      expected: "about:blank",
      description: "Big reverse solidus bypass in relative path",
    },
    {
      url: "/\u2025\u2025/etc/passwd",
      expected: "about:blank",
      description: "Two dot leader bypass in relative path",
    },
    {
      url: "/\u2026\u2026/etc/passwd",
      expected: "about:blank",
      description: "Horizontal ellipsis bypass in relative path",
    },
    {
      url: "/\uFE52\uFE52/etc/passwd",
      expected: "about:blank",
      description: "Small full stop bypass in relative path",
    },
    {
      url: "/\uFF61\uFF61/etc/passwd",
      expected: "about:blank",
      description: "Halfwidth ideographic full stop bypass in relative path",
    },
    {
      url: "java\u061Cscript:alert(1)",
      expected: "about:blank",
      description: "Arabic Letter Mark in protocol",
    },
    {
      url: "https://example.com/\u180Bvariation\u180Fselector",
      expected: "https://example.com/variationselector",
      description: "Mongolian variation selectors (stripped)",
    },
    {
      url: "/\u2027\u2027/etc/passwd",
      expected: "about:blank",
      description: "Hyphenation point bypass in relative path",
    },
    {
      url: "/\u06D4\u06D4/etc/passwd",
      expected: "about:blank",
      description: "Arabic full stop bypass in relative path",
    },
    {
      url: "/\u166E\u166E/etc/passwd",
      expected: "about:blank",
      description: "Canadian syllabics full stop bypass in relative path",
    },
    {
      url: "/\u1803\u1803/etc/passwd",
      expected: "about:blank",
      description: "Mongolian full stop bypass in relative path",
    },
    {
      url: "/\u1809\u1809/etc/passwd",
      expected: "about:blank",
      description: "Mongolian Manchu full stop bypass in relative path",
    },
    {
      url: "/\uA4F8\uA4F8/etc/passwd",
      expected: "about:blank",
      description: "Lisu letter tone mya jeu bypass in relative path",
    },
    {
      url: "/\uA60E\uA60E/etc/passwd",
      expected: "about:blank",
      description: "Vai full stop bypass in relative path",
    },
    {
      url: "/\u2E3C\u2E3C/etc/passwd",
      expected: "about:blank",
      description: "Stenographic full stop bypass in relative path",
    },
    {
      url: "/\u2E33\u2E33/etc/passwd",
      expected: "about:blank",
      description: "Raised dot bypass in relative path",
    },
    {
      url: "/\u0701\u0701/etc/passwd",
      expected: "about:blank",
      description: "Syriac supralinear full stop bypass in relative path",
    },
    {
      url: "/\u0702\u0702/etc/passwd",
      expected: "about:blank",
      description: "Syriac sublinear full stop bypass in relative path",
    },
    {
      url: "/\u10FB\u10FB/etc/passwd",
      expected: "about:blank",
      description: "Georgian paragraph separator bypass in relative path",
    },
    {
      url: "https://example.com/non\u00A0breaking\u00A0space",
      expected: "https://example.com/nonbreakingspace",
      description: "Strip non-breaking space (U+00A0)",
    },
    {
      url: "https://example.com/ethiopic\u1361wordspace",
      expected: "https://example.com/ethiopic%E1%8D%A1wordspace",
      description: "Visible Ethiopic wordspace (U+1361) is preserved and encoded in absolute URL",
    },
    {
      url: "https://example.com/aegean\u{10101}separator",
      expected: "https://example.com/aegean%F0%90%84%81separator",
      description: "Visible Aegean word separator dot (U+10101) is preserved and encoded in absolute URL",
    },
    {
      url: "https://example.com/middle\u2E31dot",
      expected: "https://example.com/middle%E2%B8%B1dot",
      description: "Visible word separator middle dot (U+2E31) is preserved and encoded in absolute URL",
    },
    {
      url: "https://example.com/ring\u2E30point",
      expected: "https://example.com/ring%E2%B8%B0point",
      description: "Visible ring point (U+2E30) is preserved and encoded in absolute URL",
    },
    {
      url: "https://example.com/aegean\u{10100}line",
      expected: "https://example.com/aegean%F0%90%84%80line",
      description: "Visible Aegean word separator line (U+10100) is preserved and encoded in absolute URL",
    },
    {
      url: "https://example.com/aegean\u{10102}check",
      expected: "https://example.com/aegean%F0%90%84%82check",
      description: "Visible Aegean check mark (U+10102) is preserved and encoded in absolute URL",
    },
    {
      url: "/\u1362\u1362/etc/passwd",
      expected: "about:blank",
      description: "Ethiopic full stop bypass in relative path",
    },
    {
      url: "/\u00B7\u00B7/etc/passwd",
      expected: "about:blank",
      description: "Middle dot bypass in relative path",
    },
    {
      url: "/\u02D9\u02D9/etc/passwd",
      expected: "about:blank",
      description: "Dot above bypass in relative path",
    },
    {
      url: "/\u0387\u0387/etc/passwd",
      expected: "about:blank",
      description: "Greek ano teleia bypass in relative path",
    },
    {
      url: "/\u0589\u0589/etc/passwd",
      expected: "about:blank",
      description: "Armenian full stop bypass in relative path",
    },
    {
      url: "/\u05C9\u05C9/etc/passwd",
      expected: "about:blank",
      description: "Hebrew holam bypass in relative path",
    },
    {
      url: "/\u05C8\u05C8/etc/passwd",
      expected: "about:blank",
      description: "Hebrew qamets qatan bypass in relative path",
    },
    {
      url: "/%2f/attacker.com",
      expected: "about:blank",
      description: "URL-encoded slash bypass in relative path",
    },
    {
      url: "/%2F/attacker.com",
      expected: "about:blank",
      description: "URL-encoded slash bypass in relative path (uppercase)",
    },
    {
      url: "/%5cattacker.com",
      expected: "about:blank",
      description: "URL-encoded backslash bypass in relative path",
    },
    {
      url: "/%2e%2e/etc/passwd",
      expected: "about:blank",
      description: "URL-encoded dot bypass in relative path (traversal)",
    },
    {
      url: "/%09/attacker.com",
      expected: "about:blank",
      description: "URL-encoded tab bypass in relative path",
    },
    {
      url: "/%0a/attacker.com",
      expected: "about:blank",
      description: "URL-encoded newline bypass in relative path",
    },
    {
      url: "/%0D/attacker.com",
      expected: "about:blank",
      description: "URL-encoded carriage return bypass in relative path",
    },
    {
      url: "/%20/attacker.com",
      expected: "about:blank",
      description: "URL-encoded space bypass in relative path",
    },
    {
      url: "/%00/attacker.com",
      expected: "about:blank",
      description: "URL-encoded null bypass in relative path",
    },
    {
      url: "/%1f/attacker.com",
      expected: "about:blank",
      description: "URL-encoded control char (US) bypass in relative path",
    },
    {
      url: "/\uFE68attacker.com",
      expected: "about:blank",
      description: "Small reverse solidus bypass in relative path",
    },
    {
      url: "/\uFE12/etc/passwd",
      expected: "about:blank",
      description: "Vertical full stop bypass in relative path",
    },
    {
      url: "/\u2219\u2219/etc/passwd",
      expected: "about:blank",
      description: "Bullet operator bypass in relative path",
    },
    {
      url: "/\u22C5\u22C5/etc/passwd",
      expected: "about:blank",
      description: "Dot operator bypass in relative path",
    },
    {
      url: "/\u2022\u2022/etc/passwd",
      expected: "about:blank",
      description: "Bullet bypass in relative path",
    },
    {
      url: "/\u05B9\u05B9/etc/passwd",
      expected: "about:blank",
      description: "Hebrew holam (dot-like) bypass in relative path",
    },
    {
      url: "/\u05BC\u05BC/etc/passwd",
      expected: "about:blank",
      description: "Hebrew dagesh (dot-like) bypass in relative path",
    },
    {
      url: "/\u2E30\u2E30/etc/passwd",
      expected: "about:blank",
      description: "Word separator bar (dot-like) bypass in relative path",
    },
    {
      url: "/\u05BA\u05BA/etc/passwd",
      expected: "about:blank",
      description: "Hebrew holam haser (dot-like) bypass in relative path",
    },
    {
      url: "/\u05BB\u05BB/etc/passwd",
      expected: "about:blank",
      description: "Hebrew qubuts (dot-like) bypass in relative path",
    },
    {
      url: "/\u0660\u0660/etc/passwd",
      expected: "about:blank",
      description: "Arabic-Indic digit zero (dot-like) bypass in relative path",
    },
    {
      url: "/\u06F0\u06F0/etc/passwd",
      expected: "about:blank",
      description: "Extended Arabic-Indic digit zero (dot-like) bypass in relative path",
    },
    {
      url: "/\u2023\u2023/etc/passwd",
      expected: "about:blank",
      description: "Triangular bullet (dot-like) bypass in relative path",
    },
    {
      url: "/\u2043\u2043/etc/passwd",
      expected: "about:blank",
      description: "Hyphen bullet (dot-like) bypass in relative path",
    },
    {
      url: "/\u05B0\u05B0/etc/passwd",
      expected: "about:blank",
      description: "Hebrew sheva (dot-like) bypass in relative path",
    },
    {
      url: "/\u05B1\u05B1/etc/passwd",
      expected: "about:blank",
      description: "Hebrew hataf segol (dot-like) bypass in relative path",
    },
    {
      url: "/\u05B4\u05B4/etc/passwd",
      expected: "about:blank",
      description: "Hebrew hiriq (dot-like) bypass in relative path",
    },
    {
      url: "/\u05C4\u05C4/etc/passwd",
      expected: "about:blank",
      description: "Hebrew upper dot (dot-like) bypass in relative path",
    },
    {
      url: "/\u05C5\u05C5/etc/passwd",
      expected: "about:blank",
      description: "Hebrew lower dot (dot-like) bypass in relative path",
    },
    {
      url: "/\u2052/attacker.com",
      expected: "about:blank",
      description: "Commercial minus sign bypass in relative path",
    },
    {
      url: "/\u16EB\u16EB/etc/passwd",
      expected: "about:blank",
      description: "Runic single punctuation bypass in relative path",
    },
    {
      url: "/\u16EC\u16EC/etc/passwd",
      expected: "about:blank",
      description: "Runic multiple punctuation bypass in relative path",
    },
    {
      url: "/\u16ED\u16ED/etc/passwd",
      expected: "about:blank",
      description: "Runic cross punctuation bypass in relative path",
    },
    {
      url: "/\u2E37\u2E37/etc/passwd",
      expected: "about:blank",
      description: "Word separator double dot bypass in relative path",
    },
    {
      url: "/\u2E38\u2E38/etc/passwd",
      expected: "about:blank",
      description: "Word separator triple dot bypass in relative path",
    },
    {
      url: "/\u2E39\u2E39/etc/passwd",
      expected: "about:blank",
      description: "Word separator quadruple dot bypass in relative path",
    },
    {
      url: "/\u22EE\u22EE/etc/passwd",
      expected: "about:blank",
      description: "Vertical ellipsis bypass in relative path",
    },
    {
      url: "/\u22EF\u22EF/etc/passwd",
      expected: "about:blank",
      description: "Midline horizontal ellipsis bypass in relative path",
    },
    {
      url: "/\u22F0\u22F0/etc/passwd",
      expected: "about:blank",
      description: "Up right diagonal ellipsis bypass in relative path",
    },
    {
      url: "/\u22F1\u22F1/etc/passwd",
      expected: "about:blank",
      description: "Down right diagonal ellipsis bypass in relative path",
    },
    {
      url: "/\u060D\u060D/etc/passwd",
      expected: "about:blank",
      description: "Arabic date separator bypass in relative path",
    },
    {
      url: "/\u05B7\u05B7/etc/passwd",
      expected: "about:blank",
      description: "Hebrew point patah bypass in relative path",
    },
    {
      url: "/\u05B8\u05B8/etc/passwd",
      expected: "about:blank",
      description: "Hebrew point qamets bypass in relative path",
    },
    {
      url: "/\u05C7\u05C7/etc/passwd",
      expected: "about:blank",
      description: "Hebrew point qamets qatan bypass in relative path (alt)",
    },
    {
      url: "/\u205A\u205A/etc/passwd",
      expected: "about:blank",
      description: "Two dot punctuation bypass in relative path",
    },
    {
      url: "/\u205B\u205B/etc/passwd",
      expected: "about:blank",
      description: "Four dot mark bypass in relative path",
    },
    {
      url: "/\u205C\u205C/etc/passwd",
      expected: "about:blank",
      description: "Dotted cross bypass in relative path",
    },
    {
      url: "/\u205D\u205D/etc/passwd",
      expected: "about:blank",
      description: "Tricolon bypass in relative path",
    },
    {
      url: "/%7f/attacker.com",
      expected: "about:blank",
      description: "URL-encoded DEL bypass in relative path",
    },
    {
      url: "/%252f/attacker.com",
      expected: "about:blank",
      description: "URL-encoded percent bypass in relative path",
    },
    {
      url: "/\u066B\u066B/etc/passwd",
      expected: "about:blank",
      description: "Arabic decimal separator bypass in relative path",
    },
    {
      url: "/\u066C\u066C/etc/passwd",
      expected: "about:blank",
      description: "Arabic thousands separator bypass in relative path",
    },
    {
      url: "/\u205E\u205E/etc/passwd",
      expected: "about:blank",
      description: "Vertical four dots bypass in relative path",
    },
    {
      url: "/\u2056\u2056/etc/passwd",
      expected: "about:blank",
      description: "Three dot punctuation bypass in relative path",
    },
    {
      url: "/\u2058\u2058/etc/passwd",
      expected: "about:blank",
      description: "Four dot punctuation bypass in relative path",
    },
    {
      url: "/\u2059\u2059/etc/passwd",
      expected: "about:blank",
      description: "Five dot punctuation bypass in relative path",
    },
    {
      url: "/\u2E2C\u2E2C/etc/passwd",
      expected: "about:blank",
      description: "Squared four dot punctuation bypass in relative path",
    },
    {
      url: "/\u2E2D\u2E2D/etc/passwd",
      expected: "about:blank",
      description: "Five dot mark bypass in relative path",
    },
    {
      url: "/\u2E3D\u2E3D/etc/passwd",
      expected: "about:blank",
      description: "Vertical six dots bypass in relative path",
    },
    {
      url: "/\u2E48\u2E48/etc/passwd",
      expected: "about:blank",
      description: "Low kavyka with dot bypass in relative path",
    },
    {
      url: "/\u2E4A\u2E4Aattacker.com",
      expected: "about:blank",
      description: "Dotted solidus bypass in relative path",
    },
    {
      url: "java\u2E32script:alert(1)",
      expected: "about:blank",
      description: "Visible turned comma in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E34script:alert(1)",
      expected: "about:blank",
      description: "Visible raised comma in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E35script:alert(1)",
      expected: "about:blank",
      description: "Visible turned semicolon in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E49script:alert(1)",
      expected: "about:blank",
      description: "Visible double stacked comma in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u204Fscript:alert(1)",
      expected: "about:blank",
      description: "Visible reversed semicolon in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E1Dscript:alert(1)",
      expected: "about:blank",
      description: "Visible right low paraphrase bracket in protocol is NOT stripped and causes failure",
    },
    {
      url: "https\u2E1C://example.com",
      expected: "about:blank",
      description: "Visible left low paraphrase bracket in protocol is NOT stripped and causes failure",
    },
    {
      url: "/\u2E3E\u2E3E/etc/passwd",
      expected: "about:blank",
      description: "Vertical five dots bypass in relative path",
    },
    {
      url: "/\u2E41\u2E41/etc/passwd",
      expected: "about:blank",
      description: "Reversed comma with dot bypass in relative path",
    },
    {
      url: "/\u2E5D\u2E5D/etc/passwd",
      expected: "about:blank",
      description: "Dotted vertical bar bypass in relative path",
    },
    {
      url: "/\u2AFD\u2AFDattacker.com",
      expected: "about:blank",
      description: "Double solidus operator bypass in relative path",
    },
    {
      url: "/\u2AFE\u2AFEattacker.com",
      expected: "about:blank",
      description: "Triple solidus operator bypass in relative path",
    },
    {
      url: "/\u2E2A\u2E2A/etc/passwd",
      expected: "about:blank",
      description: "Two dots over one dot punctuation bypass in relative path",
    },
    {
      url: "/\u2E2B\u2E2B/etc/passwd",
      expected: "about:blank",
      description: "Three dots over one dot punctuation bypass in relative path",
    },
    {
      url: "/\u2E51\u2E51/etc/passwd",
      expected: "about:blank",
      description: "Low asterisk bypass in relative path",
    },
    {
      url: "/\u2E5A\u2E5A/etc/passwd",
      expected: "about:blank",
      description: "Dotted square bypass in relative path",
    },
    {
      url: "/\u2E5B\u2E5B/etc/passwd",
      expected: "about:blank",
      description: "Dotted circle bypass in relative path",
    },
    {
      url: "/\u2E5C\u2E5C/etc/passwd",
      expected: "about:blank",
      description: "Dotted diamond bypass in relative path",
    },
    {
      url: "/\u061E\u061E/etc/passwd",
      expected: "about:blank",
      description: "Arabic triple dot punctuation bypass in relative path",
    },
    {
      url: "/\u0700\u0700/etc/passwd",
      expected: "about:blank",
      description: "Syriac end of paragraph bypass in relative path",
    },
    {
      url: "/\u0703\u0703/etc/passwd",
      expected: "about:blank",
      description: "Syriac colon bypass in relative path",
    },
    {
      url: "/\u1365\u1365/etc/passwd",
      expected: "about:blank",
      description: "Ethiopic semicolon bypass in relative path",
    },
    {
      url: "/\u1366\u1366/etc/passwd",
      expected: "about:blank",
      description: "Ethiopic colon bypass in relative path",
    },
    {
      url: "/\u16EE\u16EE/etc/passwd",
      expected: "about:blank",
      description: "Runic belthone punctuation bypass in relative path",
    },
    {
      url: "/\u2E44\u2E44/etc/passwd",
      expected: "about:blank",
      description: "Double suspension dot bypass in relative path",
    },
    {
      url: "/\u2E46\u2E46/etc/passwd",
      expected: "about:blank",
      description: "Inverted low kavyka with dot bypass in relative path",
    },
    {
      url: "/\u2E4B\u2E4Battacker.com",
      expected: "about:blank",
      description: "Virgule with middle dot bypass in relative path",
    },
    {
      url: "/\u2E4C\u2E4C/etc/passwd",
      expected: "about:blank",
      description: "Five-dot mark bypass in relative path",
    },
    {
      url: "/\u2E4D\u2E4Dattacker.com",
      expected: "about:blank",
      description: "Two-dotted virgule bypass in relative path",
    },
    {
      url: "/\u2E4E\u2E4Eattacker.com",
      expected: "about:blank",
      description: "Punctuation virgule with positive slope bypass in relative path",
    },
    {
      url: "/\u2E4F\u2E4F/etc/passwd",
      expected: "about:blank",
      description: "Triple-dotted punctuation bypass in relative path",
    },
    {
      url: "/\u2E52\u2E52/etc/passwd",
      expected: "about:blank",
      description: "Tilde with dot above bypass in relative path",
    },
    {
      url: "/\u2051\u2051/etc/passwd",
      expected: "about:blank",
      description: "Two dot punctuation bypass in relative path (alt)",
    },
    {
      url: "/\u2E50\u2E50/etc/passwd",
      expected: "about:blank",
      description: "Cross punti bypass in relative path",
    },
    {
      url: "/\u2E53\u2E53/etc/passwd",
      expected: "about:blank",
      description: "Medieval comma bypass in relative path",
    },
    {
      url: "/\u0704\u0704/etc/passwd",
      expected: "about:blank",
      description: "Syriac dotted colon bypass in relative path",
    },
    {
      url: "/\u0705\u0705/etc/passwd",
      expected: "about:blank",
      description: "Syriac vertical colon bypass in relative path",
    },
    {
      url: "/\u0706\u0706/etc/passwd",
      expected: "about:blank",
      description: "Syriac horizontal colon bypass in relative path",
    },
    {
      url: "/\u0707\u0707/etc/passwd",
      expected: "about:blank",
      description: "Syriac oblique colon bypass in relative path",
    },
    {
      url: "/\u0708\u0708/etc/passwd",
      expected: "about:blank",
      description: "Syriac music mark bypass in relative path",
    },
    {
      url: "/\u0709\u0709/etc/passwd",
      expected: "about:blank",
      description: "Syriac music mark alt bypass in relative path",
    },
    {
      url: "/\u2CF9\u2CF9/etc/passwd",
      expected: "about:blank",
      description: "Coptic full stop bypass in relative path",
    },
    {
      url: "/\u2CFA\u2CFA/etc/passwd",
      expected: "about:blank",
      description: "Coptic semicolon bypass in relative path",
    },
    {
      url: "/\u2D70\u2D70/etc/passwd",
      expected: "about:blank",
      description: "Tifinagh separator mark bypass in relative path",
    },
    {
      url: "/\uA4FF\uA4FF/etc/passwd",
      expected: "about:blank",
      description: "Lisu punctuation full stop bypass in relative path",
    },
    {
      url: "/\u2E01\u2E01/etc/passwd",
      expected: "about:blank",
      description: "Right angle dotted substitution marker bypass in relative path",
    },
    {
      url: "/\u2E04\u2E04/etc/passwd",
      expected: "about:blank",
      description: "Left dotted substitution bracket bypass in relative path",
    },
    {
      url: "/\u2E05\u2E05/etc/passwd",
      expected: "about:blank",
      description: "Right dotted substitution bracket bypass in relative path",
    },
    {
      url: "/\u2E07\u2E07/etc/passwd",
      expected: "about:blank",
      description: "Raised dotted interpolation marker bypass in relative path",
    },
    {
      url: "/\u2E08\u2E08/etc/passwd",
      expected: "about:blank",
      description: "Dotted transposition marker bypass in relative path",
    },
    {
      url: "/\u2E13\u2E13/etc/passwd",
      expected: "about:blank",
      description: "Dotted obelos bypass in relative path",
    },
    {
      url: "/\u2E16\u2E16/etc/passwd",
      expected: "about:blank",
      description: "Dotted right-pointing angle bypass in relative path",
    },
    {
      url: "/\u2E1E\u2E1E/etc/passwd",
      expected: "about:blank",
      description: "Tilde with dot above bypass in relative path",
    },
    {
      url: "/\u2E1F\u2E1F/etc/passwd",
      expected: "about:blank",
      description: "Tilde with dot below bypass in relative path",
    },
    {
      url: "/\u2E17\u2E17attacker.com",
      expected: "about:blank",
      description: "Oblique slant bypass in relative path",
    },
    {
      url: "/\u2E09\u2E09attacker.com",
      expected: "about:blank",
      description: "Left transcription bracket bypass in relative path",
    },
    {
      url: "/\u2E0A\u2E0Aattacker.com",
      expected: "about:blank",
      description: "Right transcription bracket bypass in relative path",
    },
    {
      url: "/\u2E0C\u2E0Cattacker.com",
      expected: "about:blank",
      description: "Raised wedge bypass in relative path",
    },
    {
      url: "/\u2E0D\u2E0Dattacker.com",
      expected: "about:blank",
      description: "Low wedge bypass in relative path",
    },
    {
      url: "/\u2E12\u2E12attacker.com",
      expected: "about:blank",
      description: "Dotted reversed comma bypass in relative path",
    },
    {
      url: "/\u2E18\u2E18attacker.com",
      expected: "about:blank",
      description: "Inverted interrogation mark bypass in relative path",
    },
    {
      url: "/\u2E19\u2E19attacker.com",
      expected: "about:blank",
      description: "Palm branch bypass in relative path",
    },
    {
      url: "/\u{10290}\u{10290}attacker.com",
      expected: "about:blank",
      description: "Carian word separator line bypass in relative path",
    },
    {
      url: "/\u{12470}\u{12470}attacker.com",
      expected: "about:blank",
      description: "Cuneiform punctuation sign samane bypass in relative path",
    },
    {
      url: "/%80/attacker.com",
      expected: "about:blank",
      description: "URL-encoded C1 control (0x80) bypass in relative path",
    },
    {
      url: "/%9f/attacker.com",
      expected: "about:blank",
      description: "URL-encoded C1 control (0x9f) bypass in relative path",
    },
    {
      url: "/%a0/attacker.com",
      expected: "about:blank",
      description: "URL-encoded non-breaking space (0xa0) bypass in relative path",
    },
    {
      url: "/\u1804\u1804/etc/passwd",
      expected: "about:blank",
      description: "Mongolian colon bypass in relative path",
    },
    {
      url: "/\u1805\u1805/etc/passwd",
      expected: "about:blank",
      description: "Mongolian four dots bypass in relative path",
    },
    {
      url: "/\u2E54\u2E54/etc/passwd",
      expected: "about:blank",
      description: "One dot over two dots punctuation bypass in relative path",
    },
    {
      url: "/\u2E55\u2E55/etc/passwd",
      expected: "about:blank",
      description: "Two dots over one dot punctuation (alt) bypass in relative path",
    },
    {
      url: "/\u2E56\u2E56/etc/passwd",
      expected: "about:blank",
      description: "Three dots over one dot punctuation (alt) bypass in relative path",
    },
    {
      url: "/\u2E57\u2E57/etc/passwd",
      expected: "about:blank",
      description: "Four dots over one dot punctuation bypass in relative path",
    },
    {
      url: "/\u2E58\u2E58/etc/passwd",
      expected: "about:blank",
      description: "Five dots over one dot punctuation (alt) bypass in relative path",
    },
    {
      url: "/\u2E59\u2E59/etc/passwd",
      expected: "about:blank",
      description: "Six dots over one dot punctuation bypass in relative path",
    },
    {
      url: "/\u2CFB\u2CFB/etc/passwd",
      expected: "about:blank",
      description: "Coptic old nubian full stop bypass in relative path",
    },
    {
      url: "/\u2CFC\u2CFC/etc/passwd",
      expected: "about:blank",
      description: "Coptic old nubian semicolon bypass in relative path",
    },
    {
      url: "/\u2CFD\u2CFD/etc/passwd",
      expected: "about:blank",
      description: "Coptic old nubian comma bypass in relative path",
    },
    {
      url: "/\u2CFE\u2CFE/etc/passwd",
      expected: "about:blank",
      description: "Coptic old nubian full stop with curled tail bypass in relative path",
    },
    {
      url: "/\u2CFF\u2CFF/etc/passwd",
      expected: "about:blank",
      description: "Coptic morphological divider bypass in relative path",
    },
    {
      url: "/\u1363\u1363/etc/passwd",
      expected: "about:blank",
      description: "Ethiopic comma bypass in relative path",
    },
    {
      url: "/\u1364\u1364/etc/passwd",
      expected: "about:blank",
      description: "Ethiopic semicolon bypass in relative path",
    },
    {
      url: "/\u1367\u1367/etc/passwd",
      expected: "about:blank",
      description: "Ethiopic question mark bypass in relative path",
    },
    {
      url: "/\u1368\u1368/etc/passwd",
      expected: "about:blank",
      description: "Ethiopic paragraph separator bypass in relative path",
    },
    {
      url: "/\u05C0\u05C0/etc/passwd",
      expected: "about:blank",
      description: "Hebrew punctuation paseq bypass in relative path",
    },
    {
      url: "/\u05C3\u05C3/etc/passwd",
      expected: "about:blank",
      description: "Hebrew punctuation sof pasuq bypass in relative path",
    },
    {
      url: "/\u05C6\u05C6/etc/passwd",
      expected: "about:blank",
      description: "Hebrew punctuation nun hafukha bypass in relative path",
    },
    {
      url: "/\u066D\u066D/etc/passwd",
      expected: "about:blank",
      description: "Arabic five pointed star bypass in relative path",
    },
    {
      url: "/\u070A\u070A/etc/passwd",
      expected: "about:blank",
      description: "Syriac contraction bypass in relative path",
    },
    {
      url: "/\u070B\u070B/etc/passwd",
      expected: "about:blank",
      description: "Syriac harklean asteriscus bypass in relative path",
    },
    {
      url: "/\u070C\u070C/etc/passwd",
      expected: "about:blank",
      description: "Syriac harklean obelus bypass in relative path",
    },
    {
      url: "/\u070D\u070D/etc/passwd",
      expected: "about:blank",
      description: "Syriac harklean metobelus bypass in relative path",
    },
    {
      url: "/\u070E\u070E/etc/passwd",
      expected: "about:blank",
      description: "Syriac punctuation bypass in relative path",
    },
    {
      url: "java\u070Fscript:alert(1)",
      expected: "about:blank",
      description: "Visible Syriac abbreviation mark in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E40script:alert(1)",
      expected: "about:blank",
      description: "Visible double hyphen in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E01script:alert(1)",
      expected: "about:blank",
      description: "Visible right angle dotted substitution marker in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E04script:alert(1)",
      expected: "about:blank",
      description: "Visible left dotted substitution bracket in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E05script:alert(1)",
      expected: "about:blank",
      description: "Visible right dotted substitution bracket in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E07script:alert(1)",
      expected: "about:blank",
      description: "Visible raised dotted interpolation marker in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E08script:alert(1)",
      expected: "about:blank",
      description: "Visible dotted transposition marker in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E13script:alert(1)",
      expected: "about:blank",
      description: "Visible dotted obelos in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E16script:alert(1)",
      expected: "about:blank",
      description: "Visible dotted right-pointing angle in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E1Escript:alert(1)",
      expected: "about:blank",
      description: "Visible tilde with dot above in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E1Fscript:alert(1)",
      expected: "about:blank",
      description: "Visible tilde with dot below in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E17script:alert(1)",
      expected: "about:blank",
      description: "Visible oblique slant in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E09script:alert(1)",
      expected: "about:blank",
      description: "Visible left transcription bracket in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E0Ascript:alert(1)",
      expected: "about:blank",
      description: "Visible right transcription bracket in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E0Cscript:alert(1)",
      expected: "about:blank",
      description: "Visible raised wedge in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E0Dscript:alert(1)",
      expected: "about:blank",
      description: "Visible low wedge in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E12script:alert(1)",
      expected: "about:blank",
      description: "Visible dotted reversed comma in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E18script:alert(1)",
      expected: "about:blank",
      description: "Visible inverted interrogation mark in protocol is NOT stripped and causes failure",
    },
    {
      url: "java\u2E19script:alert(1)",
      expected: "about:blank",
      description: "Visible palm branch in protocol is NOT stripped and causes failure",
    },
    {
      url: null as unknown as string,
      expected: "",
      description: "Null input in sanitizeUrl",
    },
    {
      url: undefined as unknown as string,
      expected: "",
      description: "Undefined input in sanitizeUrl",
    },
    {
      url: {} as unknown as string,
      expected: "",
      description: "Object input in sanitizeUrl",
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
