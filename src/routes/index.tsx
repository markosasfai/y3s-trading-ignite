import { createFileRoute } from "@tanstack/react-router";
import posterAsset from "@/assets/zero-hero-poster.png.asset.json";
import logoAsset from "@/assets/y3s-chalan-logo.png.asset.json";
import { Background } from "@/components/Background";
import { CTA, DayTimeline, EventChips, GuaranteeLine, HostsBlock, LivePill, RaffleCallout } from "@/components/EventContent";

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
      <div className="mx-auto flex h-full max-w-[1700px] flex-col gap-5 px-4 py-5 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:px-8 lg:py-4">
        {/* Header (mobile) */}
        <header className="flex items-center justify-between lg:hidden">
          <img src={logoAsset.url} alt="Y3S × Chalan z Burzy" className="h-12 w-auto" />
          <LivePill />
        </header>

        {/* Left: poster */}
        <section className="relative flex items-center justify-center lg:h-full">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,oklch(0.72_0.19_45/0.35),transparent_60%)] blur-2xl" />
          <div className="glass-strong relative overflow-hidden rounded-3xl p-2 glow-orange lg:p-2.5">
            <img
              src={posterAsset.url}
              alt="Zero to Hero — Online Challenge"
              className="block h-full max-h-[60vh] w-full rounded-2xl object-contain sm:max-h-[70vh] lg:max-h-[min(89vh,980px)] lg:w-auto"
            />
          </div>
        </section>

        {/* Right: info */}
        <section className="flex min-h-0 flex-col justify-center lg:h-full">
          <div className="flex min-h-0 flex-col justify-center gap-4 lg:gap-3">
          <div className="space-y-2">
            <div className="hidden items-center justify-between gap-4 lg:flex">
              <img src={logoAsset.url} alt="Y3S × Chalan z Burzy" className="h-14 w-auto" />
              <LivePill />
            </div>
            <p className="font-display text-base uppercase tracking-[0.25em] text-primary lg:text-lg">
              Y3S × Chalan z Burzy uvádzajú
            </p>
            <h1 className="font-display text-[clamp(3rem,4.4vw,4.8rem)] font-black leading-[0.84] tracking-normal">
              <span className="block">ZERO TO</span>
              <span className="block text-gradient-orange">HERO</span>
            </h1>
            <p className="font-display text-xl uppercase tracking-[0.1em] text-foreground/90 sm:text-2xl lg:text-[1.35rem]">
              Online Challenge · 20.–22. jún 2026 · 19:00
            </p>
          </div>

          <EventChips />

          <DayTimeline />

          {/* Swapped: hosts first, then the big prize callout near the CTA */}
          <HostsBlock />

          <GuaranteeLine />

          <RaffleCallout />

          <CTA />
          </div>
        </section>
      </div>
    </main>
  );
}
