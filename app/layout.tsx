import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
    <html lang="ja">
      <body className="antialiased">
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
                gtag('config', '${gaMeasurementId}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true
                });
              `}
            </Script>
          </>
        ) : null}

        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
