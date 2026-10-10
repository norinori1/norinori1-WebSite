"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode, type KeyboardEvent } from "react";
import { selectWorkTab, type WorkTabId } from "@/lib/work-sections";
import styles from "./WorkDetail.module.css";

const eventName = "work-tab-change";
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(eventName, callback);
  return () => { window.removeEventListener("popstate", callback); window.removeEventListener(eventName, callback); };
}
const noSubscribe = () => () => {};

export default function WorkTabs({ sections }: { sections: { id: WorkTabId; label: string; content: ReactNode }[] }) {
  const query = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const enhanced = useSyncExternalStore(noSubscribe, () => true, () => false);
  const selected = selectWorkTab(new URLSearchParams(query).get("tab"), sections.map((section) => section.id));
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const active = document.activeElement as HTMLElement | null;
    if (active?.closest("[hidden]") && root.current?.contains(active)) {
      root.current.querySelector<HTMLAnchorElement>(`#work-tab-${selected}`)?.focus();
    }
  }, [selected]);

  function activate(id: WorkTabId, focus = false) {
    if (id !== selected) {
      const url = new URL(window.location.href);
      if (id === "intro") url.searchParams.delete("tab");
      else url.searchParams.set("tab", id);
      window.history.pushState(null, "", url);
      window.dispatchEvent(new Event(eventName));
    }
    if (focus) root.current?.querySelector<HTMLAnchorElement>(`#work-tab-${id}`)?.focus();
  }

  function onKey(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    let target: number;
    if (event.key === "ArrowRight") target = (index + 1) % sections.length;
    else if (event.key === "ArrowLeft") target = (index - 1 + sections.length) % sections.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = sections.length - 1;
    else if (event.key === " ") target = index;
    else return;
    event.preventDefault();
    activate(sections[target].id, true);
  }

  return (
    <div ref={root} className={styles.tabs}>
      <div role={enhanced ? "tablist" : undefined} aria-label="作品の詳しい情報" className={styles.tabList}>
        {sections.map((section, index) => <a key={section.id} id={`work-tab-${section.id}`}
          href={`#work-panel-${section.id}`} role={enhanced ? "tab" : undefined}
          aria-selected={enhanced ? section.id === selected : undefined}
          aria-controls={enhanced ? `work-panel-${section.id}` : undefined}
          tabIndex={enhanced && section.id !== selected ? -1 : 0}
          onClick={(event) => { event.preventDefault(); activate(section.id); }}
          onKeyDown={(event) => onKey(event, index)} className={styles.tab}>
          <span aria-hidden="true" className={styles.tabNumber}>{String(index + 1).padStart(2, "0")}</span>{section.label}
        </a>)}
      </div>
      {sections.map((section) => <section key={section.id} id={`work-panel-${section.id}`}
        role={enhanced ? "tabpanel" : undefined} aria-labelledby={`work-tab-${section.id}`}
        tabIndex={0} hidden={enhanced && section.id !== selected} className={styles.panel}>
        {!enhanced && <h2>{section.label}</h2>}{section.content}
      </section>)}
    </div>
  );
}
