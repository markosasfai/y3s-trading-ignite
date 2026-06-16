import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Calendar, Play, Share2, Trophy, VideoOff, BadgeDollarSign, ArrowLeft, PhoneCall } from "lucide-react";
import { Background } from "@/components/Background";
import logoAsset from "@/assets/y3s-chalan-logo.png.asset.json";

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
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex items-center justify-between">
          <img src={logoAsset.url} alt="Y3S × Chalan z Burzy" className="h-16 w-auto sm:h-20" />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Späť
          </Link>
        </div>

        <section className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-10">
          <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-primary-glow/25 blur-3xl" />
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 font-display text-xs uppercase tracking-[0.3em] text-primary ring-1 ring-primary/40">
            Vstupenka potvrdená
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-black leading-[0.95]">
            Si v hre! <span className="text-gradient-orange">Vidíme sa naživo.</span>
          </h1>
          <p className="mt-3 max-w-xl text-foreground/85">
            Posielame ti potvrdenie na email. Pre vstup do žrebovania o{" "}
            <span className="text-gradient-orange font-semibold">$500 000 funded účet</span> sa pripoj naživo
            <span className="font-semibold text-foreground"> 20.–24. júla 2026 o 19:00</span>.
          </p>

          {/* Video placeholder */}
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-2xl glow-orange">
                <Play className="h-7 w-7 translate-x-[2px]" />
              </div>
            </div>
            <p className="absolute bottom-3 left-4 text-xs uppercase tracking-wider text-muted-foreground">
              Video čoskoro
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              onClick={downloadIcs}
              className="shimmer-overlay glow-orange relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.01]"
            >
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Pridať do kalendára
              </span>
            </button>
            <button
              onClick={share}
              className="glass rounded-2xl px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Zdieľať s kamarátom
              </span>
            </button>
          </div>
        </section>

        {/* Recap */}
        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <Recap icon={<Calendar className="h-4 w-4" />} title="20.–24. júl 2026" sub="19:00 (CET)" />
          <Recap icon={<VideoOff className="h-4 w-4" />} title="Bez kamery" sub="100 % online" />
          <Recap icon={<Trophy className="h-4 w-4" />} title="LIVE žrebovanie" sub="$500 000 funded účet" />
        </section>

        {/* Calendly placeholder */}
        <section className="glass-strong relative mt-6 overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="relative">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
              VIP náskok
            </p>
            <h2 className="mt-2 font-display text-2xl uppercase sm:text-3xl">
              Nemôžeš sa dočkať? <span className="text-gradient-orange">Rezervuj si hovor zdarma.</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Bezplatný hovor s naším trading špecialistom z tímu Y3S. Pred ostatnými ti povieme, čo presne sa na challenge naučíš, a dáme ti extra tipy.{" "}
              <span className="text-foreground/90">
                Miest je málo — keď sa kalendár zaplní, ďalšie termíny nepridávame.
              </span>
            </p>

            <div className="mt-5">
              <CalendlyInlineWidget />
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © Y3S × Chalan z Burzy · Garancia profitabilných obchodov je vyjadrením Dodo &amp; Lukáša, nie spoločnosti.
        </p>
      </div>
    </main>
  );
}

function Recap({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/40">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}