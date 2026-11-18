import type { ServiceCategory, ContentMeta } from "./types";

const meta = (slug: string): ContentMeta => ({
  route: `/city-service/${slug}/`,
  sourceUrl: `https://cd4.lacity.gov/city-service/${slug}/`,
  verifiedAt: "2026-11-17",
  contentOwner: "Council District 4 office",
  status: "pending-review",
});
const MYLA311 = "https://myla311.lacity.gov/";

/** Links carried over from the live CD4 City Services pages, regrouped by task. Dead or superseded links were dropped (see docs/content-audit.md). */
export const serviceCategories: ServiceCategory[] = [
  {
    slug: "for-residents", title: "For Residents", color: "teal", icon: "people",
    summary: "Everyday City services: request a pickup or repair, find family and senior services, and get around.",
    intro: [
      "MyLA311 is the City's front door for service requests. Use it to request bulky-item pickup, graffiti removal, pothole and streetlight repair, and more.",
      "If a request has not been completed in a reasonable time, contact the district office with your service request number.",
    ],
    groups: [
      { heading: "Report or request", links: [
        { label: "Create a MyLA311 service request", href: MYLA311, agency: "MyLA311", description: "Graffiti, illegal dumping, bulky items, potholes, and other requests." },
        { label: "Report a streetlight problem", href: "https://lalights.lacity.org/", agency: "Bureau of Street Lighting" },
        { label: "Report an abandoned vehicle", href: "https://prodpci.etimspayments.com/pbw/include/laopm/abandonc.htm", agency: "LADOT" },
        { label: "File a complaint or claim with the City", href: "https://lacity.gov/residents/file-complaint-claim", agency: "City of Los Angeles" },
      ] },
      { heading: "Home, permits & utilities", links: [
        { label: "Apply for a building permit", href: "https://www.ladbs.org/", agency: "LADBS" },
        { label: "Trash and recycling", href: "https://www.lacitysan.org/", agency: "LASAN" },
        { label: "Water conservation rules", href: "https://www.ladwp.com/who-we-are/water-system/water-conservation", agency: "LADWP" },
        { label: "Renter Rights & Assistance", href: "/initiative/renters-rights/", agency: "Council District 4" },
      ] },
      { heading: "Family & community", links: [
        { label: "Senior services", href: "https://lacity.gov/residents/community-assistance/senior-services", agency: "City of Los Angeles" },
        { label: "Disability services", href: "https://lacity.gov/residents/community-assistance/disability-services", agency: "City of Los Angeles" },
        { label: "Youth and family services", href: "https://lacity.gov/residents/community-assistance/youth-family-services", agency: "City of Los Angeles" },
        { label: "Child care resources", href: "https://communityinvestment.lacity.gov/paying-child-care", agency: "Community Investment for Families" },
        { label: "Domestic violence resources", href: "https://lacity.gov/residents/community-assistance/domestic-violence-resources", agency: "City of Los Angeles" },
        { label: "Civil and human rights resources", href: "https://civilandhumanrights.lacity.org/", agency: "Civil + Human Rights and Equity Department" },
      ] },
      { heading: "Getting around", links: [
        { label: "DASH and Commuter Express schedules", href: "https://www.ladottransit.com/", agency: "LADOT" },
        { label: "Pay a parking citation", href: "https://prodpci.etimspayments.com/pbw/include/laopm/pvb_home.html", agency: "LADOT" },
        { label: "Street & traffic safety requests", href: "/transit-traffic-safety-requests/", agency: "Council District 4 / LADOT" },
      ] },
      { heading: "Libraries, animals & recreation", links: [
        { label: "Find a library", href: "https://www.lapl.org/branches/", agency: "LAPL" },
        { label: "Arts and recreation", href: "https://lacity.gov/residents/arts-recreation", agency: "City of Los Angeles" },
        { label: "Adopt an animal", href: "https://www.laanimalservices.com/adopt/", agency: "LA Animal Services" },
        { label: "License a pet", href: "https://www.laanimalservices.com/laws-policies/animal-licenses/", agency: "LA Animal Services" },
      ] },
      { heading: "Your government", links: [
        { label: "Find your representatives", href: "https://neighborhoodinfo.lacity.gov/", agency: "City of Los Angeles" },
        { label: "City Government & Transparency", href: "/initiative/governance-reform/", agency: "Council District 4" },
      ] },
    ],
    meta: meta("for-residents"),
  },
  {
    slug: "for-businesses", title: "For Businesses", color: "ochre", icon: "briefcase",
    summary: "Register a business, get permits, find free advising, and bid on City contracts.",
    intro: [
      "These City agencies handle the most common business needs. For a fuller guide, see Small Business Resources.",
    ],
    groups: [
      { heading: "Start and register", links: [
        { label: "Business taxes and forms", href: "https://finance.lacity.gov/forms-list", agency: "Office of Finance" },
        { label: "Economic & Workforce Development Department", href: "https://ewdd.lacity.gov/", agency: "EWDD", description: "BusinessSource Centers, loans, and hiring programs." },
        { label: "LA Optimized", href: "https://www.lacityoptimized.org/", agency: "EWDD", description: "Digital help for small businesses." },
      ] },
      { heading: "Permits", links: [
        { label: "Building permits and plan check", href: "https://ladbs.org/services/core-services/plan-check-permit", agency: "LADBS" },
        { label: "Film permits", href: "https://www.filmla.com/for-filmmakers/permits/", agency: "FilmLA" },
      ] },
      { heading: "Work with the City", links: [
        { label: "City contracting opportunities (RAMP)", href: "https://www.rampla.org/s/", agency: "City of Los Angeles" },
      ] },
      { heading: "Hiring", links: [
        { label: "LA:RISE employer partners", href: "https://redfworkshop.org/larise/employer-partners/", agency: "REDF / EWDD" },
        { label: "California Homeless Hiring Tax Credit", href: "https://www.ftb.ca.gov/file/business/credits/homeless-hiring-tax-credit/index.html", agency: "California Franchise Tax Board" },
      ] },
    ],
    meta: meta("for-businesses"),
  },
  {
    slug: "emergency-services", title: "Emergency Services", color: "red", icon: "alert",
    summary: "Prepare for wildfire, storms, and outages, and find official recovery resources. In an emergency, call 911.",
    intro: [
      "For a life-threatening emergency, call 911. This page lists preparedness and recovery resources from the agencies responsible; it is not a live emergency feed.",
      "For current incident information, use the City's emergency updates page.",
    ],
    groups: [
      { heading: "Current information and alerts", links: [
        { label: "City emergency updates", href: "https://emergency.lacity.gov/updates", agency: "Emergency Management Department" },
        { label: "Sign up for NotifyLA alerts", href: "https://emergency.lacity.gov/alerts/notifyla", agency: "Emergency Management Department" },
        { label: "LAFD alerts", href: "https://www.lafd.org/alerts-sign", agency: "LAFD" },
        { label: "Report and track power outages", href: "https://www.ladwp.com/outages", agency: "LADWP" },
      ] },
      { heading: "Prepare", links: [
        { label: "Plan for evacuation: Ready, Set, Go!", href: "https://lafd.org/ready-set-go", agency: "LAFD" },
        { label: "Brush clearance", href: "https://www.lafd.org/fire-prevention/brush", agency: "LAFD" },
        { label: "Create a home escape plan", href: "https://lafd.org/community-risk-reduction/escape-plan", agency: "LAFD" },
        { label: "Wildfire preparedness", href: "https://www.lafd.org/wildfire", agency: "LAFD" },
        { label: "Storm preparation and sandbags", href: "https://emergency.lacity.gov/rain-impacts-and-preparation", agency: "Emergency Management Department" },
        { label: "Find your nearest fire station", href: "https://www.lafd.org/fire-stations/station-results", agency: "LAFD" },
      ] },
      { heading: "Recover", links: [
        { label: "City recovery resources", href: "https://emergency.lacity.gov/recovery", agency: "Emergency Management Department" },
        { label: "Wildfire Recovery Resources", href: "/wildfire-recovery-resources/", agency: "Council District 4" },
        { label: "211 LA", href: "https://211la.org/", agency: "211 LA County" },
        { label: "LA County debris removal", href: "https://recovery.lacounty.gov/debris-removal", agency: "LA County" },
      ] },
    ],
    meta: meta("emergency-services"),
  },
];
