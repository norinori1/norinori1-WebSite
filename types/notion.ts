export const WORK_CATEGORIES = [
  "Unity Games",
  "Roblox Games",
  "Scratch Games",
  "VRChat Worlds",
  "VRChat Gimmicks",
  "Avatar Assets",
  "Developer Tools",
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number] | "Other";

export type Work = {
  id: string;
  title: string;
  slug: string;
  description: string;
  link: string;
  additionalLinks: string[];
  engines: string[];
  repository: string;
  status: "Latest" | "Featured" | "Released";
  tags: string[];
  platforms: string[];
  thumbnailUrl: string | null;
  featured: boolean;
  category: WorkCategory;
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  status: "Published" | "Draft";
  tags: string[];
  coverImageUrl: string | null;
  featured: boolean;
};
