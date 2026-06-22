Add Facebook domain verification meta tag to the site head.

## Change

In `src/routes/__root.tsx`, add to the `meta` array in the root `head()`:

```tsx
{ name: "facebook-domain-verification", content: "mo03n99zprn0d64fmhnx5e4fv4touy" },
```

This places it sitewide so Facebook can verify the domain on any page it crawls. After publish, verification in Meta Business Manager may take a few minutes to register.