"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const brandHref = pathname === "/" ? "#top" : "/";

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
      </div>
    </header>
  );
}
