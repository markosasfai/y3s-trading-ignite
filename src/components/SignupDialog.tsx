import { cloneElement, isValidElement, useCallback, useEffect, useState, type FormEvent, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { submitChallengeRegistration } from "@/lib/registrations.functions";
import { PhoneInput } from "./PhoneInput";

type TriggerElement = ReactElement<{
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}>;

export function SignupDialog({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const submitRegistration = useServerFn(submitChallengeRegistration);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState({ value: "", valid: false });
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePhoneChange = useCallback((value: string, valid: boolean) => {
    setPhone((current) => (current.value === value && current.valid === valid ? current : { value, valid }));
  }, []);

  useEffect(() => {
    if (!open) return;
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

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (submitting) return;
    if (name.trim().length < 2) return setError("Zadajte vaše meno a priezvisko.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Zadajte platný email.");
    if (!phone.valid) return setError("Zadajte platné telefónne číslo.");
    setSubmitting(true);
    try {
      await submitRegistration({
        data: { name, email, phone: phone.value, website },
      });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 px-4 py-5 backdrop-blur-xl" role="dialog" aria-modal="true">
          <button className="absolute inset-0 cursor-default" aria-label="Zavrieť formulár" onClick={() => setOpen(false)} />
          <div className="glass-strong relative max-h-[calc(100dvh-2.5rem)] w-full max-w-md overflow-y-auto overflow-x-hidden rounded-2xl border-border bg-background/95 p-5 shadow-2xl sm:p-8">
            <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
            <button
              type="button"
              aria-label="Zavrieť"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full border border-border bg-secondary p-2 text-foreground/80 transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <header className="relative pr-10">
              <h2 className="font-display text-3xl uppercase tracking-wide">Rezervuj si miesto</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                Zaregistruj sa a získaš <span className="font-bold text-foreground">vstupenku zdarma</span> na 3-dňový challenge.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                <span className="font-bold text-gradient-orange">+ Bonus:</span> jeden z účastníkov vyhrá <span className="font-bold text-gradient-orange">funded účet $500&nbsp;000</span> od Y3S.
              </p>
            </header>
          <form onSubmit={submit} className="relative mt-6 space-y-4">
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
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Telefón
              </label>
              <PhoneInput onChange={handlePhoneChange} />
            </div>
            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="shimmer-overlay glow-orange relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-glow px-6 py-4 text-base font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {submitting ? "Odosielam..." : "Zarezervovať miesto zadarmo →"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              100% zdarma · bez kamery · obmedzený počet miest
            </p>
          </form>
        </div>
        </div>
      )}
    </>
  );
}