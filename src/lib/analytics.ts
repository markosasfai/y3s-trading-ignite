declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const FB_PIXEL_ID = "27493926233578072";
export const GA_MEASUREMENT_ID = "G-Y589K89NS9";

type Params = Record<string, unknown>;

export function track(eventName: string, params?: Params) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("trackCustom", eventName, params);
  } catch {
    /* ignore */
  }
  try {
    window.gtag?.("event", eventName, params);
  } catch {
    /* ignore */
  }
}

// Standard FB events (Lead, CompleteRegistration, Schedule, etc.)
export function trackStandard(eventName: string, params?: Params) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", eventName, params);
  } catch {
    /* ignore */
  }
  try {
    window.gtag?.("event", eventName, params);
  } catch {
    /* ignore */
  }
}

export function pageview(path: string) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", "PageView");
  } catch {
    /* ignore */
  }
  try {
    window.gtag?.("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  } catch {
    /* ignore */
  }
}