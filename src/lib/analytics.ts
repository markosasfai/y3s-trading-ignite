declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

import { sendCapiEvent, type CapiUserData } from "./capi.functions";

export const FB_PIXEL_ID = "27493926233578072";
export const GA_MEASUREMENT_ID = "G-Y589K89NS9";

type Params = Record<string, unknown>;

function newEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const USER_DATA_KEY = "__y3s_capi_user";

export function rememberUserData(user: CapiUserData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function recallUserData(): CapiUserData | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(USER_DATA_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as CapiUserData;
  } catch {
    return undefined;
  }
}

function fireCapi(
  eventName: string,
  eventId: string,
  params?: Params,
  userData?: CapiUserData,
) {
  // Fire-and-forget; never let CAPI break the UX.
  try {
    void sendCapiEvent({
      data: {
        event_name: eventName,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        action_source: "website",
        custom_data: params,
        user_data: userData,
      },
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* swallow */
  }
}

export function trackBoth(eventName: string, params?: Params, userData?: CapiUserData) {
  if (typeof window === "undefined") return;
  const eventId = newEventId();
  const user = userData ?? recallUserData();
  try {
    window.fbq?.("trackCustom", eventName, params, { eventID: eventId });
  } catch {
    /* ignore */
  }
  try {
    window.gtag?.("event", eventName, params);
  } catch {
    /* ignore */
  }
  fireCapi(eventName, eventId, params, user);
}

export function trackStandardBoth(eventName: string, params?: Params, userData?: CapiUserData) {
  if (typeof window === "undefined") return;
  const eventId = newEventId();
  const user = userData ?? recallUserData();
  try {
    window.fbq?.("track", eventName, params, { eventID: eventId });
  } catch {
    /* ignore */
  }
  try {
    window.gtag?.("event", eventName, params);
  } catch {
    /* ignore */
  }
  fireCapi(eventName, eventId, params, user);
}

// Backwards-compatible aliases — now also mirror to CAPI.
export const track = trackBoth;
export const trackStandard = trackStandardBoth;

export function pageview(path: string) {
  if (typeof window === "undefined") return;
  const eventId = newEventId();
  const user = recallUserData();
  try {
    window.fbq?.("track", "PageView", undefined, { eventID: eventId });
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
  fireCapi("PageView", eventId, { page_path: path }, user);
}