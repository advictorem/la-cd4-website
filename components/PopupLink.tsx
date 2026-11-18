"use client";
import type { ReactNode, MouseEvent } from "react";
import { Icon } from "./Icon";

/**
 * Opens an external tool (the City's address lookup) in a small separate window so the visitor
 * keeps their place on this site. The tool cannot be framed inside the page: the City serves it
 * with X-Frame-Options: SAMEORIGIN. If the browser blocks the window, the link works normally.
 */
export function PopupLink({ href, children, className, name = "cd4-popup", width = 560, height = 760 }: { href: string; children: ReactNode; className?: string; name?: string; width?: number; height?: number }) {
  function open(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
    const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));
    const w = window.open(href, name, `popup=yes,width=${width},height=${height},left=${left},top=${top},noopener=no,scrollbars=yes,resizable=yes`);
    if (w) { e.preventDefault(); w.focus(); }
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={open} data-popup="">
      {children}
      <Icon name="external" size={14} className="ext-icon" />
      <span className="visually-hidden"> (opens in a small window)</span>
    </a>
  );
}
