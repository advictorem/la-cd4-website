"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/content/navigation";
import { Icon } from "./Icon";
import { SmartLink } from "./SmartLink";
import { SiteSearch } from "./SiteSearch";
import { WeatherWidget } from "./WeatherWidget";
import { AccessibilityMenu } from "./AccessibilityMenu";
import { LanguageMenu } from "./LanguageMenu";

const sectionFor = (path: string): string | null => {
  if (/^\/(city-services|city-service)\//.test(path)) return "services";
  if (/^\/(topics-resources|initiative)\//.test(path)) return "topics";
  if (/^\/(neighborhoods|neighborhood)\//.test(path)) return "neighborhoods";
  if (/^\/(district-4|faq)\//.test(path)) return "about";
  if (/^\/(need-help|sign-up|grant-requests|scheduling-requests|transit-traffic-safety-requests)\//.test(path)) return "contact";
  if (/^\/(news|events|event|press-releases|newsletters|immigrant-rights-resources|wildfire-recovery-resources|hollywood-hills-tourism|forest-lawn-dr-safety-mobility-project|valley-lariverway-project)\//.test(path)) return "news";
  return null;
};

type Open = { path: string; panel: string | null; menu: boolean; search: boolean };

/**
 * Masthead, primary navigation and global search.
 * Pattern: disclosure buttons (aria-expanded / aria-controls), not ARIA menus.
 * Tab moves through items; Enter/Space toggles; Escape closes and returns focus to the trigger;
 * focus leaving the navigation closes any open panel. Below 992px the same markup becomes
 * an accordion inside a "Menu" disclosure. The search button sits at the end of the navigation row
 * (beside "Menu" on small screens) and opens one search field under the header on every page.
 */
export function SiteHeader() {
  const pathname = usePathname();
  // State is tied to the path it was set on, so navigating closes everything without an effect.
  const [state, setState] = useState<Open>({ path: pathname, panel: null, menu: false, search: false });
  const here = state.path === pathname;
  const open = here ? state.panel : null;
  const menuOpen = here ? state.menu : false;
  const searchOpen = here ? state.search : false;
  const navRef = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const searchPanel = useRef<HTMLDivElement>(null);
  const lastSearchBtn = useRef<HTMLButtonElement | null>(null);
  const current = sectionFor(pathname);

  const setOpen = useCallback((id: string | null) => setState((s) => ({ path: pathname, panel: id, menu: s.path === pathname ? s.menu : false, search: false })), [pathname]);
  const setMenuOpen = useCallback((menu: boolean) => setState({ path: pathname, panel: null, menu, search: false }), [pathname]);
  const setSearchOpen = useCallback((search: boolean) => setState({ path: pathname, panel: null, menu: false, search }), [pathname]);

  useEffect(() => {
    if (searchOpen) searchPanel.current?.querySelector("input")?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!open && !menuOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) { const id = open; setOpen(null); document.getElementById(`nav-btn-${id}`)?.focus(); }
      else if (searchOpen) { setSearchOpen(false); lastSearchBtn.current?.focus(); }
      else { setMenuOpen(false); menuBtn.current?.focus(); }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (navRef.current?.contains(t) || menuBtn.current?.contains(t) || searchPanel.current?.contains(t) || (t as Element).closest?.(".search-toggle")) return;
      if (open) setOpen(null);
      if (searchOpen) setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [open, menuOpen, searchOpen, setOpen, setMenuOpen, setSearchOpen]);

  const searchToggle = (where: "nav" | "masthead") => (
    <button type="button" className={`search-toggle search-toggle--${where}`} aria-expanded={searchOpen} aria-controls="site-search-panel"
      onClick={(e) => { lastSearchBtn.current = e.currentTarget; setSearchOpen(!searchOpen); }}>
      <Icon name={searchOpen ? "close" : "search"} size={20} />
      <span className={where === "masthead" ? "visually-hidden" : undefined}>Search</span>
    </button>
  );

  return (
    <header className="site-header">
      <div className="container">
        <div className="masthead">
          <Link href="/" className="wordmark">
            <Image src="/brand/la-city-logo.svg" alt="" width={100} height={44} unoptimized priority />
            <span className="wordmark__rule" aria-hidden="true" />
            <span className="wordmark__text">
              <span className="wordmark__name">Council District 4</span>
              <span className="wordmark__sub">City of Los Angeles</span>
            </span>
            <span className="visually-hidden"> — home</span>
          </Link>
          <div className="masthead__tools">
            <WeatherWidget />
            <LanguageMenu />
            <AccessibilityMenu />
            {searchToggle("masthead")}
            <button ref={menuBtn} type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "close" : "menu"} size={20} />
              Menu
            </button>
          </div>
        </div>
        <nav id="primary-nav" ref={navRef} className="site-nav" aria-label="Primary" data-open={menuOpen}
          onBlur={(e) => { if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null); }}>
          <ul className="site-nav__list" role="list">
            {primaryNav.map((s, i) => {
              const expanded = open === s.id;
              return (
                <li key={s.id} className={`site-nav__item${i >= primaryNav.length - 2 ? " site-nav__item--right" : ""}`}>
                  <button id={`nav-btn-${s.id}`} type="button" className="site-nav__btn" aria-expanded={expanded} aria-controls={`nav-panel-${s.id}`}
                    data-current={current === s.id} onClick={() => setOpen(expanded ? null : s.id)}>
                    {s.label}
                    {current === s.id && <span className="visually-hidden"> (current section)</span>}
                    <Icon name="chevron" size={16} />
                  </button>
                  <div id={`nav-panel-${s.id}`} className="site-nav__panel" hidden={!expanded}>
                    {!s.hideOverview && <SmartLink href={s.href} className="site-nav__overview arrow-link">{s.overview}<Icon name="arrow" size={16} /></SmartLink>}
                    <div className="site-nav__groups">
                      {s.groups.map((g, gi) => (
                        <div className="site-nav__group" key={gi}>
                          {g.heading && <h3>{g.heading}</h3>}
                          <ul role="list">
                            {g.links.map((l) => <li key={l.href}><SmartLink href={l.href}>{l.label}</SmartLink></li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
            <li className="site-nav__item site-nav__item--search">{searchToggle("nav")}</li>
          </ul>
        </nav>
      </div>
      <div id="site-search-panel" ref={searchPanel} className="search-panel" hidden={!searchOpen}>
        <div className="container">
          <SiteSearch id="global-search" variant="hero" label="Site search" />
        </div>
      </div>
    </header>
  );
}
