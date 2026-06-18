## What's actually happening

The Brevo sync code is correct, but it never ran for those 3 test leads.

Today's leads landed in the database, but published server logs are completely empty for `brevo`, `leads`, and `verify` over the last hour. The only way that's possible is if the live site is still running the version of `verifyAndSubmitLead` from **before** Brevo was added — which had no log lines on the success path either.

On this stack, server functions ship inside the SSR bundle and only go live when you click **Publish → Update**. So:

- `event.y3s-trading.com` → still running the pre-Brevo server function → silently writes to DB, never calls Brevo.
- Preview URL → already has the new code, but you weren't testing there.

## Plan

1. **Add a success log** to `syncLeadToBrevo` in `src/lib/registrations.functions.ts` so we can confirm it ran (`[brevo] contact synced email=...`). Today there's only `console.error` on failure, which is why even a working run would be invisible.
2. **You click Publish → Update** to push the new server-function bundle live.
3. **Re-test** a registration from `event.y3s-trading.com` with a fresh email.
4. **Verify** by checking the published server logs for `[brevo]` and your Brevo contact list #28.

If after publish + retest the contact still doesn't appear, the log line will tell us exactly which path failed (missing key, 4xx from Brevo, network error) and we'll fix from there.

## No other code changes

The Brevo payload, list ID 28, attributes, and `SOURCE = "ZTH Lovable Nowli"` all stay as-is.
