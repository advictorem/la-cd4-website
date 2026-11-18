import Image from "next/image";
import { site } from "@/content/site";
import { SmartLink } from "./SmartLink";

export function Footer() {
  const c = site.contact;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__id">
            <a href="https://lacity.gov/" aria-label="City of Los Angeles website">
              <Image src="/brand/la-city-logo.svg" alt="LACity.gov" width={118} height={52} unoptimized loading="eager" />
            </a>
            <p><strong>Council District 4</strong><br />City of Los Angeles</p>
          </div>
          <div>
            <h2>Contact</h2>
            <ul role="list">
              <li><a href={c.phoneHref}>{c.phone}</a></li>
              <li><a href={`mailto:${c.email}`}>{c.email}</a></li>
              {c.offices.map((o) => (
                <li key={o.name}><address><strong>{o.name}</strong><br />{o.lines.join(", ")}</address></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Get help</h2>
            <ul role="list">
              <li><SmartLink href="/need-help/">Request assistance</SmartLink></li>
              <li><SmartLink href={site.myla311.web}>MyLA311</SmartLink></li>
              <li><SmartLink href="/city-service/emergency-services/">Emergency services</SmartLink></li>
              <li><SmartLink href="/sign-up/">Sign up for updates</SmartLink></li>
              <li><SmartLink href="/site-map/">Site map</SmartLink></li>
            </ul>
          </div>
          <div>
            <h2>City of Los Angeles</h2>
            <ul role="list">
              <li><SmartLink href="https://lacity.gov/">LACity.gov</SmartLink></li>
              <li><SmartLink href="https://lacity.gov/directory">City Directory</SmartLink></li>
              <li><SmartLink href="https://clerk.lacity.gov/">Office of the City Clerk</SmartLink></li>
              <li><SmartLink href="https://neighborhoodinfo.lacity.org/">Find your Council District</SmartLink></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__legal">
          <p>© {new Date().getFullYear()} City of Los Angeles</p>
          <ul role="list">
            {site.legal.map((l) => <li key={l.href}><SmartLink href={l.href}>{l.label}</SmartLink></li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}
