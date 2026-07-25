"use client";

import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import PlatformIcon, { type IconName } from "@/components/PlatformIcon";

const socialLinks: { name: string; url: string; icon: IconName }[] = [
  { name: "X (Twitter)", url: "https://x.com/norinori1_", icon: "x" },
  { name: "GitHub", url: "https://github.com/norinori1", icon: "github" },
  { name: "itch.io", url: "https://norinori1.itch.io", icon: "itchio" },
];

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Works", href: "/works" },
  { name: "News", href: "/news" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section className="footer-brand">
          <Image src="/norinori1-icon.svg" alt="" width={56} height={56} aria-hidden="true" />
          <h3>norinori1</h3>
          <p>
            Unity・Roblox・Scratch を中心に、ゲームと開発ツールをつくっています。
          </p>
        </section>

        <section>
          <h4>Navigation</h4>
          <ul>
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() =>
                    trackEvent("footer_link_click", { link_text: item.name.toLowerCase() })
                  }
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4>Follow</h4>
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
                  <PlatformIcon name={item.icon} size={16} />
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
