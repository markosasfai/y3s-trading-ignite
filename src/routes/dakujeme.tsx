import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Calendar, Play, Share2, Trophy, ArrowLeft, CheckCircle2, Gift, Clock, MessageCircle, Sparkles, AlertTriangle } from "lucide-react";
import { DisclaimerFooter } from "@/components/EventContent";
import { Background } from "@/components/Background";
import logoAsset from "@/assets/y3s-chalan-logo.png.asset.json";
import giftAsset from "@/assets/gift-3d.png.asset.json";
import specialistAsset from "@/assets/specialist-y3s.png.asset.json";

export const Route = createFileRoute("/dakujeme")({
  head: () => ({
    meta: [
      { title: "Ďakujeme — vidíme sa naživo | Zero to Hero" },
      { name: "description", content: "Tvoja vstupenka na Zero to Hero je potvrdená. Pridaj si event do kalendára a rezervuj si bezplatný hovor s naším špecialistom." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function buildIcs() {
  const pad = (n: number) => String(n).padStart(2, "0");
  // Europe/Bratislava is UTC+2 in June (CEST) → 19:00 local = 17:00 UTC
  const ev = (y: number, m: number, d: number, hStart: number, hEnd: number, n: number) => {
    const dt = (h: number) => `${y}${pad(m)}${pad(d)}T${pad(h)}0000Z`;
    return [
      "BEGIN:VEVENT",
      `UID:zero-to-hero-day-${n}@y3s.sk`,
      `DTSTAMP:${dt(hStart)}`,
      `DTSTART:${dt(hStart)}`,
      `DTEND:${dt(hEnd)}`,
      `SUMMARY:Zero to Hero — Deň ${n}`,
      "DESCRIPTION:Online Challenge s Dodo a Lukášom. Pripoj sa naživo a buď v žrebovaní o $500 000 funded účet.",
      "LOCATION:Online",
      "END:VEVENT",
    ].join("\r\n");
  };
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Y3S//Zero to Hero//SK",
    ev(2026, 6, 20, 17, 19, 1),
    ev(2026, 6, 21, 17, 19, 2),
    ev(2026, 6, 22, 17, 19, 3),
    "END:VCALENDAR",
  ].join("\r\n");
}

function ThankYou() {
  const downloadIcs = () => {
    const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zero-to-hero.ics";
    a.click();
    URL.revokeObjectURL(url);
  };
  const share = async () => {
    const data = {
      title: "Zero to Hero — Online Challenge",
      text: "Pridaj sa ku mne na 5-dňový live tréning s Dodo a Lukášom (zdarma).",
      url: typeof window !== "undefined" ? window.location.origin : "https://y3s.sk",
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* ignored */
      }
    } else {
      await navigator.clipboard?.writeText(data.url);
      alert("Odkaz skopírovaný do schránky.");
    }
  };

  return (
    <main className="relative min-h-screen text-foreground">
      <Background />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-10 flex items-center justify-between">
          <img src={logoAsset.url} alt="Y3S × Chalan z Burzy" className="h-16 w-auto sm:h-20" />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Späť
          </Link>
        </div>

        {/* Main Confirmation Ticket */}
        <section className="group relative">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-primary to-primary-glow opacity-15 blur transition duration-1000 group-hover:opacity-25" />
          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-8 sm:p-12">
            <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-primary-glow/20 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-black/70 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-[0.2em] text-primary shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_25%,transparent)] backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4" /> Vstupenka potvrdená
              </p>

              <h1 className="mt-6 font-display text-[clamp(2.75rem,6vw,4.5rem)] font-black uppercase leading-[1.05]">
                Si v hre! <span className="text-gradient-orange">Vidíme sa naživo.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
                Posielame ti potvrdenie na email. Pre vstup do žrebovania o{" "}
                <span className="font-semibold text-foreground">$500 000 funded účet</span> sa pripoj naživo{" "}
                <span className="font-semibold text-foreground">20.–24. júla 2026 o 19:00</span>.
              </p>

              {/* Video placeholder */}
              <div className="group/video relative mt-10 aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-black/40">
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition-transform duration-300 group-hover/video:scale-110">
                    <Play className="h-8 w-8 translate-x-[2px] fill-current" />
                  </div>
                </div>
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  Video čoskoro
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
                <a
                  href="https://www.addevent.com/event/8zg6vgxf52h6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shimmer-overlay glow-orange relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-glow px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.01] sm:flex-none"
                >
                  <Calendar className="h-5 w-5" /> Pridať do kalendára
                </a>
                <button
                  onClick={share}
                  className="glass flex flex-1 items-center justify-center gap-3 rounded-xl border border-white/10 px-8 py-4 text-sm font-bold uppercase tracking-wider transition hover:bg-white/10 sm:flex-none"
                >
                  <Share2 className="h-5 w-5" /> Zdieľať s kamarátom
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Event date + time */}
        <section className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-card/40 px-6 py-4 text-center backdrop-blur-md">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <Calendar className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-bold text-foreground">20.–24. júla 2026</p>
            <p className="text-base text-muted-foreground/80">19:00 (CET)</p>
          </div>
        </section>

        {/* Raffle congrats banner — green */}
        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-gradient-to-br from-emerald-900/40 via-emerald-950/30 to-card/40 p-6 backdrop-blur-md sm:p-10">
          <div className="pointer-events-none absolute -top-24 -right-12 h-56 w-56 rounded-full bg-emerald-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
            <div className="relative mx-auto w-32 shrink-0 sm:w-40">
              <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-2xl" />
              <img
                src={giftAsset.url}
                alt="Bonus: žrebovanie o funded účet"
                className="relative w-full drop-shadow-[0_15px_35px_rgba(16,185,129,0.4)]"
              />
            </div>
            <div className="min-w-0 text-center sm:text-left">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5 font-display text-base font-bold uppercase tracking-[0.18em] text-emerald-300">
                <Trophy className="h-4 w-4" /> Gratulujeme!
              </p>
              <h3 className="mt-4 font-display text-3xl font-black uppercase leading-[1.05] sm:text-4xl">
                Si v žrebovaní o{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                  $500 000 funded účet
                </span>
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-foreground/85">
                Stačí jediná vec — <span className="font-semibold text-foreground">pripoj sa naživo na event</span>. Víťaza vyhlasujeme priamo počas vysielania, takže musíš byť pri tom.
              </p>
            </div>
          </div>
        </section>

        {/* VIP Call Section — gift / bluish tint */}
        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-sky-400/20 bg-gradient-to-br from-sky-950/40 via-card/60 to-card/40 backdrop-blur-2xl">
          <div className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            {/* Header band — full width, balanced */}
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-1.5 font-display text-base font-bold uppercase tracking-[0.18em] text-sky-300">
                  <Gift className="h-4 w-4" /> Tvoj bonus k vstupenke
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-black uppercase leading-[1.05]">
                  Hovor 1:1 s naším{" "}
                  <span className="bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
                    trading špecialistom.
                  </span>
                </h2>
              </div>
              {/* Price + pill — compact stack, right side on desktop */}
              <div className="flex shrink-0 items-center gap-5 sm:flex-col sm:items-end sm:gap-3">
                <div className="relative inline-block">
                  <span className="font-display text-4xl font-black tracking-tight text-red-500 sm:text-5xl">
                    250 €
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-[-6%] right-[-6%] top-1/2 h-[5px] -translate-y-1/2 rotate-[-10deg] rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.6)]"
                  />
                </div>
                <span className="rounded-full bg-amber-400 px-5 py-2.5 font-display text-base font-black uppercase tracking-wider text-amber-950 shadow-[0_0_36px_rgba(251,191,36,0.55)] sm:text-lg sm:px-6 sm:py-3">
                  Zdarma pre teba
                </span>
              </div>
            </div>

            {/* Body grid — specialist + gift on left, benefits on right */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:items-stretch">
              {/* Specialist card with gift accent */}
              <div className="relative overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-950/60 to-black/40 p-4 backdrop-blur-md">
                <div className="relative flex items-center gap-4">
                  <img
                    src={specialistAsset.url}
                    alt="Trading špecialistka z tímu Y3S"
                    className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-sky-400/40 sm:h-24 sm:w-24"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold uppercase tracking-[0.18em] text-sky-300">Tvoj špecialista</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">Tím Y3S</p>
                    <p className="text-base text-foreground/75">Trading mentor</p>
                  </div>
                </div>
                <p className="relative mt-4 text-base leading-relaxed text-foreground/85">
                  Bežne sa za hovor platí. Ty ho máš ako darček — stačí sa zapísať.
                </p>
              </div>

              {/* Benefits */}
              <ul className="flex flex-col justify-center gap-3 text-base sm:text-lg">
                <BenefitItem icon={<MessageCircle className="h-5 w-5" />}>
                  Spýtaj sa čokoľvek o evente alebo o tradingu
                </BenefitItem>
                <BenefitItem icon={<Sparkles className="h-5 w-5" />}>
                  Extra tipy a personalizovaný plán pred štartom
                </BenefitItem>
                <BenefitItem icon={<Clock className="h-5 w-5" />}>
                  30 minút online — vyber si čas, ktorý ti sadne
                </BenefitItem>
              </ul>
            </div>

            {/* Scarcity — slim full-width bar */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-base text-amber-100/90">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <p>
                <span className="font-semibold text-amber-200">Keď sa kalendár zaplní, končíme.</span>{" "}
                Ďalšie termíny už nepridávame — vyber si voľný slot teraz.
              </p>
            </div>
          </div>

          <div className="relative border-t border-sky-400/15 bg-white">
            <CalendlyInlineWidget />
          </div>
        </section>

        <DisclaimerFooter />
      </div>
    </main>
  );
}

function CalendlyInlineWidget() {
  useEffect(() => {
    if (document.getElementById("calendly-widget-script")) return;
    const script = document.createElement("script");
    script.id = "calendly-widget-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget w-full"
      data-url="https://calendly.com/y3s-info/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=ff5a00"
      style={{ minWidth: 320, height: 700 }}
    />
  );
}

function Recap({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur-md">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-base font-bold text-foreground">{title}</p>
        <p className="truncate text-base text-muted-foreground/80">{sub}</p>
      </div>
    </div>
  );
}

function BenefitItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-foreground/85">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  );
}