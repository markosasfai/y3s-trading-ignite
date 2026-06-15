import { Gift, BadgeDollarSign, VideoOff, Trophy, ShieldCheck, Sparkles, Brain, LineChart } from "lucide-react";
import { LivePill } from "./LivePill";
import { SignupDialog } from "./SignupDialog";
import dodoAsset from "@/assets/dodo.png.asset.json";
import lukasAsset from "@/assets/lukas.png.asset.json";

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
      <Chip icon={<Sparkles className="h-4 w-4" />}>100% online</Chip>
      <Chip icon={<BadgeDollarSign className="h-4 w-4" />}>100% zdarma</Chip>
      <Chip icon={<VideoOff className="h-4 w-4" />}>Bez kamery</Chip>
      <Chip icon={<Gift className="h-4 w-4" />}>Darček pri vstupe</Chip>
    </div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/90">
      <span className="text-primary">{icon}</span>
      {children}
    </span>
  );
}

export function DayTimeline(_props: { orientation?: "horizontal" | "vertical" } = {}) {
  return (
    <div className="space-y-2.5">
      {DAYS.map((d) => (
        <div
          key={d.n}
          className="glass relative flex items-center gap-4 overflow-hidden rounded-2xl bg-black/40 p-3.5 pr-5 lg:p-4"
        >
          <div className="relative flex h-[4.5rem] w-[5.5rem] shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-primary-glow/10 lg:h-20 lg:w-28">
            <span className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-primary/90 lg:text-xs">
              Deň
            </span>
            <span className="font-display text-[3rem] leading-[0.85] text-gradient-orange lg:text-[3.5rem]">
              {d.n}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-[0.2em] text-primary/90 lg:text-sm">
              {d.date}
            </div>
            <h3 className="mt-0.5 font-display text-xl uppercase leading-tight lg:text-2xl">
              {d.title}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{d.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RaffleCallout() {
  return (
    <div className="glass-strong relative overflow-hidden rounded-2xl bg-black/50 p-4 lg:p-5">
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-primary-glow/15 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="relative grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground glow-orange lg:h-20 lg:w-20">
          <Gift className="h-9 w-9 lg:h-10 lg:w-10" />
          <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-background text-xs font-bold text-primary ring-2 ring-primary">
            !
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <Trophy className="mr-1 inline h-3.5 w-3.5" /> LIVE žrebovanie · darček
          </p>
          <p className="mt-1 font-display text-[1.65rem] uppercase leading-[0.95] text-foreground lg:text-3xl">
            Vyhraj{" "}
            <span className="text-gradient-orange">$500 000</span>{" "}
            funded účet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Iba pre LIVE účastníkov všetky 3 dni. Žiadne nahrávky.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HostsBlock() {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Tvoji hostia
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        <HostCard
          name="Dodo"
          role="Trading mechanics"
          desc="10 rokov v hre. Naučí ťa techniky, taktiky a setupy."
          icon={<LineChart className="h-3.5 w-3.5" />}
          img={dodoAsset.url}
        />
        <HostCard
          name="Lukáš"
          role="Psychológia & risk"
          desc="Mindset, risk management a kedy do obchodu (ne)ísť."
          icon={<Brain className="h-3.5 w-3.5" />}
          img={lukasAsset.url}
        />
      </div>
      <p className="inline-flex items-start gap-1.5 px-1 text-sm text-foreground/85">
        <ShieldCheck className="mt-[2px] h-4 w-4 shrink-0 text-primary" />
        <span>
          <span className="font-semibold">Garancia:</span> ak budeš dávať pozor, urobíš svoje prvé profitabilné obchody.
        </span>
      </p>
    </div>
  );
}

function HostCard({
  name,
  role,
  desc,
  icon,
  img,
}: {
  name: string;
  role: string;
  desc: string;
  icon: React.ReactNode;
  img: string;
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl bg-black/40 p-3.5">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/40">
        <img src={img} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-xl uppercase leading-none">{name}</p>
        <p className="mt-1.5 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-primary">
          {icon} {role}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{desc}</p>
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