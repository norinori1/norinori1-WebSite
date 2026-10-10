import Link from "next/link";
import type { Work } from "@/types/notion";
import { isFeaturedWork } from "@/lib/works-gallery";
import Thumbnail from "./Thumbnail";
import { UIIcon } from "./PlatformIcon";
import styles from "./WorksClient.module.css";

export default function WorkCard({ work }: { work: Work }) {
  return (
    <article className={styles.card}>
      <Link href={`/works/${work.slug}`} className={`${styles.cardLink}${isFeaturedWork(work) ? ` ${styles.featured}` : ""}`}>
        <div className={styles.artwork}>
          {work.thumbnailUrl ? (
            <Thumbnail src={`/api/notion-image?pageId=${work.id}&prop=Thumbnail`} alt={`${work.title} のサムネイル`}
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 45vw" />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              <UIIcon name="hexArrowRight" size={36} strokeWidth={1} /><span>WORKS</span>
            </div>
          )}
          {isFeaturedWork(work) && <span className={styles.featuredBadge}>★ Featured</span>}
        </div>
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle} title={work.title}>{work.title}</h3>
          <span className={`badge badge-${work.status.toLowerCase()} ${styles.status}`}>{work.status}</span>
          {work.tags.length > 0 && <div className={styles.tags}>
            {work.tags.slice(0, 2).map((tag) => <span key={tag} className={styles.tag} title={tag}>{tag}</span>)}
          </div>}
        </div>
      </Link>
    </article>
  );
}
