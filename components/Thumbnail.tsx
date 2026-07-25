import Image from "next/image";

interface ThumbnailProps {
  /** Notion image proxy URL. */
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}

/**
 * Artwork is letterboxed (`object-fit: contain`) so game key art is never
 * cropped, with a blurred, cover-fitted copy of the same image filling the
 * bars behind it. The browser reuses the cached response, so the second
 * <Image> costs no extra request.
 */
export default function Thumbnail({
  src,
  alt,
  sizes = "(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1200px) calc(50vw - 2.5rem), 480px",
  className = "",
}: ThumbnailProps) {
  return (
    <div className={`thumb${className ? ` ${className}` : ""}`}>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="thumb-blur"
        unoptimized
      />
      <Image src={src} alt={alt} fill sizes={sizes} className="thumb-img" unoptimized />
    </div>
  );
}
