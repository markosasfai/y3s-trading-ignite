export function LivePill() {
  return (
    <div className="glass inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm font-black uppercase tracking-[0.14em] text-foreground lg:px-6 lg:py-2.5 lg:text-base">
      <span className="relative flex h-3 w-3 lg:h-3.5 lg:w-3.5">
        <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-destructive/70" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive lg:h-3.5 lg:w-3.5" />
      </span>
      Živé vysielanie
    </div>
  );
}