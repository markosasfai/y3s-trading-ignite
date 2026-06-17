import { createServerFn } from "@tanstack/react-start";
import {
  getRequestHeader,
  getRequestIP,
  getCookie,
} from "@tanstack/react-start/server";
import { createHash } from "crypto";

const FB_PIXEL_ID = "27493926233578072";
const GRAPH_API_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
function normalizePhone(phone: string) {
  // Meta wants digits only, with country code, no '+'
  return phone.replace(/[^\d]/g, "");
}
function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

export type CapiUserData = {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  external_id?: string;
};

export type CapiEventInput = {
  event_name: string;
  event_id: string;
  event_time?: number;
  event_source_url?: string;
  action_source?: "website" | "email" | "app" | "phone_call" | "chat" | "physical_store" | "system_generated" | "other";
  custom_data?: Record<string, unknown>;
  user_data?: CapiUserData;
};

export const sendCapiEvent = createServerFn({ method: "POST" })
  .inputValidator((data: CapiEventInput) => {
    if (!data || typeof data.event_name !== "string" || typeof data.event_id !== "string") {
      throw new Error("Invalid CAPI event payload");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (!accessToken) {
      console.warn("[CAPI] META_CAPI_ACCESS_TOKEN missing — skipping event", data.event_name);
      return { ok: false, skipped: true };
    }

    const userAgent = getRequestHeader("user-agent") ?? undefined;
    const ip = getRequestIP({ xForwardedFor: true }) ?? undefined;
    const fbp = getCookie("_fbp") ?? undefined;
    const fbc = getCookie("_fbc") ?? undefined;

    const u = data.user_data ?? {};
    const user_data: Record<string, unknown> = {};
    if (u.email) user_data.em = [sha256(normalizeEmail(u.email))];
    if (u.phone) user_data.ph = [sha256(normalizePhone(u.phone))];
    if (u.first_name) user_data.fn = [sha256(normalizeName(u.first_name))];
    if (u.last_name) user_data.ln = [sha256(normalizeName(u.last_name))];
    if (u.external_id) user_data.external_id = [sha256(u.external_id.trim().toLowerCase())];
    if (ip) user_data.client_ip_address = ip;
    if (userAgent) user_data.client_user_agent = userAgent;
    if (fbp) user_data.fbp = fbp;
    if (fbc) user_data.fbc = fbc;

    const payload = {
      data: [
        {
          event_name: data.event_name,
          event_time: data.event_time ?? Math.floor(Date.now() / 1000),
          event_id: data.event_id,
          event_source_url: data.event_source_url,
          action_source: data.action_source ?? "website",
          user_data,
          custom_data: data.custom_data ?? {},
        },
      ],
    };

    try {
      const res = await fetch(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${FB_PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const body = (await res.json().catch(() => ({}))) as {
        fbtrace_id?: string;
        error?: { message?: string };
      };
      if (!res.ok) {
        console.error("[CAPI] Meta error", data.event_name, res.status, body?.error?.message ?? body);
        return { ok: false, status: res.status, fbtrace_id: body?.fbtrace_id };
      }
      return { ok: true, fbtrace_id: body?.fbtrace_id };
    } catch (err) {
      console.error("[CAPI] request failed", data.event_name, err);
      return { ok: false, error: "network_error" as const };
    }
  });