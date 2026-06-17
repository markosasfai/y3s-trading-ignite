## Meta Conversion API (CAPI) — full mirror with deduplication

### What gets built

**1. Backend secret**
- Add `META_CAPI_ACCESS_TOKEN` (you'll grab it from Meta Events Manager → Datasets → your Pixel → Settings → "Generate access token" under Conversions API).
- Pixel ID `27493926233578072` is hardcoded (already public).

**2. Server function `sendCapiEvent`** (`src/lib/capi.functions.ts`)
- Public `createServerFn` (no auth — site is public).
- Accepts: `event_name`, `event_id`, `event_time`, `event_source_url`, `action_source` (`"website"`), optional `custom_data`, optional raw user data `{ email, phone, first_name, last_name }`.
- Server-side it:
  - Reads `META_CAPI_ACCESS_TOKEN` inside `.handler()`.
  - Pulls `client_ip_address` from `x-forwarded-for` / request IP and `client_user_agent` from request headers.
  - Reads `_fbp` and `_fbc` cookies (Pixel browser/click IDs) for match quality.
  - SHA-256 hashes email (lowercased/trimmed), phone (digits only), first/last name (lowercased) per Meta spec. IP and UA stay unhashed.
  - POSTs to `https://graph.facebook.com/v21.0/{pixel_id}/events`.
  - Returns `{ ok, fbtrace_id }`; logs but never throws to the client (tracking must never break UX).

**3. Client wrapper** (`src/lib/analytics.ts`)
- Add `trackBoth(eventName, params?, userData?)` that:
  - Generates one `event_id` (UUID) per call.
  - Fires Pixel: `fbq('track' | 'trackCustom', eventName, params, { eventID })`.
  - Fires CAPI in parallel via `sendCapiEvent` with the same `event_id` → Meta dedupes.
- Add `trackStandardBoth` for Meta standard events (`Lead`, `CompleteRegistration`, `Schedule`).
- Keep existing `track` / `trackStandard` (Pixel-only) for backwards compatibility — internally they'll just call the `Both` variants.

**4. Mirror all current events server-side**
Every event already on the site gets CAPI:
- `PageView` + SPA `page_view` (root route)
- `signup_cta_click`, `signup_step_view`, `signup_step_complete` (SignupDialog)
- `Lead`, `CompleteRegistration` on OTP verify — passes hashed email/phone/name from the form
- `thank_you_view`, `Lead` on `/dakujeme`
- `add_to_calendar_click`, `share_click`
- `calendly_widget_viewed`, `calendly_time_selected`, `calendly_booking_scheduled`, `Schedule`

**5. PII passing**
- SignupDialog already collects name/email/phone — pass them into `trackStandardBoth` on the `Lead` / `CompleteRegistration` calls.
- Persist hashed-friendly user data in `sessionStorage` after OTP verify so the thank-you page's `Lead` and Calendly `Schedule` events can also include matched user data.

**6. Deduplication guarantee**
- Same `event_id` on Pixel + CAPI for every event → Meta Events Manager will show "Deduplicated" on the event setup page within ~20 min of traffic.

### Files

Created:
- `src/lib/capi.functions.ts` — server function

Modified:
- `src/lib/analytics.ts` — add `trackBoth` / `trackStandardBoth` + UUID + cookie helpers
- `src/routes/__root.tsx` — switch `PageView` / `page_view` to `trackBoth`
- `src/components/SignupDialog.tsx` — pass user data on `Lead` / `CompleteRegistration`, switch all events to `Both` variants, store user data in sessionStorage
- `src/routes/dakujeme.tsx` — switch all events to `Both` variants, read sessionStorage user data for `Lead` and `Schedule`

### Secret request
After you approve this plan, the very next message will trigger the secure form to paste `META_CAPI_ACCESS_TOKEN`. Once submitted I'll implement and you can verify in Meta Events Manager → Test Events (no test code needed — events will show up in the live feed within a minute).
