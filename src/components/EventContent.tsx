import { Gift, BadgeDollarSign, VideoOff, Trophy, Users, ShieldCheck, Sparkles } from "lucide-react";
import { LivePill } from "./LivePill";
import { SignupDialog } from "./SignupDialog";

const DAYS = [
  {
    n: 1,
    date: "20. jún",
    title: "Základy obchodovania",
    desc: "Mindset, riadenie rizika a ako čítať trh od nuly.",
  },
  {
    n: 2,
    date: "21. jún",
    title: "Stratégia v praxi",
    desc: "Live setupy, vstupy a výstupy priamo na obrazovke.",
  },
  {
    n: 3,
    date: "22. jún",
    title: "Tvoj prvý profit",
    desc: "Vlastné obchody pod dohľadom Dodo a Lukáša.",
  },
];

export function EventChips() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip icon={<Sparkles className="h-3.5 w-3.5" />}>100% online</Chip>
      <Chip icon={<BadgeDollarSign className="h-3.5 w-3.5" />}>100% zdarma</Chip>
      <Chip icon={<VideoOff className="h-3.5 w-3.5" />}>Bez kamery</Chip>
      <Chip icon={<Gift className="h-3.5 w-3.5" />}>Darček pri vstupe</Chip>
    </div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-foreground/90">
      <span className="text-primary">{icon}</span>
      {children}
    </span>
  );
}

export function DayTimeline({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  if (orientation === "vertical") {
    return (
      <ol className="relative space-y-3 pl-6">
        <span className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary-glow to-transparent" />
        {DAYS.map((d) => (
          <li key={d.n} className="relative">
            <span className="absolute -left-[1.35rem] top-3 h-3 w-3 rounded-full bg-primary glow-orange" />
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                <span>Deň {d.n}</span>
                <span className="text-primary">{d.date}</span>
              </div>
              <h3 className="mt-1 font-display text-xl uppercase">{d.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2 lg:gap-3">
      {DAYS.map((d) => (
        <div key={d.n} className="glass relative overflow-hidden rounded-2xl p-3 lg:p-4">
          <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Deň {d.n}</span>
            <span className="text-primary">{d.date}</span>
          </div>
          <h3 className="relative mt-1 font-display text-base uppercase leading-tight lg:text-lg">
            {d.title}
          </h3>
          <p className="relative mt-1 line-clamp-2 text-[11px] text-muted-foreground lg:text-xs">
            {d.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

export function RaffleCallout() {
  return (
    <div className="glass relative overflow-hidden rounded-2xl border-primary/30 p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-primary/10" />
      <div className="relative flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground glow-orange">
          <Trophy className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide">
            Iba LIVE účastníci → žrebovanie o{" "}
            <span className="text-gradient-orange">$500&nbsp;000 funded účet</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Musíš byť pripojený naživo všetky tri dni. Žiadne nahrávky, žiadne výnimky.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HostsBlock() {
  return (
    <div className="glass flex items-start gap-3 rounded-2xl p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
        <Users className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 text-sm">
        <p className="font-semibold">
          Hostia: <span className="text-gradient-orange">Dodo &amp; Lukáš</span>
        </p>
        <p className="mt-1 text-muted-foreground">
          Top traderi na Slovensku, 10 rokov skúseností, vlastná komunita. Naučia ťa obchodovať naživo — aj keď začínaš od nuly a nemáš kameru.
        </p>
        <p className="mt-2 inline-flex items-start gap-1.5 text-xs text-foreground/85">
          <ShieldCheck className="mt-[2px] h-3.5 w-3.5 shrink-0 text-primary" />
          <span>
            <span className="font-semibold">Dodo &amp; Lukáš garantujú:</span> ak budete dávať pozor, urobíte svoje prvé profitabilné obchody.
          </span>
        </p>
      </div>
    </div>
  );
}

export function CTA({ subline = true }: { subline?: boolean }) {
  return (
    <div className="space-y-2">
      <SignupDialog>
        <button className="shimmer-overlay glow-orange group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-primary px-6 py-4 text-base font-bold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] sm:text-lg">
          Zaregistrovať sa zadarmo →
        </button>
      </SignupDialog>
      {subline && (
        <p className="text-center text-xs text-muted-foreground">
          Obmedzený počet miest · 100% zdarma · bez kamery
        </p>
      )}
    </div>
  );
}

export { LivePill };