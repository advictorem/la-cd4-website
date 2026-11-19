import Image from "next/image";
import { site } from "@/content/site";
import { SmartLink } from "./SmartLink";

/** Phones only: two actions fixed to the bottom of the screen on every page. */
export function MobileActions() {
  return (
    <nav className="mobile-actions" aria-label="Quick actions">
      <SmartLink href="/need-help/" className="mobile-actions__btn mobile-actions__btn--office">Contact District Office</SmartLink>
      <SmartLink href={site.myla311.web} className="mobile-actions__btn mobile-actions__btn--311">
        <Image src="/brand/myla311-logo.png" alt="MyLA311" width={30} height={28} />
        <span>Report a City Issue</span>
      </SmartLink>
    </nav>
  );
}
