
# Zero to Hero — Modern Glassy Landing Page

Slovak landing for **Zero to Hero Online Challenge** by Y3S × Chalan z Burzy, hosted by Dodo & Lukáš, **20.–22. jún 2026, 19:00**. Dark + orange, glassy/modern aesthetic. Non-scrollable on desktop, mobile-optimised.

## Routes

- `/` — landing (poster left, info right on desktop; stacked on mobile)
- `/dakujeme` — thank-you (video placeholder, add-to-calendar, Calendly placeholder, recap)

Signup is a glass modal on `/`. On submit → navigate to `/dakujeme`.

## Visual direction — "modern glass"

- Dark warm base (near-black with brown undertone), orange as the only accent.
- Layered **glassmorphism**: `bg-white/5 backdrop-blur-xl border border-white/10` for every card, with an inner highlight (`shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`).
- Ambient background: large blurred orange radial blobs + subtle noise/grain overlay + faint animated grid (CSS only).
- Animated orange gradient border on primary CTAs (conic-gradient via `@property` rotation).
- Soft orange glow shadows on hero poster and CTA.
- Tasteful motion: `fade-in`, `scale-in`, pulsing "● ŽIVÉ" dot, shimmer on CTA hover. No scroll animations (non-scroll page).
- Typography: **Bebas Neue** + **Archivo Black** for display, **Inter** for body (loaded via `<link>` in `__root.tsx`; declared via `@theme` `--font-display` / `--font-sans`).

### Tokens (src/styles.css, @theme inline + :root)

- `--background` near-black warm `oklch(0.14 0.012 50)`
- `--card` `oklch(0.19 0.02 45)` with glass overlay applied via utility
- `--primary` orange `oklch(0.72 0.19 45)` (poster-matched)
- `--primary-glow` `oklch(0.80 0.17 60)`
- `--gradient-primary` `linear-gradient(135deg, var(--primary), var(--primary-glow))`
- `--gradient-radial-orange` for background blobs
- `--shadow-glow` orange-tinted, `--shadow-glass` soft dark
- `--border` `oklch(1 0 0 / 0.10)`
- Custom utilities via `@utility`: `.glass`, `.glass-strong`, `.glow-orange`, `.grain`, `.live-pulse`

## Desktop layout (h-screen, no scroll)

```text
┌────────────────────────────────────────────────────────────────┐
│ [Y3S × Chalan logo]                    [● ŽIVÉ VYSIELANIE]    │
│ ┌────────────────┐  ┌───────────────────────────────────────┐ │
│ │                │  │ ZERO TO HERO                          │ │
│ │  POSTER        │  │ Online Challenge                      │ │
│ │  (glass frame, │  │ 20.–22. JÚN 2026 · 19:00 · ONLINE     │ │
│ │   orange glow) │  │                                       │ │
│ │                │  │ ┌─Deň 1─┬─Deň 2─┬─Deň 3─┐ glass cards│ │
│ │                │  │ │ 20.6. │ 21.6. │ 22.6. │            │ │
│ │                │  │ │ Téma  │ Téma  │ Téma  │            │ │
│ │                │  │ └───────┴───────┴───────┘            │ │
│ │                │  │                                       │ │
│ │                │  │ ⚠ Iba LIVE účastníci sú v žrebovaní  │ │
│ │                │  │   o $500 000 funded účet              │ │
│ │                │  │                                       │ │
│ │                │  │ [ ZAREGISTROVAŤ SA ZADARMO → ]        │ │
│ │                │  │ Hostia: Dodo & Lukáš · 10 r. praxe    │ │
│ └────────────────┘  └───────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

- Outer: `h-screen overflow-hidden grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6 p-6`
- All text sizes use `clamp()` so it fits viewports from ~720px tall upward.
- Background blobs absolutely positioned behind everything.

## Mobile layout (scrollable)

Stacked:
1. Sticky glass top bar (logo + live pill)
2. Poster (full width, glass frame)
3. Headline + dates + ONLINE/ZDARMA/BEZ KAMERY chips
4. **Vertical day timeline** — 3 glass cards with connecting orange gradient line
5. Live-only raffle glass callout (orange tint)
6. Hosts block — Dodo & Lukáš, top traderi v SR, 10 rokov, vlastná komunita, učia naživo, bez kamery, vhodné aj pre začiatočníkov
7. Guarantee line attributed to **Dodo & Lukáš** (not the company)
8. "Obmedzený počet miest" reminder
9. Sticky bottom glass CTA bar

## Signup popup (glass Dialog)

Fields:
- **Meno a priezvisko** (required)
- **Email** (required, validated)
- **Telefón** with country-code selector (default 🇸🇰 +421). Uses `libphonenumber-js`:
  - strips spaces/dashes
  - if user enters leading `0` with a country selected, drops it: `0918 799 977` + 🇸🇰 → `+421918799977`
  - validates with `isValidPhoneNumber`

Microcopy:
> Vyplnením formulára získate **vstupenku zdarma** a ste automaticky v žrebovaní o **funded účet $500 000** od Y3S. Počet miest je obmedzený.

Submit → `console.log` (no backend yet) → `navigate("/dakujeme")`.

## Thank-you page `/dakujeme`

- Glass hero card: "Si v hre! 🎉 Vstupenka je tvoja."
- 16:9 video placeholder (`aspect-video` glass card, play icon)
- Two buttons:
  - **Pridať do kalendára** — generates `.ics` (20.–22. 6. 2026, 19:00 Europe/Bratislava, 3 events)
  - **Zdieľať** (Web Share API + copy-link fallback)
- Event recap chips (dátum, online, live-only raffle)
- **Calendly placeholder** glass card with copy:
  > Nemôžeš sa dočkať? Rezervuj si **bezplatný hovor** s naším trading špecialistom a získaj náskok pred ostatnými. Miest je málo — ako náhle sa kalendár zaplní, ďalšie termíny nepridávame.

## Assets

- Upload poster + Y3S × Chalan logo via `lovable-assets create` from `/mnt/user-uploads/`, import the `.asset.json` pointers.

## Tech

- Routes: `src/routes/index.tsx`, `src/routes/dakujeme.tsx`
- Components: `Background` (blobs+grain+grid), `Logo`, `LivePill`, `HeroPoster`, `EventInfo`, `DayTimeline`, `HostsBlock`, `RaffleCallout`, `CTAButton`, `SignupDialog`, `PhoneInput`, `AddToCalendarButton`, `CalendlyPlaceholder`
- Deps: `libphonenumber-js`
- `<html lang="sk">` in `__root.tsx`; fonts loaded via `<link>`
- SEO: title "Zero to Hero — 3-dňový online challenge zdarma | Y3S × Chalan z Burzy", description, `og:image` = poster

## Out of scope (placeholders)

- Real signup backend / email
- Real Calendly embed
- Real thank-you video
