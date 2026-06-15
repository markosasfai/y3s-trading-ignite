import { useMemo, useState, useEffect } from "react";
import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

const PRIORITY: CountryCode[] = ["SK", "CZ", "AT", "HU", "PL", "DE", "GB", "US"];

const FLAG = (c: string) =>
  c.toUpperCase().replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));

export function PhoneInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e164: string, valid: boolean) => void;
}) {
  const [country, setCountry] = useState<CountryCode>("SK");
  const [raw, setRaw] = useState(value);

  const countries = useMemo(() => {
    const all = getCountries();
    const rest = all.filter((c) => !PRIORITY.includes(c)).sort();
    return [...PRIORITY, ...rest];
  }, []);

  useEffect(() => {
    // Normalise: strip non-digits except leading +, drop a single leading 0 when a country is selected
    let digits = raw.replace(/[^\d+]/g, "");
    if (digits.startsWith("00")) digits = "+" + digits.slice(2);
    let parsed = parsePhoneNumberFromString(digits, country);
    if (!parsed && digits.startsWith("0")) {
      parsed = parsePhoneNumberFromString(digits.replace(/^0+/, ""), country);
    }
    if (!parsed) {
      parsed = parsePhoneNumberFromString(digits, country);
    }
    const e164 = parsed?.number ?? "";
    onChange(e164, !!parsed?.isValid());
  }, [raw, country, onChange]);

  const formatter = new AsYouType(country);
  const display = formatter.input(raw.replace(/^\+?0+/, ""));

  return (
    <div className="glass flex items-stretch overflow-hidden rounded-xl">
      <label className="flex items-center gap-2 border-r border-white/10 bg-white/[0.03] px-3 text-sm">
        <span className="text-lg leading-none">{FLAG(country)}</span>
        <span className="text-muted-foreground">+{getCountryCallingCode(country)}</span>
        <select
          aria-label="Predvoľba krajiny"
          value={country}
          onChange={(e) => setCountry(e.target.value as CountryCode)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      <div className="relative flex-1">
        <select
          aria-hidden
          tabIndex={-1}
          value={country}
          onChange={(e) => setCountry(e.target.value as CountryCode)}
          className="absolute left-0 top-0 h-full w-32 cursor-pointer opacity-0"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {FLAG(c)} {c} +{getCountryCallingCode(c)}
            </option>
          ))}
        </select>
        <input
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="918 799 977"
          value={display}
          onChange={(e) => setRaw(e.target.value)}
          className="relative z-10 w-full bg-transparent px-3 py-3 text-base outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}