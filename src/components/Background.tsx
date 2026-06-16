export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* deep near-black base with warm orange wash */}
      <div className="absolute inset-0 bg-[oklch(0.07_0.012_45)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,oklch(0.22_0.09_45/0.45),transparent_55%),radial-gradient(circle_at_85%_90%,oklch(0.20_0.08_35/0.35),transparent_55%)]" />
      {/* floating warm blobs */}
      <div className="blob-float absolute -top-32 -left-32 h-[40rem] w-[40rem] rounded-full bg-primary/12 blur-[180px]" />
      <div
        className="blob-float absolute -bottom-40 -right-32 h-[36rem] w-[36rem] rounded-full bg-[oklch(0.55_0.18_35)]/14 blur-[180px]"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="blob-float absolute top-1/3 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[oklch(0.45_0.15_25)]/10 blur-[200px]"
        style={{ animationDelay: "-3.5s" }}
      />
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.85_0.05_45) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.85_0.05_45) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 75%)",
        }}
      />
      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}