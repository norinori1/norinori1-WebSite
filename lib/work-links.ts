import type { Work, WorkCategory } from "../types/notion";
import type { IconName, UIIconName } from "../components/PlatformIcon";
import { sanitizeUrl } from "./security";

export type WorkLink = {
  href: string;
  service: string;
  icon: { kind: "platform"; name: IconName } | { kind: "ui"; name: UIIconName };
};

export function parseAdditionalLinks(text: string): string[] {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export function safeWorkUrl(value: string): string | null {
  const safe = sanitizeUrl(value);
  return /^https?:\/\//i.test(safe) ? safe : null;
}

export function describeWorkLink(href: string): WorkLink {
  const host = new URL(href).hostname.toLowerCase().replace(/^www\./, "");
  const belongsTo = (domain: string) => host === domain || host.endsWith(`.${domain}`);
  const platform = (service: string, name: IconName): WorkLink => ({ href, service, icon: { kind: "platform", name } });
  if (belongsTo("itch.io")) return platform("itch.io", "itchio");
  if (host === "scratch.mit.edu") return platform("Scratch", "scratch");
  if (host === "unityroom.com") return platform("unityroom", "unity");
  if (host === "github.com") return platform("GitHub", "github");
  if (belongsTo("roblox.com")) return platform("Roblox", "roblox");
  if (host === "discord.com" || host === "discord.gg") return platform("Discord", "discord");
  if (host === "vrchat.com") return { href, service: "VRChat", icon: { kind: "ui", name: "portal" } };
  if (belongsTo("booth.pm")) return { href, service: "BOOTH", icon: { kind: "ui", name: "package" } };
  return platform(host, "web");
}

export function getWorkLinks(work: Pick<Work, "link" | "additionalLinks">): WorkLink[] {
  const seen = new Set<string>();
  const links: WorkLink[] = [];
  for (const raw of [work.link, ...work.additionalLinks]) {
    const href = safeWorkUrl(raw);
    if (!href || seen.has(href)) continue;
    seen.add(href);
    links.push(describeWorkLink(href));
  }
  return links;
}

export function workAction(category: WorkCategory): string {
  if (category.endsWith(" Games")) return "プレイする";
  if (category === "VRChat Worlds") return "ワールドを見る";
  if (category === "VRChat Gimmicks" || category === "Avatar Assets") return "配布ページを見る";
  if (category === "Developer Tools") return "ツールを見る";
  return "作品を見る";
}
