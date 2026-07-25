"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const tweetText = encodeURIComponent(`${title} – norinori1`);
  const tweetUrl = encodeURIComponent(url);
  const twitterHref = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      trackEvent("share", {
        method: "copy_link",
        content_type: "page",
        item_id: url,
        event_category: "engagement",
      });
    } catch {
      // clipboard unavailable (non-secure context etc.)
    }
  };

  return (
    <div className="share-row">
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn"
        onClick={() =>
          trackEvent("share", {
            method: "twitter",
            content_type: "page",
            item_id: url,
            event_category: "engagement",
          })
        }
        aria-label="X (Twitter) でシェア"
      >
        {/* X / Twitter icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X でシェア
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className={`share-btn${copied ? " is-done" : ""}`}
        aria-label="リンクをコピー"
      >
        {copied ? (
          <>
            {/* Checkmark icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            コピーしました
          </>
        ) : (
          <>
            {/* Link icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            リンクをコピー
          </>
        )}
      </button>
    </div>
  );
}
