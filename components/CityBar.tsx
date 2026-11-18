import Image from "next/image";
import { site } from "@/content/site";
import { SmartLink } from "./SmartLink";
import { LanguageMenu } from "./LanguageMenu";

/**
 * OfficialCityBar.
 *
 * mode "reference" (default): the toolbar shown in the supplied reference screenshot and on the
 *   live CD4 site today — seal, LOS ANGELES, Sign Up for Updates, Windstorm & Fire Updates,
 *   311 City Services, LA City Directory, Select Language. Built here at the 47px height the
 *   City specifies, with the official seal artwork unmodified.
 * mode "official": the City-maintained widget from navbar.lacity.org (v4.0) is loaded by OfficialNavbarLoader and renders
 *   "An Official Website of the City of Los Angeles" + City Services + City Directory. Items the
 *   widget does not include move to a CD4 utility row beneath it so no link is duplicated.
 * See docs/design-system.md#city-toolbar for the trade-offs.
 */
export function CityBar() {
  const { cityBar } = site;
  if (site.cityNavbar === "official") {
    return (
      <>
        <nav className="utility-row on-dark" aria-label="Council District 4 utilities">
          <div className="container city-bar__inner">
            <ul className="city-bar__links" role="list">
              <li><SmartLink className="city-bar__cta" href={cityBar.signUp.href}>{cityBar.signUp.label}</SmartLink></li>
              <li><SmartLink className="city-bar__link" href={cityBar.alert.href} showIcon={false}><span className="city-bar__pill" aria-hidden="true">{cityBar.alert.pill}</span><span className="city-bar__label">{cityBar.alert.label}</span></SmartLink></li>
              <li className="city-bar__item--lang"><LanguageMenu /></li>
            </ul>
          </div>
        </nav>
      </>
    );
  }
  return (
    <nav className="city-bar on-dark" aria-label="City of Los Angeles">
      <div className="container city-bar__inner">
        <a className="city-bar__brand" href="https://lacity.gov/">
          <Image src="/brand/la-city-seal.svg" alt="" width={32} height={32} unoptimized />
          <span className="city-bar__name">Los Angeles</span>
          <span className="visually-hidden"> — City of Los Angeles website</span>
        </a>
        <div>
          <ul className="city-bar__links" role="list">
            <li><SmartLink className="city-bar__cta" href={cityBar.signUp.href}>Sign Up<span className="city-bar__cta-rest">&nbsp;for Updates</span></SmartLink></li>
            <li className="city-bar__item--alert">
              <SmartLink className="city-bar__link" href={cityBar.alert.href} showIcon={false}>
                <span className="city-bar__pill" aria-hidden="true">{cityBar.alert.pill}</span>
                <span className="city-bar__label">{cityBar.alert.label}</span>
              </SmartLink>
            </li>
            <li className="city-bar__item--services">
              <SmartLink className="city-bar__link" href={cityBar.services.href} showIcon={false}>
                <span className="city-bar__pill" aria-hidden="true">{cityBar.services.pill}</span>
                <span className="city-bar__label"><span className="visually-hidden">311 </span>{cityBar.services.label}</span>
              </SmartLink>
            </li>
            <li className="city-bar__item--directory">
              <SmartLink className="city-bar__link" href={cityBar.directory.href} showIcon={false}>
                <span className="city-bar__pill" aria-hidden="true">{cityBar.directory.pill}</span>
                <span className="city-bar__label"><span className="visually-hidden">LA </span>{cityBar.directory.label}</span>
              </SmartLink>
            </li>
            <li className="city-bar__item--lang"><LanguageMenu /></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
