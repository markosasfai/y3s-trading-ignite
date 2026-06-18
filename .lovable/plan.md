## Root cause

The Brevo sync is fire-and-forget:

```ts
void syncLeadToBrevo({ ... })
return { ok: true }
```

On this serverless/edge worker runtime, the worker is terminated as soon as the handler returns its response. The `fetch` to Brevo (and even the `console.log`/`console.error` inside it) never gets to run. That matches exactly what we see: leads are being inserted into the database, but there is not a single `[brevo]` log line and no contact appears in Brevo list #28. It's not a Brevo problem — our code is never actually calling Brevo.

## Fix

Change `verifyAndSubmitLead` in `src/lib/registrations.functions.ts` to **await** `syncLeadToBrevo` before returning, wrapped so it can never break the registration flow:

```ts
try {
  await syncLeadToBrevo({
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    country,
  });
} catch (err) {
  console.error("[brevo] sync threw (non-fatal)", err);
}

return { ok: true };
```

No other changes. The Brevo payload, list ID 28, attributes, and `SOURCE = "ZTH Lovable Nowli"` stay as-is. The user still gets `{ ok: true }` even if Brevo is down — Brevo failures only log, they don't fail the registration.

## After the fix

1. **Publish → Update** to push the new server-function bundle live.
2. Test a registration on `event.y3s-trading.com` with a fresh email.
3. Check published server logs — you should now see either `[brevo] contact synced ...` (success) or `[brevo] contact sync failed <status> <body>` (Brevo rejected something, and the body will tell us exactly what).
4. Check Brevo list #28 for the contact.

This will either work, or for the first time give us a real error message from Brevo to act on.
