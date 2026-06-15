import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PhoneInput } from "./PhoneInput";

export function SignupDialog({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState({ value: "", valid: false });
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Zadajte vaše meno a priezvisko.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Zadajte platný email.");
    if (!phone.valid) return setError("Zadajte platné telefónne číslo.");
    console.log("[signup]", { name, email, phone: phone.value });
    setOpen(false);
    navigate({ to: "/dakujeme" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass-strong max-w-md border-white/10 bg-background/70 p-0 sm:rounded-2xl">
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
          <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
          <DialogHeader className="relative">
            <DialogTitle className="font-display text-3xl uppercase tracking-wide">
              Rezervuj si miesto
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Vyplnením formulára získate <span className="text-foreground font-semibold">vstupenku zdarma</span> a ste automaticky v žrebovaní o <span className="text-gradient-orange font-semibold">funded účet $500&nbsp;000</span> od Y3S. Počet miest je obmedzený.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="relative mt-6 space-y-4">
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
              <PhoneInput onChange={(v, valid) => setPhone({ value: v, valid })} />
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
              Zarezervovať miesto zadarmo →
            </button>
            <p className="text-center text-xs text-muted-foreground">
              100% zdarma · bez kamery · obmedzený počet miest
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}