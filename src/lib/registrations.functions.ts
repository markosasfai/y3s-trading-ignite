import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const registrationSchema = z.object({
  name: z.string().trim().min(2, "Zadajte vaše meno a priezvisko.").max(120),
  email: z.string().trim().email("Zadajte platný email.").max(255),
  phone: z.string().trim().min(8, "Zadajte platné telefónne číslo.").max(32),
  website: z.string().max(0).optional().default(""),
});

export const submitChallengeRegistration = createServerFn({ method: "POST" })
  .inputValidator((data) => registrationSchema.parse(data))
  .handler(async ({ data }) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Registrácia momentálne nie je dostupná.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("challenge_registrations").insert({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      source: "landing_page",
      consent: true,
    });

    if (error) {
      throw new Error("Registráciu sa nepodarilo odoslať. Skúste to prosím znova.");
    }

    return { ok: true };
  });