import { BadgeDollarSign, VideoOff, ShieldCheck, Sparkles, Brain, LineChart, Calendar, ArrowRight } from "lucide-react";
import { LivePill } from "./LivePill";
import { SignupDialog } from "./SignupDialog";
import dodoAsset from "@/assets/dodo.png.asset.json";
import lukasAsset from "@/assets/lukas.png.asset.json";
import giftAsset from "@/assets/gift-3d.png.asset.json";

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
      <Chip icon={<Sparkles className="h-5 w-5" />} tone="sky">100% online</Chip>
      <Chip icon={<BadgeDollarSign className="h-5 w-5" />} tone="emerald">100% zdarma</Chip>
      <Chip icon={<VideoOff className="h-5 w-5" />} tone="violet">Bez kamery</Chip>
    </div>
  );
}

const TONES = {
  sky:     { ring: "ring-sky-400/40",     bg: "bg-sky-400/10",     text: "text-sky-300",     glow: "shadow-[0_0_24px_-8px_oklch(0.75_0.15_240)]" },
  emerald: { ring: "ring-emerald-400/40", bg: "bg-emerald-400/10", text: "text-emerald-300", glow: "shadow-[0_0_24px_-8px_oklch(0.75_0.15_160)]" },
  violet:  { ring: "ring-violet-400/40",  bg: "bg-violet-400/10",  text: "text-violet-300",  glow: "shadow-[0_0_24px_-8px_oklch(0.70_0.18_300)]" },
  amber:   { ring: "ring-amber-400/45",   bg: "bg-amber-400/12",   text: "text-amber-300",   glow: "shadow-[0_0_24px_-8px_oklch(0.80_0.16_75)]" },
  rose:    { ring: "ring-rose-400/40",    bg: "bg-rose-400/10",    text: "text-rose-300",    glow: "shadow-[0_0_24px_-8px_oklch(0.70_0.18_15)]" },
} as const;

function Chip({ icon, children, tone = "amber" }: { icon: React.ReactNode; children: React.ReactNode; tone?: keyof typeof TONES }) {
  const t = TONES[tone];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold text-foreground/95 ring-1 backdrop-blur-md lg:text-[1rem] ${t.bg} ${t.ring} ${t.glow}`}>
      <span className={t.text}>{icon}</span>
      {children}
    </span>
  );
}

export function DayTimeline(_props: { orientation?: "horizontal" | "vertical" } = {}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {DAYS.map((d) => (
        <div
          key={d.n}
          className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/60 p-4 backdrop-blur-md transition hover:border-primary/50 hover:shadow-[0_0_30px_-10px_oklch(0.72_0.19_45/0.55)] lg:border-primary/30 lg:from-primary/10"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-[2.4rem] leading-none tracking-wide text-gradient-orange">
              DEŇ 0{d.n}
            </span>
            <span className="inline-flex items-center gap-1 text-[0.8rem] font-black uppercase tracking-wider text-primary">
              <Calendar className="h-3.5 w-3.5" /> {d.date}
            </span>
          </div>
          <div className="my-2.5 h-px w-full bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
          <h3 className="text-lg font-black leading-tight text-foreground">
            {d.title}
          </h3>
          <p className="mt-1.5 text-[0.95rem] leading-snug text-foreground/75">{d.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function RaffleCallout() {
  return (
    <div className="space-y-2.5">
      <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-foreground/80 sm:text-sm">
        Môžeš vyhrať <span className="text-gradient-orange">2 darčeky</span>
      </p>
      <PrizeCard
        index={1}
        tone="sky"
        title={<>Špeciálny darček <span className="text-sky-300">hneď po registrácii</span></>}
        desc="Príde ti okamžite na email — bez čakania."
      />
      <PrizeCard
        index={2}
        tone="emerald"
        title={<><span className="text-emerald-300">$500 000</span> funded účet</>}
        desc="Žrebujeme naživo počas eventu — musíš byť s nami."
      />
    </div>
  );
}

function PrizeCard({
  index,
  tone,
  title,
  desc,
}: {
  index: number;
  tone: "sky" | "emerald";
  title: React.ReactNode;
  desc: string;
}) {
  const styles =
    tone === "sky"
      ? {
          border: "border-sky-400/35",
          bg: "from-sky-500/15 to-background/85",
          shadow: "shadow-[0_0_30px_-12px_oklch(0.75_0.15_240/0.6)]",
          glow1: "bg-sky-400/25",
          glow2: "bg-sky-300/15",
          number: "text-sky-400/15",
          dropShadow: "drop-shadow-[0_8px_24px_oklch(0.75_0.15_240/0.55)]",
        }
      : {
          border: "border-emerald-400/35",
          bg: "from-emerald-500/15 to-background/85",
          shadow: "shadow-[0_0_30px_-12px_oklch(0.75_0.15_160/0.6)]",
          glow1: "bg-emerald-400/25",
          glow2: "bg-emerald-300/15",
          number: "text-emerald-400/15",
          dropShadow: "drop-shadow-[0_8px_24px_oklch(0.75_0.15_160/0.55)]",
        };
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${styles.border} bg-gradient-to-b ${styles.bg} p-3.5 backdrop-blur-md ${styles.shadow}`}>
      <div className={`pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full ${styles.glow1} blur-3xl`} />
      <div className={`pointer-events-none absolute -bottom-20 -left-10 h-36 w-36 rounded-full ${styles.glow2} blur-3xl`} />
      <div className="relative flex items-center gap-3.5">
        <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
          <span className={`pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[6rem] leading-none ${styles.number} sm:text-[7rem]`}>
            {index}
          </span>
          <img
            src={giftAsset.url}
            alt=""
            loading="lazy"
            className={`relative h-full w-full ${styles.dropShadow}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[1.55rem] uppercase leading-[0.95] text-foreground sm:text-[1.8rem]">
            {title}
          </p>
          <p className="mt-1.5 text-[0.85rem] font-semibold text-foreground/80 sm:text-[0.95rem]">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HostsBlock() {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground lg:text-sm">
        Tvoji hostia
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <HostInline
          name="Dodo"
          role="Trading mechanics"
          desc="10 rokov v hre. Techniky, taktiky a setupy pre profitabilné obchody."
          icon={<LineChart className="h-4 w-4" />}
          img={dodoAsset.url}
        />
        <HostInline
          name="Lukáš"
          role="Psychológia & risk"
          desc="Psychológia, risk management a kedy obchod (ne)otvoriť."
          icon={<Brain className="h-4 w-4" />}
          img={lukasAsset.url}
        />
      </div>
    </div>
  );
}

function HostInline({
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
    <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/60">
        <img src={img} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-2xl uppercase leading-none">{name}</p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-[0.72rem] font-black uppercase tracking-wider text-primary">
          {icon} {role}
        </p>
        <p className="mt-1.5 text-[0.85rem] leading-snug text-foreground/75">{desc}</p>
      </div>
    </div>
  );
}

export function GuaranteeLine() {
  return (
    <p className="flex items-start gap-2.5 text-base font-semibold leading-snug text-foreground/90 lg:text-[1.05rem]">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
      <span>
        <span className="font-black text-emerald-400">Garancia:</span> ak budeš s nami naživo všetky 3 dni, naučíš sa robiť profitabilné obchody.
      </span>
    </p>
  );
}

export function CTA({ subline = true }: { subline?: boolean }) {
  return (
    <div className="space-y-2">
      <SignupDialog>
        <button className="shimmer-overlay glow-orange group relative flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-primary px-7 py-4 text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]">
          <span className="text-base font-black uppercase leading-tight tracking-wide text-black sm:text-2xl">
            Registruj sa zadarmo a získaj darček →
          </span>
          <span className="text-[0.7rem] font-medium leading-snug text-black/75 sm:text-sm">
            Darček ti príde hneď po registrácii — žiadne čakanie.
          </span>
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

export function MobileTopCTA() {
  return (
    <SignupDialog>
      <button className="shimmer-overlay glow-orange inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-primary px-5 py-3.5 text-base font-black uppercase tracking-wide text-primary-foreground sm:text-lg lg:hidden">
        Registrovať teraz
        <ArrowRight className="h-5 w-5" />
      </button>
    </SignupDialog>
  );
}

export function MobileTopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-30 lg:hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-background/80 px-3 py-2 backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.18em] text-foreground">
          <span className="relative flex h-2.5 w-2.5">
            <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-destructive opacity-80" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive shadow-[0_0_10px_2px_oklch(0.65_0.22_25)]" />
          </span>
          Naživo
        </div>
        <SignupDialog>
          <button className="shimmer-overlay glow-orange inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-[0.78rem] font-black uppercase tracking-wider text-primary-foreground">
            Registrovať
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </SignupDialog>
      </div>
    </div>
  );
}

export { LivePill };