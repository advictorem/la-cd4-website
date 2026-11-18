import { NextResponse } from "next/server";
import { site } from "@/content/site";

export const revalidate = 900; // one upstream request per 15 minutes, shared by all visitors

const describe = (code: number): { label: string; kind: "clear" | "partly" | "cloud" | "fog" | "rain" | "snow" | "storm" } => {
  if (code === 0) return { label: "Clear", kind: "clear" };
  if (code <= 2) return { label: code === 1 ? "Mostly clear" : "Partly cloudy", kind: "partly" };
  if (code === 3) return { label: "Cloudy", kind: "cloud" };
  if (code === 45 || code === 48) return { label: "Fog", kind: "fog" };
  if (code >= 51 && code <= 67) return { label: code <= 57 ? "Drizzle" : "Rain", kind: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow", kind: "snow" };
  if (code >= 80 && code <= 82) return { label: "Showers", kind: "rain" };
  if (code === 85 || code === 86) return { label: "Snow showers", kind: "snow" };
  if (code >= 95) return { label: "Thunderstorm", kind: "storm" };
  return { label: "Cloudy", kind: "cloud" };
};
const aqiCategory = (aqi: number) =>
  aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : aqi <= 150 ? "Unhealthy for sensitive groups" : aqi <= 200 ? "Unhealthy" : aqi <= 300 ? "Very unhealthy" : "Hazardous";

// AccuWeather icon numbers → our icon kinds (https://developer.accuweather.com/weather-icons)
const accuKind = (icon: number): ReturnType<typeof describe>["kind"] =>
  [1, 2, 33, 34].includes(icon) ? "clear" : [3, 4, 5, 35, 36, 37].includes(icon) ? "partly" : icon === 11 ? "fog"
  : [12, 13, 14, 18, 39, 40].includes(icon) ? "rain" : [15, 16, 17, 41, 42].includes(icon) ? "storm" : (icon >= 19 && icon <= 29) || icon === 43 || icon === 44 ? "snow" : "cloud";

async function fromAccuWeather(key: string) {
  const res = await fetch(`https://dataservice.accuweather.com/currentconditions/v1/${site.weather.accuWeatherLocationKey}?apikey=${encodeURIComponent(key)}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`accuweather ${res.status}`);
  const c = (await res.json())?.[0];
  const temp = c?.Temperature?.Imperial?.Value;
  if (typeof temp !== "number") throw new Error("no temperature");
  return { tempF: Math.round(temp), condition: String(c.WeatherText ?? ""), kind: accuKind(Number(c.WeatherIcon)), isDay: Boolean(c.IsDayTime), observedAt: String(c.LocalObservationDateTime ?? ""), source: "AccuWeather" as const };
}

async function fromOpenMeteo(q: string) {
  const w = await fetch(`https://api.open-meteo.com/v1/forecast?${q}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit`, { next: { revalidate } });
  if (!w.ok) throw new Error(`weather ${w.status}`);
  const wj = await w.json();
  const temp = wj?.current?.temperature_2m;
  if (typeof temp !== "number") throw new Error("no temperature");
  const d = describe(Number(wj.current.weather_code));
  return { tempF: Math.round(temp), condition: d.label, kind: d.kind, isDay: wj.current.is_day === 1, observedAt: String(wj.current.time), source: "Open-Meteo" as const };
}

/**
 * Current temperature, sky condition and US AQI for the configured point.
 * Conditions come from AccuWeather when ACCUWEATHER_API_KEY is set (the readout is then credited
 * "Powered by AccuWeather"); otherwise from Open-Meteo, and credited to Open-Meteo. The credit always
 * names the service that actually supplied the numbers. Air quality comes from Open-Meteo in both cases.
 * Returns 503 rather than a guess if no source is available.
 */
export async function GET() {
  const { latitude, longitude } = site.weather;
  const q = `latitude=${latitude}&longitude=${longitude}&timezone=America%2FLos_Angeles`;
  const key = process.env.ACCUWEATHER_API_KEY;
  try {
    const [cond, a] = await Promise.all([
      key ? fromAccuWeather(key).catch(() => fromOpenMeteo(q)) : fromOpenMeteo(q),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${q}&current=us_aqi`, { next: { revalidate } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]);
    const aqi = typeof a?.current?.us_aqi === "number" ? Math.round(a.current.us_aqi) : null;
    return NextResponse.json(
      { ...cond, aqi, aqiCategory: aqi === null ? null : aqiCategory(aqi) },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } },
    );
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "public, s-maxage=120" } });
  }
}
