import { createFileRoute } from "@tanstack/react-router";
import posterAsset from "@/assets/zero-hero-poster.png.asset.json";
import logoAsset from "@/assets/y3s-chalan-logo.png.asset.json";
import { Background } from "@/components/Background";
import { CTA, DayTimeline, EventChips, HostsBlock, LivePill, RaffleCallout } from "@/components/EventContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zero to Hero — 3-dňový online challenge zdarma | Y3S × Chalan z Burzy" },
      { name: "description", content: "20.–22. jún 2026, 19:00. Dodo a Lukáš ťa za 3 dni naučia zarábať obchodovaním. 100% online, 100% zdarma, bez kamery." },
      { property: "og:title", content: "Zero to Hero — Online Challenge" },
      { property: "og:description", content: "3 dni naživo s Dodo & Lukášom. Žrebovanie o $500 000 funded účet pre LIVE účastníkov." },
      { property: "og:image", content: posterAsset.url },
      { name: "twitter:image", content: posterAsset.url },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen text-foreground lg:h-screen lg:overflow-hidden">
      <Background />
      {/* Desktop: 2-col, no scroll. Mobile: stacked, scrollable */}
      <div className="mx-auto flex h-full max-w-[1400px] flex-col gap-6 px-4 py-5 sm:px-6 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:py-6">
        {/* Header (mobile) */}
        <header className="flex items-center justify-between lg:hidden">
          <img src={logoAsset.url} alt="Y3S × Chalan z Burzy" className="h-10 w-auto" />
          <LivePill />
        </header>

        {/* Left: poster */}
        <section className="relative flex items-center justify-center lg:h-full lg:py-2">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,oklch(0.72_0.19_45/0.35),transparent_60%)] blur-2xl" />
          <div className="glass-strong relative overflow-hidden rounded-3xl p-2 glow-orange">
            <img
              src={posterAsset.url}
              alt="Zero to Hero — Online Challenge"
              className="block h-full max-h-[min(72vh,720px)] w-auto rounded-2xl object-contain"
            />
          </div>
        </section>

        {/* Right: info */}
        <section className="flex min-h-0 flex-col gap-3 lg:h-full lg:gap-3 lg:py-2">
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 lg:gap-3.5">
          <div className="space-y-2">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-primary">
              Y3S × Chalan z Burzy uvádzajú
            </p>
            <h1 className="font-display text-[clamp(2.25rem,5.2vw,4.5rem)] font-black leading-[0.92] tracking-tight">
              <span className="block">ZERO TO</span>
              <span className="block text-gradient-orange">HERO</span>
            </h1>
            <p className="font-display text-lg uppercase tracking-[0.2em] text-foreground/85 lg:text-xl">
              Online Challenge · 20.–22. jún 2026 · 19:00
            </p>
          </div>

          <EventChips />

          <DayTimeline />

          <RaffleCallout />

          <HostsBlock />

          <CTA />
          </div>

          {/* Footer bar (desktop): logo + live pill */}
          <div className="hidden items-center justify-between border-t border-white/10 pt-3 lg:flex">
            <img src={logoAsset.url} alt="Y3S × Chalan z Burzy" className="h-10 w-auto opacity-90" />
            <LivePill />
          </div>
        </section>
      </div>
    </main>
  );
}
