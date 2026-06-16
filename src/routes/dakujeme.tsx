import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Calendar, Play, Share2, Trophy, VideoOff, ArrowLeft, CheckCircle2, Gift, Clock, MessageCircle, Sparkles, AlertTriangle } from "lucide-react";
import { DisclaimerFooter } from "@/components/EventContent";
import { Background } from "@/components/Background";
import logoAsset from "@/assets/y3s-chalan-logo.png.asset.json";
import giftAsset from "@/assets/gift-3d.png.asset.json";

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
                <button
                  onClick={downloadIcs}
                  className="shimmer-overlay glow-orange relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-glow px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.01] sm:flex-none"
                >
                  <Calendar className="h-5 w-5" /> Pridať do kalendára
                </button>
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

        {/* Quick Stats Grid */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Recap icon={<Calendar className="h-6 w-6" />} title="20.–24. júla 2026" sub="19:00 (CET)" />
          <Recap icon={<VideoOff className="h-6 w-6" />} title="Bez kamery" sub="100 % online" />
          <Recap icon={<Trophy className="h-6 w-6" />} title="LIVE žrebovanie" sub="$500 000 funded účet" />
        </section>

        {/* VIP Call Section — gift / bluish tint */}
        <section className="relative mt-10 overflow-hidden rounded-[2rem] border border-sky-400/20 bg-gradient-to-br from-sky-950/40 via-card/60 to-card/40 backdrop-blur-2xl">
          <div className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />

          <div className="relative p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,1.2fr)] lg:items-center">
              {/* Gift visual */}
              <div className="relative mx-auto w-full max-w-sm">
                <div className="absolute inset-0 rounded-[2rem] bg-sky-400/20 blur-3xl" />
                <img
                  src={giftAsset.url}
                  alt="Tvoj bonusový darček: hovor s trading špecialistom"
                  className="relative w-full drop-shadow-[0_20px_50px_rgba(56,189,248,0.35)]"
                />
                <div className="relative mt-4 flex items-center justify-center gap-3 text-center">
                  <span className="font-display text-lg font-bold uppercase tracking-wider text-muted-foreground line-through decoration-2">
                    250 €
                  </span>
                  <span className="rounded-full bg-sky-400 px-4 py-1.5 font-display text-sm font-black uppercase tracking-wider text-sky-950 shadow-[0_0_24px_rgba(56,189,248,0.45)]">
                    Zdarma pre teba
                  </span>
                </div>
              </div>

              {/* Copy */}
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                  <Gift className="h-3.5 w-3.5" /> Tvoj bonus k vstupenke
                </p>
                <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] font-black uppercase leading-[1.05]">
                  Hovor 1:1 s naším{" "}
                  <span className="bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
                    trading špecialistom.
                  </span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-foreground/75 sm:text-lg">
                  Bežne za tento hovor ľudia platia. Ty ho máš ako darček k vstupenke — stačí sa zapísať.
                </p>

                <ul className="mt-6 space-y-3 text-sm sm:text-base">
                  <BenefitItem icon={<MessageCircle className="h-4 w-4" />}>
                    Spýtaj sa čokoľvek o evente alebo o tradingu vo všeobecnosti
                  </BenefitItem>
                  <BenefitItem icon={<Sparkles className="h-4 w-4" />}>
                    Extra tipy a personalizovaný plán ešte pred štartom
                  </BenefitItem>
                  <BenefitItem icon={<Clock className="h-4 w-4" />}>
                    Vyber si čas, ktorý ti sadne — 30 minút, online
                  </BenefitItem>
                </ul>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100/90">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <p>
                    <span className="font-semibold text-amber-200">Keď sa kalendár zaplní, končíme.</span>{" "}
                    Ďalšie termíny už nepridávame — vyber si voľný slot teraz, kým je.
                  </p>
                </div>
              </div>
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
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground/70">{sub}</p>
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