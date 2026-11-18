import Image from "next/image";
import { site } from "@/content/site";
import { OfficialNavbarLoader } from "./OfficialNavbarLoader";

/**
 * City of Los Angeles global bar: "An Official Website of the City of Los Angeles" · City Services · City Directory.
 *
 * mode "official" (default): the City-maintained widget from navbar.lacity.org (v4.0) is loaded after
 *   hydration by OfficialNavbarLoader. Until it arrives — and if it cannot load — the bar below is shown
 *   in its place. It copies the widget's measurements (47px, #0f2940, Open Sans 12px, 1px #A7CEEC outlined
 *   links) so nothing moves when the widget takes over, at which point this copy is hidden.
 * mode "static": only the bar below is used; nothing is requested from navbar.lacity.org.
 */
export function CityBar() {
  return (
    <>
      {site.cityNavbar === "official" && <OfficialNavbarLoader />}
      <nav className="citybar" id="citybar-fallback" aria-label="City of Los Angeles">
        <a className="citybar__id" href="https://lacity.gov/">
          <Image src="/brand/la-city-seal.svg" alt="" width={20} height={20} unoptimized />
          <span>An Official Website of the City of Los Angeles</span>
        </a>
        <span className="citybar__links">
          <a href="https://myla311.lacity.org/">City Services</a>
          <a href="https://lacity.gov/directory">City Directory</a>
        </span>
      </nav>
    </>
  );
}
