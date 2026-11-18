"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { Icon } from "./Icon";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
type Suggest = (input: string) => Promise<string[]>;

/** Loads Google Places once and returns a function that suggests addresses near Los Angeles. Any failure yields no suggestions. */
let loader: Promise<Suggest | null> | null = null;
function loadPlaces(): Promise<Suggest | null> {
  if (!KEY) return Promise.resolve(null);
  loader ??= new Promise<Suggest | null>((resolve) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(KEY)}&libraries=places&loading=async&callback=__cd4Places`;
    s.async = true;
    s.onerror = () => resolve(null);
    (window as unknown as Record<string, unknown>).__cd4Places = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const places: any = await (window as any).google.maps.importLibrary("places");
        const bias = { center: { lat: 34.13, lng: -118.42 }, radius: 30000 };
        if (places.AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
          const token = new places.AutocompleteSessionToken();
          resolve(async (input) => {
            const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({ input, sessionToken: token, includedRegionCodes: ["us"], locationBias: bias });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return suggestions.map((x: any) => x.placePrediction?.text?.toString()).filter(Boolean).slice(0, 5);
          });
        } else if (places.AutocompleteService) {
          const svc = new places.AutocompleteService();
          resolve((input) => new Promise((done) => svc.getPlacePredictions({ input, componentRestrictions: { country: "us" }, types: ["address"] },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (r: any[] | null) => done((r ?? []).map((x) => x.description).slice(0, 5)))));
        } else resolve(null);
      } catch { resolve(null); }
    };
    document.head.appendChild(s);
  });
  return loader;
}

/**
 * "Am I in District 4?" address field.
 * Nothing typed here is sent to this website. On "Check", the City's address lookup opens in a small
 * window with the address already filled in (the lookup reads it from the URL fragment and runs the search).
 * When NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is configured, Google Places suggests matching addresses as the
 * visitor types; without a key the field still works, with the browser's own address autofill.
 */
export function AddressCheck() {
  const id = useId();
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const suggest = useRef<Suggest | null>(null);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function onChange(v: string) {
    setValue(v);
    setError("");
    if (!KEY) return;
    window.clearTimeout(timer.current);
    if (v.trim().length < 4) { setOptions([]); return; }
    timer.current = window.setTimeout(async () => {
      suggest.current ??= await loadPlaces();
      try { setOptions(suggest.current ? await suggest.current(v) : []); } catch { setOptions([]); }
    }, 250);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const address = value.trim().replace(/, USA$/, "");
    if (address.length < 3) { setError("Enter a street address, for example 200 N Spring St."); return; }
    const url = `${site.districtMap.lookupUrl}#${encodeURIComponent(address)}`;
    const width = 560, height = 760;
    const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
    const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));
    const w = window.open(url, "cd4-address-check", `popup=yes,width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
    if (w) w.focus();
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- absolute URL on the City's site
    else window.location.href = url; // pop-up blocked: go to the City lookup directly (external site)
  }

  return (
    <form className="address-check" onSubmit={submit} noValidate>
      <label htmlFor={`${id}-addr`}>Street address</label>
      <div className="address-check__row">
        <input id={`${id}-addr`} type="text" name="address" autoComplete="street-address" placeholder="Start typing your address" value={value}
          list={KEY ? `${id}-list` : undefined} aria-describedby={`${id}-help${error ? ` ${id}-err` : ""}`} aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(e.target.value)} />
        <button type="submit" className="btn"><Icon name="pin" size={18} />Check</button>
      </div>
      {KEY && <datalist id={`${id}-list`}>{options.map((o) => <option key={o} value={o} />)}</datalist>}
      <p id={`${id}-err`} className="address-check__error" role="alert">{error}</p>
      <p id={`${id}-help`} className="small muted">Opens the City of Los Angeles address lookup in a small window with your address filled in. Your address is not stored by this website.</p>
    </form>
  );
}
