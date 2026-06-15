export function LivePill() {
  return (
    <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/90">
      <span className="relative flex h-2 w-2">
        <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      Živé vysielanie
    </div>
  );
}