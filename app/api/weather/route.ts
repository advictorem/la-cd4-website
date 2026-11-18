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

/** Current temperature, sky condition and US AQI for the configured point. Returns 503 rather than a guess if the source is unavailable. */
export async function GET() {
  const { latitude, longitude } = site.weather;
  const q = `latitude=${latitude}&longitude=${longitude}&timezone=America%2FLos_Angeles`;
  try {
    const [w, a] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?${q}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit`, { next: { revalidate } }),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${q}&current=us_aqi`, { next: { revalidate } }),
    ]);
    if (!w.ok) throw new Error(`weather ${w.status}`);
    const wj = await w.json();
    const aj = a.ok ? await a.json() : null;
    const temp = wj?.current?.temperature_2m;
    if (typeof temp !== "number") throw new Error("no temperature");
    const d = describe(Number(wj.current.weather_code));
    const aqi = typeof aj?.current?.us_aqi === "number" ? Math.round(aj.current.us_aqi) : null;
    return NextResponse.json(
      { place: site.weather.place, tempF: Math.round(temp), condition: d.label, kind: d.kind, isDay: wj.current.is_day === 1, aqi, aqiCategory: aqi === null ? null : aqiCategory(aqi), observedAt: wj.current.time },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } },
    );
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "public, s-maxage=120" } });
  }
}
