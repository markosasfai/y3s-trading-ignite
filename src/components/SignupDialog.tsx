import { cloneElement, isValidElement, useCallback, useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { sendPhoneOtp, verifyAndSubmitLead } from "@/lib/registrations.functions";
import { PhoneInput } from "./PhoneInput";
import giftAsset from "@/assets/gift-3d.png.asset.json";
import { track, trackStandard } from "@/lib/analytics";


type TriggerElement = ReactElement<{
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}>;

export function SignupDialog({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const sendOtp = useServerFn(sendPhoneOtp);
  const verifyAndSubmit = useServerFn(verifyAndSubmitLead);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState({ value: "", valid: false });
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handlePhoneChange = useCallback((value: string, valid: boolean) => {
    setPhone((current) => (current.value === value && current.valid === valid ? current : { value, valid }));
  }, []);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setCodeSent(false);
    setCode("");
    setError(null);
    track("signup_cta_click", { source: "signup_dialog" });
    track("signup_step_view", { step: 1 });
    window.setTimeout(() => panelRef.current?.scrollTo({ top: 0 }), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const goToStep2 = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Zadajte vaše meno a priezvisko.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Zadajte platný email.");
    track("signup_step_complete", { step: 1 });
    track("signup_step_view", { step: 2 });
    setStep(2);
  };

  const sendCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone.valid) return setError("Zadajte platné telefónne číslo.");
    if (submitting) return;
    setSubmitting(true);
    try {
      await sendOtp({ data: { phone: phone.value, website } });
      setCodeSent(true);
      track("signup_step_complete", { step: 2 });
      track("signup_step_view", { step: 3 });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepodarilo sa odoslať kód.");
    } finally {
      setSubmitting(false);
    }
  };

  const resendCode = async () => {
    setCode("");
    setError(null);
    try {
      await sendOtp({ data: { phone: phone.value, website } });
      setError("Kód bol znova odoslaný.");
      window.setTimeout(() => setError(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepodarilo sa znova odoslať kód.");
    }
  };

  const confirmAndSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (submitting) return;
    if (!/^\d{6}$/.test(code)) return setError("Zadajte 6-miestny kód.");
    setSubmitting(true);
    try {
      await verifyAndSubmit({
        data: { name, email, phone: phone.value, code, website },
      });
      track("signup_step_complete", { step: 3 });
      trackStandard("Lead", { content_name: "Zero to Hero registration" });
      trackStandard("CompleteRegistration", { content_name: "Zero to Hero" });
      setOpen(false);
      navigate({ to: "/dakujeme" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registráciu sa nepodarilo odoslať. Skúste to prosím znova.");
    } finally {
      setSubmitting(false);
    }
  };

  const trigger = isValidElement(children)
    ? cloneElement(children as TriggerElement, {
        onClick: (event) => {
          (children as TriggerElement).props.onClick?.(event);
          if (!event.defaultPrevented) setOpen(true);
        },
      })
    : children;

  return (
    <>
      {trigger}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/95 px-4 py-4 backdrop-blur-xl sm:items-center sm:py-5" role="dialog" aria-modal="true">
          <div className="absolute inset-0" aria-hidden="true" />
          <div ref={panelRef} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overflow-x-hidden overscroll-contain rounded-2xl border border-border bg-background p-5 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:p-8">
            <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
            <button
              type="button"
              aria-label="Zavrieť"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full border border-border bg-secondary p-2 text-foreground/80 transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <header className="relative">
              <p className="text-center font-display text-2xl uppercase leading-[1.05] tracking-wide text-foreground sm:text-[1.75rem]">
                Získaj <span className="text-gradient-orange">vstupenku zdarma</span>
              </p>
              <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Krok {step} z 3
              </p>

              {step === 1 && (
                <>
                  <p className="mt-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-foreground/70">
                    + Každý z vás získa:
                  </p>
                  <div className="relative mt-3 overflow-hidden rounded-2xl border border-sky-400/35 bg-gradient-to-b from-sky-500/15 to-background/85 p-4 shadow-[0_0_30px_-12px_oklch(0.75_0.15_240/0.6)] backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <img
                        src={giftAsset.url}
                        alt=""
                        className="h-20 w-20 shrink-0 opacity-70 drop-shadow-[0_8px_24px_oklch(0.75_0.15_240/0.55)] sm:h-24 sm:w-24"
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <p className="font-display text-[1.55rem] uppercase leading-[0.95] text-foreground sm:text-[1.8rem]">
                          Špeciálny darček
                        </p>
                        <p className="mt-1 text-[0.85rem] font-semibold text-foreground/80">
                          Tento darček získate hneď po registrácii.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-foreground/70">
                    A jeden z vás získa:
                  </p>
                  <div className="relative mt-3 overflow-hidden rounded-2xl border border-emerald-400/35 bg-gradient-to-b from-emerald-500/15 to-background/85 p-4 shadow-[0_0_30px_-12px_oklch(0.75_0.15_160/0.6)] backdrop-blur-md">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-display text-[2.15rem] uppercase leading-none text-emerald-300 sm:text-[2.45rem]">
                        Y3S funded účet
                      </span>
                    </div>
                    <div className="my-2.5 h-px w-full bg-gradient-to-r from-emerald-400/60 via-emerald-400/20 to-transparent" />
                    <div className="relative flex items-center gap-3">
                      <img
                        src={giftAsset.url}
                        alt=""
                        className="h-20 w-20 shrink-0 opacity-70 drop-shadow-[0_8px_24px_oklch(0.75_0.15_160/0.55)] sm:h-24 sm:w-24"
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <p className="font-display text-[2.45rem] leading-[0.88] text-emerald-300 sm:text-[2.9rem]">
                          $500&nbsp;000
                        </p>
                        <p className="mt-1 text-xs font-semibold leading-snug text-foreground/80">
                          Uown corporation je spoločnosť poskytujúca prop tradingové balíky.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <p className="mt-4 text-center font-display text-xl uppercase leading-snug text-foreground sm:text-2xl">
                  Overte telefónne číslo a získajte darčeky a vstupenku zadarmo
                </p>
              )}

              {step === 3 && (
                <p className="mt-3 text-center text-sm leading-snug text-foreground/80">
                  Zadajte 6-miestny kód, ktorý sme vám poslali, a dokončite registráciu.
                </p>
              )}
            </header>

            {step === 1 && (
              <form onSubmit={goToStep2} className="relative mt-6 space-y-4">
                <input
                  aria-hidden="true"
                  tabIndex={-1}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                  autoComplete="off"
                />
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                    Meno a priezvisko
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass w-full rounded-xl px-3 py-3 text-base outline-none focus-within:ring-2 focus:ring-2 focus:ring-primary/60"
                    placeholder="Ján Novák"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass w-full rounded-xl px-3 py-3 text-base outline-none focus:ring-2 focus:ring-primary/60"
                    placeholder="jan@email.sk"
                    autoComplete="email"
                  />
                </div>
                {error && (
                  <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="shimmer-overlay glow-orange relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-4 text-base font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Pokračovať →
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  100% zdarma · bez kamery · obmedzený počet miest
                </p>
              </form>
            )}

            {(step === 2 || step === 3) && (
              <form onSubmit={codeSent ? confirmAndSubmit : sendCode} className="relative mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                    Telefón
                  </label>
                  <PhoneInput onChange={handlePhoneChange} />
                </div>
                {codeSent && (
                  <div>
                    <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                      6-miestny kód
                    </label>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="glass w-full rounded-xl px-3 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:ring-2 focus:ring-primary/60"
                      placeholder="000000"
                      autoComplete="one-time-code"
                    />
                    <p className="mt-2 text-center text-[0.75rem] text-muted-foreground">
                      Neprišiel vám kód?{" "}
                      <button
                        type="button"
                        onClick={resendCode}
                        className="font-semibold text-primary underline decoration-primary/50 underline-offset-2 transition hover:text-foreground"
                      >
                        Poslať znova
                      </button>
                    </p>
                  </div>
                )}
                {error && (
                  <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="shimmer-overlay glow-orange relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-4 text-base font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                >
                  {codeSent
                    ? submitting
                      ? "Odosielam..."
                      : "Potvrdiť číslo a dokončiť registráciu →"
                    : "Overiť a zaregistrovať →"}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep(codeSent ? 2 : 1); setCodeSent(false); setCode(""); setError(null); }}
                  className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  ← Späť
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}