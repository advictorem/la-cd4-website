import type { ContentMeta } from "./types";

const env = process.env.NEXT_PUBLIC_SITE_ENV ?? "staging";

/**
 * Admin-editable site configuration. Nothing here should be changed to assert a
 * fact (office details, representation status) that has not been verified
 * against the official source named beside it.
 */
export const site = {
  name: "Council District 4",
  owner: "City of Los Angeles",
  tagline: "A simpler way to connect with your city.",
  description:
    "Find City services, neighborhood information, and resources for your community in Los Angeles Council District 4.",
  env,
  isProduction: env === "production",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://cd4.lacity.gov",
  liveOrigin: "https://cd4.lacity.gov",
  lastContentReview: "2026-11-17",

  /** "reference" matches the supplied toolbar screenshot; "official" loads navbar.lacity.org v4.0. */
  cityNavbar: (process.env.NEXT_PUBLIC_CITY_NAVBAR ?? "reference") as "reference" | "official",

  cityBar: {
    signUp: { label: "Sign Up for Updates", href: "/sign-up/" },
    alert: { pill: "!", label: "Windstorm & Fire Updates", href: "https://emergency.lacity.gov/updates" },
    services: { pill: "311", label: "City Services", href: "https://myla311.lacity.gov/" },
    directory: { pill: "LA", label: "City Directory", href: "https://lacity.gov/directory" },
    languages: [
      { code: "es", label: "Español" },
      { code: "hy", label: "Հայերեն" },
      { code: "ko", label: "한국어" },
      { code: "zh-CN", label: "中文（简体）" },
      { code: "zh-TW", label: "中文（繁體）" },
      { code: "tl", label: "Tagalog" },
      { code: "fa", label: "فارسی" },
      { code: "ru", label: "Русский" },
      { code: "ja", label: "日本語" },
      { code: "vi", label: "Tiếng Việt" },
      { code: "th", label: "ไทย" },
    ],
  },

  /**
   * Office contact details as published on cd4.lacity.gov on the verifiedAt date.
   * status stays "pending-review" until the City confirms them for the new site.
   */
  contact: {
    phone: "213-473-7004",
    phoneHref: "tel:+12134737004",
    email: "contactCD4@lacity.org",
    offices: [
      { name: "City Hall Office", lines: ["200 N Spring St., Suite 415", "Los Angeles, CA 90012"] },
      { name: "Valley Office", lines: ["13103 Ventura Blvd., Suite 100", "Studio City, CA 91604"] },
    ],
    pressEmail: "cd4comms@lacity.org",
    social: [
      { label: "Instagram", href: "https://www.instagram.com/cd4losangeles/" },
      { label: "Facebook", href: "https://www.facebook.com/cd4losangeles/" },
      { label: "X", href: "https://twitter.com/cd4losangeles" },
      { label: "TikTok", href: "https://tiktok.com/@cd4losangeles" },
      { label: "Bluesky", href: "https://bsky.app/profile/cd4losangeles.bsky.social" },
    ],
    meta: {
      route: "/need-help/",
      sourceUrl: "https://cd4.lacity.gov/need-help/",
      verifiedAt: "2026-11-17",
      contentOwner: "Council District 4 office",
      status: "pending-review",
    } satisfies ContentMeta,
  },

  /**
   * Header weather and air-quality readout (served by /api/weather).
   * With ACCUWEATHER_API_KEY set, conditions come from AccuWeather's API for the location below and the
   * readout is credited "Powered by AccuWeather". Without a key it uses Open-Meteo's free, keyless API
   * (CC BY 4.0, non-commercial tier) and is credited to Open-Meteo instead. Air quality is Open-Meteo either way.
   */
  weather: {
    latitude: 34.159,
    longitude: -118.501,
    /** From accuweather.com/en/us/encino/91316/…/327083 */
    accuWeatherLocationKey: "327083",
    /** Credit shown under the header readout, by data source. Open-Meteo is credited in the footer only. */
    credits: { AccuWeather: "Powered by AccuWeather" } as Record<string, string>,
    attribution: { label: "Weather and air-quality data: Open-Meteo.com", href: "https://open-meteo.com/" },
  },

  myla311: {
    web: "https://myla311.lacity.gov/",
    phoneLabel: "Dial 311 or (213) 473-3231",
    phoneHref: "tel:311",
    email: "311@lacity.org",
  },

  /**
   * District representation notice. OFF by default.
   * Turn on only when the Office of the City Clerk has published information about
   * an actual vacancy or transition; paste the Clerk's wording and URL, and record the date.
   */
  representationNotice: {
    enabled: false,
    heading: "District 4 representation",
    body: "",
    linkLabel: "Read the City Clerk's information",
    href: "",
    verifiedAt: "",
    source: "Office of the City Clerk",
  },

  cityClerk: {
    heading: "Elections, Council records, and public meetings",
    body: "The Office of the City Clerk administers City elections and keeps the official record of City Council actions, including Council files, agendas, and votes.",
    links: [
      { label: "Office of the City Clerk", href: "https://clerk.lacity.gov/" },
      { label: "City elections", href: "https://clerk.lacity.gov/clerk-services/elections" },
      { label: "Search Council files", href: "https://cityclerk.lacity.org/lacityclerkconnect/" },
    ],
  },

  legal: [
    { label: "Disclaimer", href: "https://disclaimer.lacity.gov/disclaimer.htm" },
    { label: "Privacy Policy", href: "https://disclaimer.lacity.gov/privacy.htm" },
    { label: "Accessibility Statement", href: "https://disclaimer.lacity.gov/accessibility.htm" },
  ],

  districtMap: {
    embedUrl: "https://www.google.com/maps/d/embed?mid=1qsyjCXVQLPfZpXy-bQCkGai4nr3lFy_h",
    viewerUrl: "https://www.google.com/maps/d/viewer?mid=1qsyjCXVQLPfZpXy-bQCkGai4nr3lFy_h",
    /** City address lookup. It reads an address from the URL fragment: …/#<address> pre-fills the field and runs the search. */
    lookupUrl: "https://neighborhoodinfo.lacity.gov/",
  },
} as const;

export type Site = typeof site;
