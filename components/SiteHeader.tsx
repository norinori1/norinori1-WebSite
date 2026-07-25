"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { trackEvent } from "@/lib/analytics";
import { UIIcon } from "@/components/PlatformIcon";

const navItems = [
  { href: "/about", label: "About", icon: "/about-icon.svg", event: "about" },
  { href: "/works", label: "Works", icon: "/works-icon.svg", event: "works" },
  { href: "/news", label: "News", icon: "/news-icon.svg", event: "news" },
] as const;

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const brandHref = pathname === "/" ? "#top" : "/";
  const { resolvedTheme, setTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // resolvedTheme is undefined until hydration; hide toggle until mounted
  const mounted = resolvedTheme !== undefined;
  const isDark = resolvedTheme === "dark";

  // Watch a zero-height sentinel rather than listening to every scroll event.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Close the mobile drawer on Escape or a click outside it.
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    const handlePointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setIsMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMenuOpen]);

  // Navigating away should never leave the drawer open. Adjusting state during
  // render (rather than in an effect) avoids a second render pass.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsMenuOpen(false);
  }

  return (
    <>
      <header ref={headerRef} className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
        <div className="container header-inner">
          <Link href={brandHref} className="brand" aria-label="norinori1 top">
            <Image
              src="/norinori1-splash.svg"
              alt="norinori1 - Game Developer & Creator logo"
              className="brand-splash"
              width={220}
              height={52}
              priority
            />
          </Link>

          <div className="header-right">
            <nav id="site-nav" className={`site-nav${isMenuOpen ? " open" : ""}`}>
              {navItems.map(({ href, label, icon, event }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`nav-link${isActive ? " is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      setIsMenuOpen(false);
                      trackEvent("header_nav_click", { nav_item: event });
                    }}
                  >
                    <Image
                      src={icon}
                      alt=""
                      width={20}
                      height={20}
                      className="nav-link-icon"
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {mounted && (
              <button
                className="icon-btn"
                type="button"
                aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
                onClick={() => setTheme(isDark ? "light" : "dark")}
              >
                <span className="theme-toggle-icons">
                  <UIIcon
                    name="sun"
                    className={isDark ? "theme-icon-shown" : "theme-icon-hidden"}
                  />
                  <UIIcon
                    name="moon"
                    className={isDark ? "theme-icon-hidden" : "theme-icon-shown"}
                  />
                </span>
              </button>
            )}

            <button
              className="icon-btn menu-toggle"
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="site-nav"
              aria-label="ナビゲーションを開閉"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <UIIcon name={isMenuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>
      {/* Crossing this marks "scrolled past the header" for the sticky state. */}
      <div ref={sentinelRef} aria-hidden="true" style={{ position: "absolute", top: 0, height: 1 }} />
    </>
  );
}
