import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

const phoneRegex = /^\+[1-9]\d{6,18}$/;

const sendOtpSchema = z.object({
  phone: z.string().trim().regex(phoneRegex, "Zadajte platné telefónne číslo."),
  website: z.string().max(0).optional().default(""),
});

const verifySchema = z.object({
  name: z.string().trim().min(2, "Zadajte vaše meno a priezvisko.").max(120),
  email: z.string().trim().email("Zadajte platný email.").max(255),
  phone: z.string().trim().regex(phoneRegex, "Zadajte platné telefónne číslo."),
  code: z.string().trim().regex(/^\d{6}$/, "Kód musí mať 6 číslic."),
  website: z.string().max(0).optional().default(""),
});

function detectDevice(ua: string | null | undefined): string {
  if (!ua) return "unknown";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

const BREVO_LIST_ID = 28;

async function syncLeadToBrevo(input: {
  name: string;
  email: string;
  phone: string;
  country: string | null;
}) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const brevoKey = process.env.BREVO_API_KEY;
  if (!lovableKey || !brevoKey) {
    console.warn("[brevo] missing LOVABLE_API_KEY or BREVO_API_KEY, skipping sync");
    return;
  }
  const [firstName, ...rest] = input.name.trim().split(/\s+/);
  const lastName = rest.join(" ");
  const body = {
    email: input.email,
    attributes: {
      FIRSTNAME: firstName || undefined,
      LASTNAME: lastName || undefined,
      SMS: input.phone,
      WHATSAPP: input.phone,
      COUNTRY: input.country || undefined,
      SOURCE: "ZTH Lovable Nowli",
      PHONE_VERIFIED: true,
      OPT_IN: true,
    },
    listIds: [BREVO_LIST_ID],
    updateEnabled: true,
  };
  try {
    const res = await fetch("https://connector-gateway.lovable.dev/brevo/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": brevoKey,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[brevo] contact sync failed", res.status, text);
    } else {
      console.log("[brevo] contact synced", input.email, "list", BREVO_LIST_ID);
    }
  } catch (err) {
    console.error("[brevo] contact sync threw", err);
  }
}

function twilioAuthHeader() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!sid || !token || !serviceSid) {
    throw new Error("Twilio Verify nie je nakonfigurovaný.");
  }
  return { auth: `Basic ${btoa(`${sid}:${token}`)}`, serviceSid };
}

export const sendPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((data) => sendOtpSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { auth, serviceSid } = twilioAuthHeader();
    const res = await fetch(
      `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`,
      {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: data.phone, Channel: "sms" }),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("[Twilio Verify] send failed", res.status, text);
      throw new Error("SMS sa nepodarilo odoslať. Skontrolujte číslo a skúste znova.");
    }
    return { ok: true };
  });

export const verifyAndSubmitLead = createServerFn({ method: "POST" })
  .inputValidator((data) => verifySchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { auth, serviceSid } = twilioAuthHeader();
    const checkRes = await fetch(
      `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`,
      {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: data.phone, Code: data.code }),
      },
    );
    const checkData = await checkRes.json().catch(() => ({} as { status?: string }));
    if (!checkRes.ok || checkData?.status !== "approved") {
      console.error("[Twilio Verify] check failed", checkRes.status, checkData);
      throw new Error("Nesprávny alebo expirovaný kód.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const userAgent = getRequestHeader("user-agent") ?? null;
    const country =
      getRequestHeader("cf-ipcountry") ??
      getRequestHeader("x-vercel-ip-country") ??
      null;
    const ip =
      getRequestHeader("cf-connecting-ip") ??
      getRequestIP({ xForwardedFor: true }) ??
      null;

    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      phone_verified: true,
      device_type: detectDevice(userAgent),
      country,
      user_agent: userAgent,
      ip_address: ip,
      source: "landing_page",
      consent: true,
    });
    if (error) {
      console.error("[leads] insert failed", error);
      throw new Error("Registráciu sa nepodarilo uložiť.");
    }

    // Await Brevo so the serverless worker does not terminate before the sync runs.
    await syncLeadToBrevo({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      country,
    });

    return { ok: true };
  });