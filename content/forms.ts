import type { FormHandoff, ContentMeta } from "./types";

const meta = (slug: string): ContentMeta => ({
  route: `/${slug}/`, sourceUrl: `https://cd4.lacity.gov/${slug}/`, verifiedAt: "2026-11-17",
  contentOwner: "Council District 4 office", status: "pending-review",
});

/**
 * Existing forms. Each stays on its current platform and endpoint.
 * This site never collects form data itself: it either frames the existing form
 * (the same way the live WordPress page does) or links to it.
 */
export const forms: FormHandoff[] = [
  {
    slug: "need-help", title: "Request assistance",
    summary: "Ask the district office for help with a City service, or to follow up on a request that has stalled.",
    platform: "Indigov (forms.indigov.com)", liveMethod: "iframe in the WordPress page", embed: "iframe",
    formUrl: "https://forms.indigov.com/customers/councilmember-nithyaraman/7d242ff2-7f2b-4e88-ad76-b8867adbf11d",
    livePageUrl: "https://cd4.lacity.gov/need-help/",
    body: [
      "For most City services, start with MyLA311. If you have a service request number and the work has not been completed, include it in your message so staff can follow up with the department.",
    ],
    meta: meta("need-help"),
  },
  {
    slug: "sign-up", title: "Sign up for updates",
    summary: "Subscribe to district email updates about City services, events, and neighborhood news.",
    platform: "Indigov (forms.indigov.com)", liveMethod: "lazy-loaded iframe in the WordPress page", embed: "iframe",
    formUrl: "https://forms.indigov.com/customers/councilmember-nithyaraman/ea1b0b81-fd18-49ad-ac34-4eb39ae86388",
    livePageUrl: "https://cd4.lacity.gov/sign-up/",
    body: [
      "The district newsletter covers City services and resources, upcoming events, and neighborhood updates. A separate volunteer list shares volunteer opportunities in the district.",
    ],
    meta: meta("sign-up"),
  },
  {
    slug: "grant-requests", title: "Grant requests",
    summary: "Information about the district's discretionary funding program for community organizations.",
    platform: "No form is currently published", liveMethod: "static notice", embed: "link-only",
    livePageUrl: "https://cd4.lacity.gov/grant-requests/",
    availability: { state: "on-hold", note: "The live site states that the CD4 Discretionary Funding Program is on hold until further notice. Applications are not being accepted." },
    body: [
      "The program has provided small grants to organizations for projects that serve community needs in Council District 4, funded from the district's portion of the AB 1290 Redevelopment Fund.",
      "This page will be updated when the City announces a change. Do not rely on older announcements about grant amounts or deadlines.",
    ],
    meta: meta("grant-requests"),
  },
  {
    slug: "transit-traffic-safety-requests", title: "Street & traffic safety requests",
    summary: "How to request traffic signs, signals, striping, and other transportation services.",
    platform: "MyLA311 (LADOT service requests)", liveMethod: "links to MyLA311; the former district web form is retired", embed: "link-only",
    formUrl: "https://myla311.lacity.gov/",
    livePageUrl: "https://cd4.lacity.gov/transit-traffic-safety-requests/",
    availability: { state: "moved", note: "LADOT now takes transportation service requests directly through MyLA311. The district office's earlier web form is no longer used." },
    body: [
      "Submit transportation and street-maintenance requests in MyLA311, online or by dialing 311. You will receive a service request number.",
      "If you submitted a request through the district's earlier web form and did not receive a confirmation with a service request number, submit it again in MyLA311.",
    ],
    alternatives: [
      { label: "Parking violations (blocked driveway): LADOT dispatch", href: "tel:+18183744823", description: "(818) 374-4823" },
      { label: "Report an abandoned vehicle", href: "https://prodpci.etimspayments.com/pbw/include/laopm/abandonc.htm", agency: "LADOT", description: "Or call 1-800-ABANDON (1-800-222-6366)." },
      { label: "LADOT Transit customer service", href: "tel:+18188082273", description: "(818) 808-2273" },
      { label: "Metro customer relations", href: "mailto:CustomerRelations@metro.net", description: "CustomerRelations@metro.net" },
    ],
    meta: meta("transit-traffic-safety-requests"),
  },
  {
    slug: "scheduling-requests", title: "Scheduling requests",
    summary: "Request a meeting with the district office, or invite the office to an event.",
    platform: "Google Forms", liveMethod: "link to the Google Form", embed: "link-only",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfh8udXoy8vyqGAseAacWXOW76hDEVASX1DKCYQhYRe0YPCXQ/viewform",
    livePageUrl: "https://cd4.lacity.gov/scheduling-requests/",
    body: [
      "Event invitations should be submitted at least one month before the event date. Meeting requests are accepted at any time.",
      "Allow two to three weeks for a response. Submitting a request does not confirm attendance.",
      "Members of the press can email cd4comms@lacity.org.",
    ],
    meta: meta("scheduling-requests"),
  },
];
