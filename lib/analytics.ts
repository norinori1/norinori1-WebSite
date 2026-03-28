declare global {
  interface Window {
    gtag?: {
      (command: "event", eventName: string, params?: Record<string, unknown>): void;
      (command: "config", targetId: string, params?: Record<string, unknown>): void;
      (command: "js", date: Date): void;
    };
  }
}

export function trackEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}
