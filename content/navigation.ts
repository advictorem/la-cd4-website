export interface NavLink { label: string; href: string; description?: string }
export interface NavSection { id: string; label: string; href: string; overview: string; /** Hide the "All …" link at the top of the dropdown. */ hideOverview?: boolean; groups: { heading?: string; links: NavLink[] }[] }

/** Six primary sections. Every section has a real landing page (href). */
export const primaryNav: NavSection[] = [
  {
    id: "services", label: "City Services", href: "/city-services/", overview: "All City services",
    groups: [
      { heading: "Find services", links: [
        { label: "For Residents", href: "/city-service/for-residents/" },
        { label: "For Businesses", href: "/city-service/for-businesses/" },
        { label: "Emergency Services", href: "/city-service/emergency-services/" },
      ] },
      { heading: "Make a request", links: [
        { label: "MyLA311 service requests", href: "https://myla311.lacity.gov/" },
        { label: "Street & traffic requests", href: "/transit-traffic-safety-requests/" },
        { label: "Request assistance", href: "/need-help/" },
      ] },
    ],
  },
  {
    id: "topics", label: "Topics & Resources", href: "/topics-resources/", overview: "All topics and resources",
    groups: [
      { heading: "Housing & support", links: [
        { label: "Housing Resources", href: "/initiative/housing-renters/" },
        { label: "Renter Rights & Assistance", href: "/initiative/renters-rights/" },
        { label: "Homelessness & Outreach Services", href: "/initiative/homelessness/" },
        { label: "Homelessness Data & Reports", href: "/initiative/homelessness-data-accountability/" },
      ] },
      { heading: "Streets, safety & environment", links: [
        { label: "Transportation & Street Safety", href: "/initiative/transit-mobility/" },
        { label: "Public Safety & Preparedness", href: "/initiative/public-safety/" },
        { label: "Environment & Sustainability", href: "/initiative/environment/" },
        { label: "Parks & Recreation", href: "/initiative/parks/" },
      ] },
      { heading: "Economy & government", links: [
        { label: "Small Business Resources", href: "/initiative/small-business/" },
        { label: "City Government & Transparency", href: "/initiative/governance-reform/" },
      ] },
    ],
  },
  {
id: "neighborhoods", label: "Neighborhoods", href: "/neighborhoods/", overview: "All neighborhoods", hideOverview: true,
    groups: [
      { links: [
        { label: "Encino", href: "/neighborhood/encino/" },
        { label: "Hollywood & Hollywood Hills", href: "/neighborhood/hollywood-hollywood-hills/" },
        { label: "Los Feliz & Silver Lake", href: "/neighborhood/los-feliz-silver-lake/" },
        { label: "Reseda", href: "/neighborhood/reseda/" },
        { label: "Sherman Oaks & Van Nuys", href: "/neighborhood/sherman-oaks-van-nuys/" },
        { label: "Studio City & Cahuenga Pass", href: "/neighborhood/studio-city-cahuenga-pass/" },
      ] },
    ],
  },
  {
    id: "news", label: "News & Events", href: "/news/", overview: "News & events overview",
    groups: [
      { heading: "Current", links: [
        { label: "Events", href: "/events/" },
        { label: "Community updates", href: "/news/#community-updates" },
        { label: "Sign up for updates", href: "/sign-up/" },
      ] },
      { heading: "Community updates", links: [
        { label: "Immigrant Rights & Resources", href: "/immigrant-rights-resources/" },
        { label: "Wildfire Recovery Resources", href: "/wildfire-recovery-resources/" },
        { label: "Hollywood Hills Tourism", href: "/hollywood-hills-tourism/" },
        { label: "Forest Lawn Dr Safety & Mobility Project", href: "/forest-lawn-dr-safety-mobility-project/" },
        { label: "Valley LARiverWay Project", href: "/valley-lariverway-project/" },
      ] },
      { heading: "Archive", links: [
        { label: "Press releases (2020–2026)", href: "/press-releases/" },
        { label: "Newsletters (2020–2026)", href: "/newsletters/" },
      ] },
    ],
  },
  {
    id: "about", label: "About CD4", href: "/district-4/", overview: "About Council District 4",
    groups: [
      { links: [
        { label: "District geography & map", href: "/district-4/#map" },
        { label: "How the district office helps", href: "/district-4/#how-the-office-helps" },
        { label: "Frequently asked questions", href: "/faq/" },
        { label: "Find your Council District", href: "https://neighborhoodinfo.lacity.gov/" },
        { label: "Office of the City Clerk", href: "https://clerk.lacity.gov/" },
      ] },
    ],
  },
  {
    id: "contact", label: "Contact", href: "/need-help/", overview: "Contact & get help",
    groups: [
      { links: [
        { label: "Request assistance", href: "/need-help/" },
        { label: "Sign up for updates", href: "/sign-up/" },
        { label: "Scheduling requests", href: "/scheduling-requests/" },
        { label: "Grant requests", href: "/grant-requests/" },
        { label: "Street & traffic requests", href: "/transit-traffic-safety-requests/" },
      ] },
    ],
  },
];
