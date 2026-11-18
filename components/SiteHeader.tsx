"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/content/navigation";
import { Icon } from "./Icon";
import { SmartLink } from "./SmartLink";
import { SiteSearch } from "./SiteSearch";

const sectionFor = (path: string): string | null => {
  if (/^\/(city-services|city-service)\//.test(path)) return "services";
  if (/^\/(topics-resources|initiative)\//.test(path)) return "topics";
  if (/^\/(neighborhoods|neighborhood)\//.test(path)) return "neighborhoods";
  if (/^\/(district-4)\//.test(path)) return "about";
  if (/^\/(need-help|sign-up|grant-requests|scheduling-requests|transit-traffic-safety-requests)\//.test(path)) return "contact";
  if (/^\/(news|events|event|press-releases|newsletters|immigrant-rights-resources|wildfire-recovery-resources|hollywood-hills-tourism|forest-lawn-dr-safety-mobility-project|valley-lariverway-project)\//.test(path)) return "news";
  return null;
};

/**
 * Masthead + primary navigation.
 * Pattern: disclosure buttons (aria-expanded / aria-controls), not ARIA menus.
 * Tab moves through items; Enter/Space toggles; Escape closes and returns focus to the trigger;
 * focus leaving the navigation closes any open panel. Below 992px the same markup becomes
 * an accordion inside a "Menu" disclosure.
 */
export function SiteHeader() {
  const pathname = usePathname();
  // Menu state is tied to the path it was opened on, so navigating closes everything without an effect.
  const [state, setState] = useState<{ path: string; open: string | null; menu: boolean }>({ path: pathname, open: null, menu: false });
  const open = state.path === pathname ? state.open : null;
  const menuOpen = state.path === pathname ? state.menu : false;
  const setOpen = useCallback((id: string | null) => setState((s) => ({ path: pathname, open: id, menu: s.path === pathname ? s.menu : false })), [pathname]);
  const setMenuOpen = useCallback((menu: boolean) => setState({ path: pathname, open: null, menu }), [pathname]);
  const navRef = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const current = sectionFor(pathname);

  const closeAndFocus = useCallback((id: string) => {
    setOpen(null);
    document.getElementById(`nav-btn-${id}`)?.focus();
  }, [setOpen]);

  useEffect(() => {
    if (!open && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) closeAndFocus(open);
      else { setMenuOpen(false); menuBtn.current?.focus(); }
    };
    const onDown = (e: PointerEvent) => {
      if (navRef.current?.contains(e.target as Node) || menuBtn.current?.contains(e.target as Node)) return;
      setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [open, menuOpen, closeAndFocus, setOpen, setMenuOpen]);

  return (
    <header className="site-header" data-home={pathname === "/"}>
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
          <button ref={menuBtn} type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "close" : "menu"} size={20} />
            Menu
          </button>
          <SiteSearch id="header-search" />
        </div>
        <nav id="primary-nav" ref={navRef} className="site-nav" aria-label="Primary" data-open={menuOpen}
          onBlur={(e) => { if (open && !e.currentTarget.contains(e.relatedTarget as Node) && e.relatedTarget) setOpen(null); }}>
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
                    <SmartLink href={s.href} className="site-nav__overview arrow-link">{s.overview}<Icon name="arrow" size={16} /></SmartLink>
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
