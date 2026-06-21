import { createFileRoute } from "@tanstack/react-router";
import posterAsset from "@/assets/zero-hero-poster.png.asset.json";
import logoAsset from "@/assets/y3s-chalan-logo.png.asset.json";
import { Background } from "@/components/Background";
import { CTA, DayTimeline, DisclaimerFooter, EventChips, HostsBlock, MobileTopBar, RaffleCallout } from "@/components/EventContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zero to Hero — 5-dňový online challenge zdarma | Y3S × Chalan z Burzy" },
      { name: "description", content: "20.–24. júl 2026, 18:00–20:00. Dodo a Lukáš ťa za 5 dní naučia zarábať obchodovaním. 100% online, 100% zdarma, bez kamery." },
      { property: "og:title", content: "Zero to Hero — Online Challenge" },
      { property: "og:description", content: "5 dní naživo s Dodo & Lukášom. Žrebovanie o $500 000 funded účet pre LIVE účastníkov." },
      { property: "og:image", content: posterAsset.url },
      { name: "twitter:image", content: posterAsset.url },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen text-foreground">
      <Background />
      <MobileTopBar />
      <div className="mx-auto flex min-h-screen max-w-[1700px] flex-col justify-center gap-4 px-4 pt-16 pb-16 sm:px-6 lg:gap-6 lg:px-8 lg:py-8 lg:pt-8">
        <header className="flex justify-center">
          <img
            src={logoAsset.url}
            alt="Y3S × Chalan z Burzy"
            className="h-14 w-auto sm:h-16 lg:h-20"
          />
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
        {/* Left: poster */}
        <section className="relative flex items-center justify-center lg:h-full lg:min-h-0">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,oklch(0.72_0.19_45/0.18),transparent_60%)] blur-2xl lg:bg-[radial-gradient(circle_at_center,oklch(0.72_0.19_45/0.35),transparent_60%)]" />
          <div className="glass-strong relative overflow-hidden rounded-3xl p-2 glow-orange lg:p-2.5">
            <img
              src={posterAsset.url}
              alt="Zero to Hero — Online Challenge"
              className="block h-full max-h-[60vh] w-full rounded-2xl object-contain sm:max-h-[70vh] lg:max-h-[min(86vh,960px)] lg:w-auto"
            />
          </div>
        </section>

        {/* Right: info */}
        <section className="flex min-h-0 flex-col justify-center lg:h-full">
          <div className="flex min-h-0 flex-col justify-center gap-4 lg:gap-3">
          <div className="space-y-2">
            <h1 className="font-display text-[clamp(3.5rem,5.6vw,6rem)] font-black leading-[1.05] tracking-normal">
              <span className="block">ZA 5 DNÍ Z TEBA</span>
              <span className="block">UROBÍME </span>
              <span className="block text-gradient-orange">PROFITABILNÉHO TRADERA</span>
            </h1>
            <p className="font-display text-2xl uppercase tracking-[0.06em] text-foreground sm:text-3xl lg:text-[2rem]">
              <span className="text-gradient-orange">20.–24. júl</span> · <span className="text-foreground">18:00–20:00</span>
            </p>
          </div>

          <EventChips />

          <div className="lg:hidden">
            <CTA subline={false} />
          </div>

          <DayTimeline />

          {/* Swapped: hosts first, then the big prize callout near the CTA */}
          <HostsBlock />

          <RaffleCallout />

          <CTA />
          <footer className="pb-[calc(env(safe-area-inset-bottom)+4rem)] text-center text-sm font-semibold leading-snug text-muted-foreground lg:hidden">
            Po registrácii ti pošleme link na živé vysielanie emailom aj SMS. Miesta sú limitované.
          </footer>
          </div>
        </section>
        </div>
        <DisclaimerFooter />
      </div>
    </main>
  );
}
