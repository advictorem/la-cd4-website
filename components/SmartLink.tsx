import Link from "next/link";
import type { ReactNode, AnchorHTMLAttributes } from "react";
import { Icon } from "./Icon";

export const isExternal = (href: string) => /^(https?:)?\/\//.test(href);
export const isContact = (href: string) => /^(tel:|mailto:)/.test(href);

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children: ReactNode; showIcon?: boolean };

/**
 * One link component for the whole site.
 * Internal links use the Next.js router; external links get rel protection,
 * a visible icon and a text alternative so the destination change is announced.
 * External links open in a new tab, and say so in their accessible name; internal links stay in the same tab.
 */
export function SmartLink({ href, children, showIcon = true, ...rest }: Props) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        {showIcon && <Icon name="external" size={14} className="ext-icon" />}
        <span className="visually-hidden"> (external site, opens in a new tab)</span>
      </a>
    );
  }
  if (isContact(href) || href.startsWith("#")) return <a href={href} {...rest}>{children}</a>;
  return <Link href={href} {...rest}>{children}</Link>;
}

export function ButtonLink({ href, variant = "primary", small, children, ...rest }: Props & { variant?: "primary" | "secondary" | "quiet"; small?: boolean }) {
  const cls = ["btn", variant !== "primary" && `btn--${variant}`, small && "btn--small", rest.className].filter(Boolean).join(" ");
  return <SmartLink href={href} {...rest} className={cls}>{children}</SmartLink>;
}
