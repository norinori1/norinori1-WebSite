export type Work = {
  id: string;
  title: string;
  slug: string;
  description: string;
  link: string;
  status: "Latest" | "Featured" | "Released";
  tags: string[];
  platforms: string[];
  thumbnailUrl: string | null;
  featured: boolean;
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
