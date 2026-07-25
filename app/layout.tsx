import type { Metadata } from "next";
import Script from "next/script";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Analytics from "@/components/Analytics";
import HeroBackground from "@/components/HeroBackground";

// Self-hosted by next/font: no render-blocking request to fonts.googleapis.com,
// and no layout shift. Exposed as CSS variables consumed by app/globals.css.
const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://norinori1.vercel.app";
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: "norinori1 - Game Developer Portfolio",
  description:
    "norinori1のゲーム開発ポートフォリオ。Unity、Roblox、Scratchで制作した作品と開発情報を掲載。",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "7izBKgNjfv2fnCsxV4yAybuEfLM0VSu_W0WevtUl4_s",
  },
  openGraph: {
    title: "norinori1 - Game Developer Portfolio",
    description:
      "複数プラットフォームで活動するゲーム開発者のポートフォリオサイト。",
    url: siteUrl,
    siteName: "norinori1 Portfolio",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@norinori1_",
    title: "norinori1 - Game Developer Portfolio",
    description:
      "Unity、Roblox、Scratchを中心にしたゲーム開発ポートフォリオ。",
  },
};

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "norinori1",
  url: siteUrl,
  sameAs: [
    "https://github.com/norinori1",
    "https://x.com/norinori1_",
    "https://norinori1.itch.io",
  ],
  jobTitle: "Game Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider>
          <HeroBackground />
          {gaMeasurementId ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
                strategy="afterInteractive"
              />
              <Script id="ga4-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', ${JSON.stringify(gaMeasurementId).replace(/</g, "\\u003c")}, {
                    send_page_view: false
                  });
                `}
              </Script>
              <Analytics />
            </>
          ) : null}

          <Script
            id="schema-person"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(personStructuredData).replace(/</g, "\\u003c"),
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
