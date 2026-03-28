"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { trackEvent } from "@/lib/analytics";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const brandHref = pathname === "/" ? "#top" : "/";
  const { resolvedTheme, setTheme } = useTheme();

  // resolvedTheme is undefined until hydration; hide toggle until mounted
  const mounted = resolvedTheme !== undefined;
  const isDark = resolvedTheme === "dark";

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={brandHref} className="brand" aria-label="norinori1 top">
          <Image
            src="/norinori1-splash.svg"
            alt="norinori1 - Game Developer & Creator logo"
            className="brand-splash"
            width={520}
            height={52}
            priority
          />
        </Link>

        <div className="header-right">
          <nav id="site-nav" className={`site-nav ${isMenuOpen ? "open" : ""}`}>
            <Link
              href="/about"
              className="nav-link-icon"
              onClick={() => {
                setIsMenuOpen(false);
                trackEvent("header_nav_click", { nav_item: "about" });
              }}
            >
              <Image src="/about-icon.svg" alt="" width={36} height={36} aria-hidden="true" />
              <span className="nav-link-label">About</span>
            </Link>
            <Link
              href="/works"
              className="nav-link-icon"
              onClick={() => {
                setIsMenuOpen(false);
                trackEvent("header_nav_click", { nav_item: "works" });
              }}
            >
              <Image src="/works-icon.svg" alt="" width={36} height={36} aria-hidden="true" />
              <span className="nav-link-label">Works</span>
            </Link>
            <Link
              href="/news"
              className="nav-link-icon"
              onClick={() => {
                setIsMenuOpen(false);
                trackEvent("header_nav_click", { nav_item: "news" });
              }}
            >
              <Image src="/news-icon.svg" alt="" width={36} height={36} aria-hidden="true" />
              <span className="nav-link-label">News</span>
            </Link>
          </nav>

          {mounted && (
            <button
              className="theme-toggle"
              type="button"
              aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          )}

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-nav"
            aria-label="ナビゲーションを開閉"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
