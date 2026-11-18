import type { ResourceLink } from "./types";

/** Home-page FAQ. Every answer restates something already published on this site and links to that page. */
export interface Faq { q: string; a: string; links?: ResourceLink[] }

export const faqs: Faq[] = [
  { q: "How do I know if I live in Council District 4?",
    a: "The district runs from Reseda and Encino in the San Fernando Valley to Los Feliz and Silver Lake. Some neighborhoods, including Reseda, Van Nuys, and Silver Lake, are split between Council districts, so look up your address with the City’s lookup tool to be sure.",
    links: [{ label: "About the district and its map", href: "/district-4/" }] },
  { q: "How do I report a pothole, graffiti, illegal dumping, or a broken streetlight?",
    a: "Use MyLA311, the City’s service-request system. You can submit a request online, in the MyLA311 app, or by dialing 311. Keep the service request number you receive.",
    links: [{ label: "Open MyLA311", href: "https://myla311.lacity.gov/" }, { label: "City services for residents", href: "/city-service/for-residents/" }] },
  { q: "My 311 request hasn’t been completed. What can I do?",
    a: "If a City service request has not been completed in a reasonable time, contact the district office and include your service request number so staff can follow up with the department.",
    links: [{ label: "Contact the district office", href: "/need-help/" }] },
  { q: "How do I request a stop sign, speed hump, or other traffic safety change?",
    a: "The Department of Transportation takes transportation service requests directly through MyLA311. For a blocked driveway or other parking violation, call LADOT dispatch at (818) 374-4823.",
    links: [{ label: "Street & traffic safety requests", href: "/transit-traffic-safety-requests/" }] },
  { q: "I’m a renter and received an eviction notice or a rent increase. Where do I start?",
    a: "Eviction notices have short deadlines, so act quickly. The Renter Rights & Assistance guide explains how to check whether your unit is covered by the Rent Stabilization Ordinance, how to file a complaint with the Los Angeles Housing Department, and where to find free legal help.",
    links: [{ label: "Renter Rights & Assistance", href: "/initiative/renters-rights/" }] },
  { q: "How do I get help for someone who is living outside?",
    a: "For an emergency, call 911. Otherwise, request outreach through the Los Angeles Homeless Outreach Portal (LA-HOP), or dial 211 for shelter and service referrals at any hour.",
    links: [{ label: "Homelessness & Outreach Services", href: "/initiative/homelessness/" }] },
  { q: "How do I sign up for emergency alerts and prepare for wildfire?",
    a: "Register with NotifyLA to receive City emergency alerts for your address, and use the Fire Department’s Ready, Set, Go! guide to make an evacuation plan, especially if you live in a hillside area.",
    links: [{ label: "Emergency Services", href: "/city-service/emergency-services/" }, { label: "Public Safety & Preparedness", href: "/initiative/public-safety/" }] },
  { q: "Are district community grants open for applications?",
    a: "No. The district’s discretionary funding program is on hold until further notice, and applications are not being accepted.",
    links: [{ label: "Grant requests", href: "/grant-requests/" }] },
  { q: "How do I contact the district office or invite it to an event?",
    a: "Use the assistance form, phone, or email on the contact page. To request a meeting or invite the office to an event, use the scheduling request form; event invitations should be sent at least one month ahead.",
    links: [{ label: "Contact & get help", href: "/need-help/" }, { label: "Scheduling requests", href: "/scheduling-requests/" }] },
];
