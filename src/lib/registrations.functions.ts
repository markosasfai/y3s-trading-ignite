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

async function hashCode(phone: string, code: string) {
  const pepper = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "pepper";
  const data = new TextEncoder().encode(`${phone}|${code}|${pepper}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function detectDevice(ua: string | null | undefined): string {
  if (!ua) return "unknown";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

async function sendTwilioSms(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const from = process.env.TWILIO_FROM_NUMBER;
  const lovableKey = process.env.LOVABLE_API_KEY;
  const connKey = process.env.TWILIO_API_KEY;
  if (!from) throw new Error("Twilio odosielacie číslo nie je nakonfigurované.");
  if (!lovableKey || !connKey) throw new Error("Twilio nie je správne pripojený.");
  void accountSid;

  const res = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[Twilio] send failed", res.status, text);
    throw new Error("SMS sa nepodarilo odoslať. Skontrolujte číslo a skúste znova.");
  }
}

export const sendPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((data) => sendOtpSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Basic rate-limit: max 3 codes per phone per 10 minutes
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("phone_verifications")
      .select("id", { count: "exact", head: true })
      .eq("phone", data.phone)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      throw new Error("Príliš veľa pokusov. Skúste znova o chvíľu.");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await hashCode(data.phone, code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin.from("phone_verifications").insert({
      phone: data.phone,
      code_hash: codeHash,
      expires_at: expiresAt,
    });
    if (error) {
      console.error("[verify] insert failed", error);
      throw new Error("Nepodarilo sa pripraviť overenie. Skúste znova.");
    }

    await sendTwilioSms(data.phone, `Vas overovaci kod: ${code}. Plati 10 minut.`);
    return { ok: true };
  });

export const verifyAndSubmitLead = createServerFn({ method: "POST" })
  .inputValidator((data) => verifySchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error: selErr } = await supabaseAdmin
      .from("phone_verifications")
      .select("id, code_hash, attempts, verified, expires_at")
      .eq("phone", data.phone)
      .order("created_at", { ascending: false })
      .limit(1);
    if (selErr) throw new Error("Overenie zlyhalo. Skúste znova.");
    const row = rows?.[0];
    if (!row) throw new Error("Najprv si vyžiadajte kód.");
    if (row.verified) throw new Error("Tento kód už bol použitý.");
    if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("Platnosť kódu vypršala.");
    if ((row.attempts ?? 0) >= 5) throw new Error("Príliš veľa pokusov. Vyžiadajte nový kód.");

    const submittedHash = await hashCode(data.phone, data.code);
    let phoneVerified = false;
    if (submittedHash === row.code_hash) {
      phoneVerified = true;
      await supabaseAdmin.from("phone_verifications").update({ verified: true }).eq("id", row.id);
    } else {
      await supabaseAdmin
        .from("phone_verifications")
        .update({ attempts: (row.attempts ?? 0) + 1 })
        .eq("id", row.id);
      throw new Error("Nesprávny kód.");
    }

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
      phone_verified: phoneVerified,
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

    return { ok: true };
  });