import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowLeft, Phone } from "lucide-react";
import { Background } from "@/components/Background";
import { DisclaimerFooter } from "@/components/EventContent";
import logoAsset from "@/assets/y3s-chalan-logo.png.asset.json";

export const Route = createFileRoute("/1-1-registracia-uspesna")({
  head: () => ({
    meta: [
      { title: "1:1 hovor potvrdený | Y3S × Chalan z Burzy" },
      {
        name: "description",
        content:
          "Tvoj 1:1 hovor je úspešne rezervovaný. Náš špecialista ťa bude čoskoro kontaktovať.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OneOnOneSuccess,
});

function OneOnOneSuccess() {
  return (
    <main className="relative min-h-screen text-foreground">
      <Background />
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-12 flex items-center justify-between">
          <img
            src={logoAsset.url}
            alt="Y3S × Chalan z Burzy"
            className="h-14 w-auto sm:h-16"
          />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Späť
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl backdrop-blur-sm sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-primary/30 blur-3xl"
            />

            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>

            <h1 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              Skvelé! Tvoj 1:1 hovor je rezervovaný.
            </h1>

            <p className="relative mx-auto mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
              Náš špecialista ťa bude čoskoro kontaktovať na dohodnutom termíne.
              Priprav si otázky — pomôžeme ti spraviť ďalší krok.
            </p>

            <div className="relative mx-auto mt-8 flex max-w-sm items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left">
              <Phone className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                Odporúčame mať telefón po ruke — voláme z čísla so slovenskou predvoľbou.
              </p>
            </div>

            <p className="relative mt-8 text-sm text-muted-foreground">
              Ďakujeme za dôveru. Tešíme sa na teba!
            </p>

            <Link
              to="/"
              className="relative mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Späť na úvod
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <DisclaimerFooter />
        </div>
      </div>
    </main>
  );
}
