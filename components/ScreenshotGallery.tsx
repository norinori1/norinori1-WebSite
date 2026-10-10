"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { UIIcon } from "./PlatformIcon";
import styles from "./WorkDetail.module.css";

export type Screenshot = { id: string; src: string; alt: string; caption: ReactNode };

export default function ScreenshotGallery({ images }: { images: Screenshot[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  if (images.length === 0) return null;
  const image = images[selected ?? 0];
  return (
    <>
      <div className={styles.gallery} aria-label="スクリーンショット">
        {images.map((item, index) => <figure key={item.id}>
          <a href={item.src} className={styles.screenshot} aria-haspopup="dialog"
            aria-label={`${item.alt || `スクリーンショット ${index + 1}`}を拡大`}
            onClick={(event) => { event.preventDefault(); trigger.current = event.currentTarget; setSelected(index); dialog.current?.showModal(); }}
            onKeyDown={(event) => { if (event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }}>
            <Image src={item.src} alt={item.alt} width={800} height={450} unoptimized
              sizes="(min-width: 768px) 300px, (min-width: 480px) 45vw, 90vw" />
            <span className={styles.expand} aria-hidden="true"><UIIcon name="arrowUpRight" size={16} /></span>
          </a>
          {item.caption && <figcaption>{item.caption}</figcaption>}
        </figure>)}
      </div>
      <dialog ref={dialog} className={styles.lightbox} aria-label="スクリーンショットの拡大表示"
        onClose={() => { setSelected(null); trigger.current?.focus(); }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const targets = [...event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]')]
            .filter((element) => element.getBoundingClientRect().width > 0);
          const first = targets[0], last = targets.at(-1);
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className={styles.lightboxContent}>
          <button type="button" autoFocus className={styles.close} aria-label="拡大表示を閉じる" onClick={() => dialog.current?.close()}>
            <UIIcon name="close" size={24} />
          </button>
          <Image src={image.src} alt={image.alt} width={1600} height={900} unoptimized sizes="95vw" />
          {image.caption && <p>{image.caption}</p>}
        </div>
      </dialog>
    </>
  );
}
