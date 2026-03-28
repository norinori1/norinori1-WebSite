"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const SCROLL_MILESTONES = [25, 50, 75, 90];

export default function Analytics() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  // SPA ページビュートラッキング: ルート変更のたびに page_view を送信
  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return;
    // 初回マウント時・パス変更時にページビューを送信
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    window.gtag("config", GA_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  // スクロール深度トラッキング: パスが変わるたびにリセット
  useEffect(() => {
    if (!GA_ID) return;

    const fired = new Set<number>();

    function handleScroll() {
      if (typeof window.gtag !== "function") return;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone && !fired.has(milestone)) {
          fired.add(milestone);
          window.gtag("event", "scroll_depth", {
            percent_scrolled: milestone,
            page_path: pathname,
            event_category: "engagement",
          });
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}
