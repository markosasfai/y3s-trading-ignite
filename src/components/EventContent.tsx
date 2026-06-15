import { BadgeDollarSign, VideoOff, Trophy, ShieldCheck, Sparkles, Brain, LineChart, Gift, Calendar } from "lucide-react";
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
      <Chip icon={<Gift className="h-5 w-5" />} tone="amber">Darček pri vstupe</Chip>
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
          className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/55 p-3.5 backdrop-blur-md transition hover:border-primary/40 lg:p-3"
        >
          <div className="-mx-3.5 -mt-3.5 mb-2.5 flex items-center gap-3 border-b border-white/10 bg-black/60 px-3.5 py-2.5 lg:-mx-3 lg:-mt-3 lg:px-3 lg:py-2">
            <span className="font-display text-[2.2rem] leading-none tracking-wide text-foreground lg:text-[1.95rem]">
              DEŇ 0{d.n}
            </span>
          </div>
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary">
              <Calendar className="h-3.5 w-3.5" /> {d.date}
            </p>
            <h3 className="mt-1 text-base font-black leading-tight text-foreground lg:text-[1rem]">
              {d.title}
            </h3>
            <div className="my-1.5 h-px w-10 bg-primary/70" />
            <p className="text-sm leading-snug text-muted-foreground lg:text-[0.85rem]">{d.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RaffleCallout() {
  return (
    <div className="glass-strong relative overflow-hidden rounded-2xl p-3.5 lg:p-3.5">
      <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <img
          src={giftAsset.url}
          alt=""
          width={120}
          height={120}
          loading="lazy"
          className="h-20 w-20 shrink-0 drop-shadow-[0_8px_24px_oklch(0.72_0.19_45/0.55)] sm:h-24 sm:w-24 lg:h-20 lg:w-20"
        />
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.18em] text-amber-300 lg:text-sm">
            <Trophy className="h-4 w-4" /> LIVE žrebovanie
          </p>
          <p className="mt-1 font-display text-[1.7rem] uppercase leading-[0.95] text-foreground lg:text-[1.7rem]">
            Vyhraj <span className="text-gradient-orange">$500 000</span> funded účet
          </p>
          <p className="mt-1.5 text-sm font-semibold text-foreground/85 lg:text-[0.9rem]">
            Klikni na tlačidlo nižšie a vyplň formulár — inak nebudeš v žrebovaní.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HostsBlock() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground lg:text-sm">
        Tvoji hostia
      </p>
      {/* Hosts — no container card; hover floats and enlarges */}
      <div className="relative grid grid-cols-2 gap-4 sm:gap-8">
        <HostInline
          name="Dodo"
          role="Trading mechanics"
          desc="10 rokov v hre. Naučí ťa techniky, taktiky a setupy ako otvárať profitabilné obchody."
          icon={<LineChart className="h-3.5 w-3.5" />}
          img={dodoAsset.url}
        />
        <HostInline
          name="Lukáš"
          role="Psychológia & risk"
          desc="Psychológia obchodovania, risk management a kedy obchod (ne)otvoriť. Mindset hráča."
          icon={<Brain className="h-3.5 w-3.5" />}
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
    <div className="group/host relative flex flex-col items-center text-center transition-all duration-300 hover:z-40">
      {/* Floating expanded card on hover */}
      <div className="pointer-events-none relative">
        <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary/50 transition-all duration-300 group-hover/host:scale-[1.35] group-hover/host:shadow-[0_20px_60px_-10px_oklch(0.72_0.19_45/0.6)] group-hover/host:ring-primary sm:h-24 sm:w-24 lg:h-20 lg:w-20">
          <img src={img} alt={name} className="h-full w-full object-cover" />
        </div>
      </div>
      <p className="mt-2 font-display text-xl uppercase leading-none transition-all duration-300 group-hover/host:scale-110 sm:text-3xl lg:text-2xl">
        {name}
      </p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-wider text-primary sm:text-sm">
        {icon} {role}
      </p>
      <p className="mt-1.5 max-w-[18ch] text-xs leading-snug text-muted-foreground transition-all duration-300 group-hover/host:max-w-[26ch] group-hover/host:text-sm group-hover/host:text-foreground/95 sm:text-sm lg:text-[0.78rem]">
        {desc}
      </p>
    </div>
  );
}

export function GuaranteeLine() {
  return (
    <p className="flex items-start gap-2.5 text-base font-semibold leading-snug text-foreground/90 lg:text-[1.05rem]">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
      <span>
        <span className="font-black text-emerald-400">Garancia:</span> ak budeš dávať pozor, urobíš svoje prvé profitabilné obchody.
      </span>
    </p>
  );
}

export function CTA({ subline = true }: { subline?: boolean }) {
  return (
    <div className="space-y-2">
      <SignupDialog>
        <button className="shimmer-overlay glow-orange group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-primary px-7 py-3.5 text-xl font-black uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] sm:text-2xl">
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