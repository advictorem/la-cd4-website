"use client";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

interface Reading { place: string; tempF: number; condition: string; kind: string; isDay: boolean; aqi: number | null; aqiCategory: string | null }

/** Minimal line icons for sky conditions (24px grid, same stroke as the rest of the icon set). */
const sky: Record<string, string> = {
  sun: "M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4",
  moon: "M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10ZM16.5 4v3M15 5.5h3M20 8.5v2M19 9.5h2",
  partlyDay: "M8 6.5a3.5 3.5 0 0 1 6.6 1.2M8 3v1.2M3.8 8.5H5M4.9 4.9l.9.9M7 19.5h9.5a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.6A3.5 3.5 0 0 0 7 19.500Z",
  partlyNight: "M13 3.5a4.5 4.5 0 0 0 5.800 5.800 4.500 4.500 0 0 1-1.300 1.500M7 19.5h9.5a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.6A3.5 3.5 0 0 0 7 19.500Z",
  cloud: "M7 18.5h9.5a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.6 1.6A3.500 3.500 0 0 0 7 18.500Z",
  fog: "M7 13.500h9.500a4 4 0 0 0 .400-8 5.500 5.500 0 0 0-10.600 1.600A3.500 3.500 0 0 0 7 13.500ZM5 17h14M7 20.500h10",
  rain: "M7 14.500h9.500a4 4 0 0 0 .400-8 5.500 5.500 0 0 0-10.600 1.600A3.500 3.500 0 0 0 7 14.500ZM8.500 17.500l-1 3M12.500 17.500l-1 3M16.500 17.500l-1 3",
  snow: "M7 14.500h9.500a4 4 0 0 0 .400-8 5.500 5.500 0 0 0-10.600 1.600A3.500 3.500 0 0 0 7 14.500ZM8 18.500h.010M12 18.500h.010M16 18.500h.010M10 21h.010M14 21h.010",
  storm: "M7 14.500h9.500a4 4 0 0 0 .400-8 5.500 5.500 0 0 0-10.600 1.600A3.500 3.500 0 0 0 7 14.500ZM12.500 15.500l-2 3.500h3l-2 3",
  air: "M3.500 9h10a2.500 2.500 0 1 0-2.500-2.500M3.500 13h14.500a2.500 2.500 0 1 1-2.500 2.500M3.500 17h7",
};
const iconFor = (r: Reading) => (r.kind === "clear" ? (r.isDay ? "sun" : "moon") : r.kind === "partly" ? (r.isDay ? "partlyDay" : "partlyNight") : r.kind in sky ? r.kind : "cloud");
const clean = (d: string) => d.replace(/(\d+\.\d*?[1-9])0+(?=\D|$)/g, "$1").replace(/(\d+)\.0+(?=\D|$)/g, "$1");

function Line({ d, size = 22 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={clean(d)} /></svg>;
}

/**
 * Current temperature and air quality for the district, read from /api/weather.
 * Shows nothing until a real reading arrives, and nothing if the source is unavailable.
 */
export function WeatherWidget() {
  const [r, setR] = useState<Reading | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/weather/")
      .then((res) => (res.ok ? res.json() : null))
      .then((j) => { if (live && j && typeof j.tempF === "number") setR(j); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  if (!r) return <div className="weather" data-empty="" />;
  return (
    <a className="weather" href={site.weather.forecastUrl} rel="noopener noreferrer">
      <span className="weather__item">
        <Line d={sky[iconFor(r)]} size={24} />
        <span className="visually-hidden">{r.place} weather: </span>
        <span className="weather__temp">{r.tempF}°</span>
        <span className="visually-hidden">, {r.condition.toLowerCase()}.</span>
      </span>
      {r.aqi !== null && (
        <span className="weather__item">
          <Line d={sky.air} size={20} />
          <span className="visually-hidden">Air quality: </span>
          <span className="weather__aqi">AQI {r.aqi}</span>
          <span className="weather__cat">{r.aqiCategory}</span>
        </span>
      )}
      <span className="weather__place" aria-hidden="true">{r.place}</span>
      <span className="visually-hidden"> Hourly forecast on AccuWeather (external site)</span>
    </a>
  );
}
