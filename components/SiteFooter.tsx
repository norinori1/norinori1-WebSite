"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

const socialLinks = [
  { name: "Twitter/X", url: "https://x.com/norinori1_" },
  { name: "GitHub", url: "https://github.com/norinori1" },
  { name: "itch.io", url: "https://norinori1.itch.io" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h3>norinori1</h3>
          <p>ゲーム開発者・クリエイター</p>
        </section>
        <section>
          <h3>Navigation</h3>
          <ul>
            <li>
              <Link
                href="/about"
                onClick={() =>
                  trackEvent("footer_link_click", { link_text: "about" })
                }
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/works"
                onClick={() =>
                  trackEvent("footer_link_click", { link_text: "works" })
                }
              >
                Works
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                onClick={() =>
                  trackEvent("footer_link_click", { link_text: "news" })
                }
              >
                News
              </Link>
            </li>
          </ul>
        </section>
        <section>
          <h3>Follow</h3>
          <ul>
            {socialLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("social_link_click", {
                      platform: item.name,
                      event_category: "outbound",
                    })
                  }
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="copyright">© 2026 norinori1</p>
    </footer>
  );
}
