import { Gift, BadgeDollarSign, VideoOff, Trophy, ShieldCheck, Sparkles, Brain, LineChart } from "lucide-react";
import { LivePill } from "./LivePill";
import { SignupDialog } from "./SignupDialog";
import dodoAsset from "@/assets/dodo.png.asset.json";
import lukasAsset from "@/assets/lukas.png.asset.json";

const DAYS = [
  {
    n: 1,
    label: "Deň 1",
    date: "20. jún",
    title: "Základy obchodovania",
    desc: "Mindset, riadenie rizika a ako čítať trh od nuly.",
  },
  {
    n: 2,
    label: "Deň 2",
    date: "21. jún",
    title: "Stratégia v praxi",
    desc: "Live setupy, vstupy a výstupy priamo na obrazovke.",
  },
  {
    n: 3,
    label: "Deň 3",
    date: "22. jún",
    title: "Tvoj prvý profit",
    desc: "Vlastné obchody pod dohľadom Dodo a Lukáša.",
  },
];

export function EventChips() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Chip icon={<Sparkles className="h-5 w-5" />}>100% online</Chip>
      <Chip icon={<BadgeDollarSign className="h-5 w-5" />}>100% zdarma</Chip>
      <Chip icon={<VideoOff className="h-5 w-5" />}>Bez kamery</Chip>
      <Chip icon={<Gift className="h-5 w-5" />}>Darček pri vstupe</Chip>
    </div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold text-foreground/95 lg:text-lg">
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
          className="glass relative flex items-center gap-4 overflow-hidden rounded-2xl bg-card/80 p-3.5 pr-5 lg:gap-5 lg:p-3.5"
        >
          <div className="relative flex h-18 w-30 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary-glow/10 ring-1 ring-primary/35 lg:h-20 lg:w-36">
            <span className="font-display text-[2.35rem] uppercase leading-none text-foreground lg:text-[2.7rem]">
              <span className="text-primary">Deň</span> {d.n}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-black uppercase tracking-[0.16em] text-primary lg:text-[0.95rem]">
              {d.date}
            </div>
            <h3 className="mt-0.5 font-display text-2xl uppercase leading-none lg:text-[1.85rem]">
              {d.title}
            </h3>
            <p className="mt-1 text-base leading-snug text-muted-foreground lg:text-[1.05rem]">{d.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RaffleCallout() {
  return (
    <div className="glass-strong relative overflow-hidden rounded-2xl bg-card/90 p-4 lg:p-4.5">
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-primary-glow/15 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="relative grid h-18 w-18 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground glow-orange lg:h-20 lg:w-20">
          <Gift className="h-9 w-9 lg:h-10 lg:w-10" />
          <span className="absolute -top-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full bg-background text-sm font-black text-primary ring-2 ring-primary">
            !
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary lg:text-[0.95rem]">
            <Trophy className="mr-1.5 inline h-5 w-5" /> LIVE žrebovanie · darček
          </p>
          <p className="mt-1 font-display text-[2.05rem] uppercase leading-[0.9] text-foreground lg:text-[2.35rem]">
            Vyhraj{" "}
            <span className="text-gradient-orange">$500 000</span>{" "}
            funded účet
          </p>
          <p className="mt-1.5 text-base font-semibold text-foreground/85 lg:text-[1.05rem]">
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
      <p className="text-sm font-black uppercase tracking-[0.25em] text-muted-foreground lg:text-base">
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
      <p className="glass-strong inline-flex items-start gap-3 rounded-2xl bg-card/90 px-4 py-3 text-lg font-semibold leading-snug text-foreground lg:text-[1.15rem]">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
        <span>
          <span className="font-black text-primary">Garancia:</span> ak budeš dávať pozor, urobíš svoje prvé profitabilné obchody.
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
    <div className="glass flex items-center gap-4 rounded-2xl bg-card/80 p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/50 lg:h-24 lg:w-24">
        <img src={img} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-2xl uppercase leading-none lg:text-3xl">{name}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wide text-primary">
          {icon} {role}
        </p>
        <p className="mt-1.5 line-clamp-2 text-base leading-snug text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export function CTA({ subline = true }: { subline?: boolean }) {
  return (
    <div className="space-y-2.5">
      <SignupDialog>
        <button className="shimmer-overlay glow-orange group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-primary px-7 py-5 text-xl font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] sm:text-2xl">
          Zaregistrovať sa zadarmo →
        </button>
      </SignupDialog>
      {subline && (
        <p className="text-center text-base font-semibold text-muted-foreground lg:text-lg">
          Obmedzený počet miest · 100% zdarma · bez kamery
        </p>
      )}
    </div>
  );
}

export { LivePill };