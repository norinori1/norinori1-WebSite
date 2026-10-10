import type { WorkCategory } from "@/types/notion";
import PlatformIcon, { type IconName } from "./PlatformIcon";

const categoryBrands: Partial<Record<WorkCategory, IconName>> = {
  "Unity Games": "unity",
  "Roblox Games": "roblox",
  "Scratch Games": "scratch",
};

/** Decorative category drawings; the adjacent text provides the accessible name. */
export default function WorkCategoryArtwork({
  category,
  className,
}: {
  category: WorkCategory;
  className?: string;
}) {
  const brand = categoryBrands[category];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="64"
      height="64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      data-work-category={category}
    >
      {/* A shared drawing frame keeps brand marks and original illustrations coherent. */}
      <path d="M18 5h28l14 27-14 27H18L4 32Z" fill="currentColor" fillOpacity="0.05" strokeOpacity="0.22" />
      <path d="M8 13h6M11 10v6M50 51h6M53 48v6" strokeOpacity="0.35" strokeWidth="1" />
      {brand ? (
        <g transform="translate(18 18)" stroke="none">
          <PlatformIcon name={brand} size={28} />
        </g>
      ) : category === "VRChat Worlds" ? (
        <>
          {/* A doorway opens onto a small landscape. */}
          <path d="M20 47V20l12-8 12 8v27M25 43V23l7-5 7 5v20" />
          <path d="m25 36 6-8 4 5 4-3M25 40h14M12 48h40M18 53h28" />
          <circle cx="35" cy="25" r="1.8" fill="currentColor" stroke="none" />
        </>
      ) : category === "VRChat Gimmicks" ? (
        <>
          {/* A movable cube, a control node and motion marks. */}
          <path d="m32 20 12 7v14l-12 7-12-7V27Zm-12 7 12 7 12-7M32 34v14" />
          <path d="M10 26v-7h12M42 45h12v-7M43 13v8M39 17h8M13 42l3 3M48 27l4-2" />
          <circle cx="10" cy="30" r="3" fill="currentColor" fillOpacity="0.15" />
          <path d="m18 15 4 4-4 4" />
        </>
      ) : category === "Avatar Assets" ? (
        <>
          {/* A head and wearable outfit on a character silhouette. */}
          <circle cx="32" cy="23" r="8" fill="currentColor" fillOpacity="0.08" />
          <path d="M23 35h18l7 11-7 5H23l-7-5Zm0 0 9 9 9-9M23 42v9M41 42v9" />
          <path d="M47 15v8M43 19h8M13 28v6M10 31h6" strokeWidth="1.2" />
        </>
      ) : category === "Developer Tools" ? (
        <>
          {/* A compact code editor with its own window chrome. */}
          <rect x="13" y="16" width="38" height="32" rx="3" fill="currentColor" fillOpacity="0.05" />
          <path d="M13 24h38m-28 7-5 5 5 5m18-10 5 5-5 5m-6-11-6 12" />
          <path d="M18 20h1m4 0h1m4 0h1" strokeWidth="2" />
        </>
      ) : (
        <>
          {/* A collection of pieces for works awaiting a category. */}
          <path d="m32 15 18 10-18 10-18-10Zm-18 18 18 10 18-10m-36 8 18 10 18-10" />
          <path d="M32 15v20" strokeOpacity="0.4" />
        </>
      )}
    </svg>
  );
}
