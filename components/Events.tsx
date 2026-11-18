"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { EventRecord } from "@/content/types";
import { Icon } from "./Icon";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const parts = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return { y, m: m - 1, d }; };
const longDate = (iso: string) => { const { y, m, d } = parts(iso); return `${DAYS[new Date(Date.UTC(y, m, d)).getUTCDay()]}, ${MONTHS[m]} ${d}, ${y}`; };

export function EventList({ events, past, headingLevel = "h3" }: { events: EventRecord[]; past?: boolean; headingLevel?: "h3" | "h4" }) {
  const H = headingLevel;
  return (
    <ol className="event-list" role="list">
      {events.map((e) => {
        const { y, m, d } = parts(e.date);
        return (
          <li key={e.slug} className={`event${past ? " event--past" : ""}`}>
            <div className="event__date" aria-hidden="true">
              <span className="event__mon">{MONTHS[m].slice(0, 3)}</span>
              <span className="event__day">{d}</span>
              <span className="event__yr">{y}</span>
            </div>
            <div>
              <H style={{ fontSize: "var(--step-1)" }}><Link href={`/event/${e.slug}/`}>{e.title}</Link></H>
              <p className="event__meta">
                <span><Icon name="calendar" size={16} /><time dateTime={e.date}>{longDate(e.date)}</time></span>
                {e.location && <span><Icon name="pin" size={16} />{e.location}</span>}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Month grid. Days without events are plain text (not focusable, not clickable).
 * Days with events contain ordinary links. The chronological list remains the primary view.
 */
export function EventCalendar({ events, today }: { events: EventRecord[]; today: string }) {
  const t = parts(today);
  const [ym, setYm] = useState({ y: t.y, m: t.m });
  const byDay = useMemo(() => {
    const map = new Map<string, EventRecord[]>();
    for (const e of events) map.set(e.date, [...(map.get(e.date) ?? []), e]);
    return map;
  }, [events]);
  const monthEvents = events.filter((e) => { const p = parts(e.date); return p.y === ym.y && p.m === ym.m; });
  const first = new Date(Date.UTC(ym.y, ym.m, 1)).getUTCDay();
  const days = new Date(Date.UTC(ym.y, ym.m + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const step = (n: number) => setYm(({ y, m }) => { const d = new Date(Date.UTC(y, m + n, 1)); return { y: d.getUTCFullYear(), m: d.getUTCMonth() }; });
  const iso = (d: number) => `${ym.y}-${String(ym.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const label = `${MONTHS[ym.m]} ${ym.y}`;

  return (
    <div className="cal">
      <div className="cal__bar">
        <h3 id="cal-month">{label}</h3>
        <div className="cal__nav">
          <button type="button" className="btn btn--secondary btn--small" onClick={() => step(-1)}><span aria-hidden="true">←</span> Previous<span className="visually-hidden"> month</span></button>
          <button type="button" className="btn btn--secondary btn--small" onClick={() => setYm({ y: t.y, m: t.m })} disabled={ym.y === t.y && ym.m === t.m}>Today</button>
          <button type="button" className="btn btn--secondary btn--small" onClick={() => step(1)}>Next<span className="visually-hidden"> month</span> <span aria-hidden="true">→</span></button>
        </div>
      </div>
      <table aria-labelledby="cal-month">
        <thead>
          <tr>{DAYS.map((d) => <th key={d} scope="col"><abbr title={d} style={{ textDecoration: "none" }}>{d.slice(0, 3)}</abbr></th>)}</tr>
        </thead>
        <tbody>
          {weeks.map((w, wi) => (
            <tr key={wi}>
              {w.map((d, di) => {
                if (d === null) return <td key={di} data-out="" />;
                const list = byDay.get(iso(d)) ?? [];
                return (
                  <td key={di} data-today={iso(d) === today ? "" : undefined}>
                    <span className="cal__num">{d}{iso(d) === today && <span className="visually-hidden"> (today)</span>}</span>
                    {list.map((e) => <Link key={e.slug} className="cal__event" href={`/event/${e.slug}/`}><span className="visually-hidden">{MONTHS[ym.m]} {d}: </span>{e.title}</Link>)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="cal__status" role="status" aria-live="polite">
        {monthEvents.length === 0 ? `No events are listed for ${label}.` : `${monthEvents.length} event${monthEvents.length === 1 ? "" : "s"} listed for ${label}.`}
      </p>
    </div>
  );
}

export function EventsBrowser({ upcoming, past, today }: { upcoming: EventRecord[]; past: EventRecord[]; today: string }) {
  const [view, setView] = useState<"list" | "calendar">("list");
  return (
    <div>
      <div className="section-head">
        <h2 id="upcoming">Upcoming events</h2>
        <div className="view-toggle" role="group" aria-label="Choose how events are shown">
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}><Icon name="list" size={18} />List</button>
          <button type="button" aria-pressed={view === "calendar"} onClick={() => setView("calendar")}><Icon name="grid" size={18} />Calendar</button>
        </div>
      </div>
      {view === "list" ? (
        upcoming.length ? <EventList events={upcoming} /> : (
          <div className="empty">
            <h3>No upcoming events are listed</h3>
            <p>The district has not published any future events. New events appear here when they are announced.</p>
            <div className="btn-row"><Link className="btn btn--secondary" href="/sign-up/">Sign up for updates</Link></div>
          </div>
        )
      ) : (
        <EventCalendar events={[...upcoming, ...past]} today={today} />
      )}
    </div>
  );
}
