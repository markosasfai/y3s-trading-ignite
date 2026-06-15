import { useEffect, useMemo, useState } from "react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

const PRIORITY: CountryCode[] = ["SK", "CZ", "AT", "HU", "PL", "DE", "GB", "US"];

const flag = (c: string) =>
  c.toUpperCase().replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));

export function PhoneInput({
  onChange,
}: {
  onChange: (e164: string, valid: boolean) => void;
}) {
  const [country, setCountry] = useState<CountryCode>("SK");
  const [raw, setRaw] = useState("");

  const countries = useMemo(() => {
    const all = getCountries();
    const rest = all.filter((c) => !PRIORITY.includes(c)).sort();
    return [...PRIORITY, ...rest];
  }, []);

  useEffect(() => {
    let input = raw.replace(/[^\d+]/g, "");
    if (input.startsWith("00")) input = "+" + input.slice(2);
    // If user typed leading 0(s) without country code prefix, drop them so SK 0918... → +421918...
    if (!input.startsWith("+") && input.startsWith("0")) input = input.replace(/^0+/, "");
    const parsed = parsePhoneNumberFromString(input, country);
    onChange(parsed?.number ?? "", !!parsed?.isValid());
  }, [raw, country, onChange]);

  const display = new AsYouType(country).input(
    raw.startsWith("+") ? raw : raw.replace(/^0+/, ""),
  );

  return (
    <div className="glass flex items-stretch overflow-hidden rounded-xl focus-within:ring-2 focus-within:ring-primary/60">
      <div className="relative flex items-center gap-2 border-r border-white/10 bg-white/[0.03] px-3 text-sm">
        <span className="text-lg leading-none">{flag(country)}</span>
        <span className="text-muted-foreground">+{getCountryCallingCode(country)}</span>
        <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <select
          aria-label="Predvoľba krajiny"
          value={country}
          onChange={(e) => setCountry(e.target.value as CountryCode)}
          className="absolute inset-0 cursor-pointer opacity-0"
        >
          {countries.map((c) => (
            <option key={c} value={c} className="bg-background text-foreground">
              {flag(c)} {c} +{getCountryCallingCode(c)}
            </option>
          ))}
        </select>
      </div>
      <input
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="918 799 977"
        value={display}
        onChange={(e) => setRaw(e.target.value)}
        className="flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}