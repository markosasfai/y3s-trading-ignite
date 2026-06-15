export function LivePill() {
  return (
    <div className="live-glow inline-flex items-center gap-2.5 rounded-full border border-destructive/60 bg-destructive/15 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-destructive-foreground backdrop-blur-md lg:px-5 lg:py-2 lg:text-sm">
      <span className="relative flex h-2.5 w-2.5 lg:h-3 lg:w-3">
        <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-destructive opacity-80" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive shadow-[0_0_12px_2px_oklch(0.65_0.22_25)] lg:h-3 lg:w-3" />
      </span>
      <span className="text-foreground">Živé vysielanie</span>
    </div>
  );
}