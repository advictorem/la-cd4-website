import type { HotTopic, ContentMeta } from "./types";

const meta = (slug: string, status: ContentMeta["status"] = "pending-review"): ContentMeta => ({
  route: `/${slug}/`,
  sourceUrl: `https://cd4.lacity.gov/${slug}/`,
  verifiedAt: "2026-11-17",
  contentOwner: "Council District 4 office",
  status,
});

/**
 * Community updates ("Hot Topics" on the live site), rewritten as neutral, dated information pages.
 * Facts are limited to what the live page or the linked agency states. Time-limited details
 * (deadlines, temporary sites, dollar amounts) were removed rather than restated.
 */
export const hotTopics: HotTopic[] = [
  {
    slug: "immigrant-rights-resources", title: "Immigrant Rights & Resources", kicker: "Community resource",
    color: "purple", icon: "people", sourceUpdated: "2025-06-01",
    summary: "General know-your-rights information and where to find immigration legal help in Los Angeles.",
    timeliness: "This page is general information, not legal advice. Immigration rules and enforcement practices change; confirm details with a qualified legal service provider.",
    sections: [
      { heading: "If you are approached by immigration officers", bullets: [
        "You have the right to remain silent. You can say, “I choose to remain silent.”",
        "Officers generally need a warrant signed by a judge to enter a home. You can ask to see it.",
        "You have the right to speak with an attorney before answering questions or signing any document.",
        "Do not present false documents.",
      ] },
      { heading: "If someone is arrested or detained", bullets: [
        "Ask for an attorney and do not sign anything before speaking with one.",
        "A person arrested by police has the right to make a local phone call.",
        "A person detained by immigration authorities can ask to contact their consulate.",
        "If you do not understand a document, say that you need an interpreter.",
      ] },
      { heading: "Prepare ahead", bullets: [
        "Make a family preparedness plan with contact information for an attorney, child care, and trusted adults.",
        "Memorize the phone number of someone who can call an attorney for you.",
        "Keep copies of important documents in a safe place.",
        "Keep school emergency contact information up to date.",
      ] },
      { heading: "Find a person who has been detained", paragraphs: [
        "The federal Online Detainee Locator System can be searched by A-number, or by name and country of birth. It can take more than a day for a person to appear in the system.",
        "The CHIRLA Immigrant Assistance Line is 888-624-4752.",
      ], links: [
        { label: "ICE Online Detainee Locator System", href: "https://locator.ice.gov/odls/#/search", agency: "U.S. Immigration and Customs Enforcement" },
      ] },
      { heading: "Know-your-rights materials and legal help", links: [
        { label: "Know Your Rights card (multiple languages)", href: "https://www.nilc.org/resources/know-your-rights-card/", agency: "National Immigration Law Center" },
        { label: "Civil + Human Rights and Equity Department", href: "https://civilandhumanrights.lacity.org/", agency: "City of Los Angeles", description: "City office that handles discrimination complaints and civil rights resources." },
        { label: "LA County Office of Immigrant Affairs", href: "https://oia.lacounty.gov/", agency: "LA County", description: "Free and low-cost legal services and referrals." },
        { label: "Los Angeles Unified parent portal", href: "https://parentportalapp.lausd.net/parentaccess/", agency: "LAUSD", description: "Update a student's emergency contacts." },
      ] },
    ],
    sources: [
      { label: "Source page on cd4.lacity.gov", href: "https://cd4.lacity.gov/immigrant-rights-resources/" },
      { label: "National Immigration Law Center", href: "https://www.nilc.org/" },
    ],
    relatedTopics: ["governance-reform", "renters-rights"], neighborhoods: [],
    meta: meta("immigrant-rights-resources"),
  },
  {
    slug: "wildfire-recovery-resources", title: "Wildfire Recovery Resources", kicker: "Recovery",
    color: "amber", icon: "alert", sourceUpdated: "2025-03-12",
    summary: "Official recovery resources for people affected by the January 2025 Los Angeles wildfires.",
    timeliness: "The live page was written during the January 2025 wildfires. Application deadlines, temporary recovery centers, and relief funds listed there have passed or changed, so they are not repeated here. Use the agency links below for current programs.",
    sections: [
      { heading: "Start here", paragraphs: [
        "Recovery programs are run by City, County, state, and federal agencies. Each agency's site lists what is currently available and who is eligible.",
      ], links: [
        { label: "City of Los Angeles recovery resources", href: "https://emergency.lacity.gov/recovery", agency: "Emergency Management Department" },
        { label: "LA County recovery", href: "https://recovery.lacounty.gov/", agency: "LA County" },
        { label: "FEMA disaster assistance", href: "https://www.disasterassistance.gov/", agency: "FEMA", description: "Check the status of an application or appeal. Helpline: 1-800-621-3362." },
        { label: "211 LA", href: "https://211la.org/", agency: "211 LA County", description: "Referrals to housing, food, and mental health support." },
      ] },
      { heading: "Rebuilding and debris", links: [
        { label: "LA County debris removal", href: "https://recovery.lacounty.gov/debris-removal", agency: "LA County" },
        { label: "Building permits for repair and rebuilding", href: "https://www.ladbs.org/", agency: "LADBS" },
      ] },
      { heading: "Businesses and workers", links: [
        { label: "Economic & Workforce Development Department", href: "https://ewdd.lacity.gov/", agency: "EWDD" },
        { label: "LA County Department of Economic Opportunity", href: "https://opportunity.lacounty.gov/", agency: "LA County" },
      ] },
      { heading: "Prepare for the next emergency", links: [
        { label: "Public Safety & Preparedness", href: "/initiative/public-safety/", agency: "Council District 4" },
        { label: "Emergency Services", href: "/city-service/emergency-services/", agency: "Council District 4" },
      ] },
    ],
    sources: [
      { label: "Source page on cd4.lacity.gov (January–March 2025)", href: "https://cd4.lacity.gov/wildfire-recovery-resources/" },
      { label: "City emergency updates", href: "https://emergency.lacity.gov/updates" },
    ],
    relatedTopics: ["public-safety", "small-business"], neighborhoods: ["hollywood-hollywood-hills", "sherman-oaks-van-nuys"],
    meta: meta("wildfire-recovery-resources"),
  },
  {
    slug: "hollywood-hills-tourism", title: "Hollywood Hills Tourism Management", kicker: "Neighborhood project",
    color: "teal", icon: "map", sourceUpdated: "2023-10-01",
    summary: "Background on traffic, parking, and visitor management near the Hollywood Sign, with links to the related Council files.",
    timeliness: "The live page describes work as of 2023. Check each Council file for its current status.",
    sections: [
      { heading: "Background", paragraphs: [
        "The Hollywood Sign is one of the most visited destinations in Los Angeles. Visitors seeking a close view of the Sign travel through residential hillside streets on both sides of the 101, which creates traffic, parking, and safety problems for residents and visitors.",
        "The City has deployed Department of Transportation traffic officers in the Hollywood Hills on busy weekends and holidays.",
      ] },
      { heading: "Related Council files", paragraphs: ["Each file's page on the City Clerk's site shows its documents and most recent action."], links: [
        { label: "CF 23-0701: Fencing along Mulholland Highway", href: "https://cityclerk.lacity.org/lacityclerkconnect/index.cfm?fa=ccfi.viewrecord&cfnumber=23-0701", agency: "City Clerk" },
        { label: "CF 23-0721: Visitor and vehicle counters at Lake Hollywood Park", href: "https://cityclerk.lacity.org/lacityclerkconnect/index.cfm?fa=ccfi.viewrecord&cfnumber=23-0721", agency: "City Clerk" },
        { label: "CF 23-0705: Roundabout at Mulholland Highway and Canyon Lake Drive", href: "https://cityclerk.lacity.org/lacityclerkconnect/index.cfm?fa=ccfi.viewrecord&cfnumber=23-0705", agency: "City Clerk" },
        { label: "CF 23-0706: Paid parking study at Lake Hollywood Park", href: "https://cityclerk.lacity.org/lacityclerkconnect/index.cfm?fa=ccfi.viewrecord&cfnumber=23-0706", agency: "City Clerk" },
        { label: "CF 17-1115-S1: Tour bus regulations east of the 101", href: "https://cityclerk.lacity.org/lacityclerkconnect/index.cfm?fa=ccfi.viewrecord&cfnumber=17-1115-S1", agency: "City Clerk" },
      ] },
      { heading: "Tour buses", paragraphs: [
        "Los Angeles Municipal Code section 80.36.11 allows the City to restrict tour bus operations on streets where the Department of Transportation finds a safety concern. Tour buses may be cited for stopping, standing, or parking on Mulholland Drive.",
      ], links: [
        { label: "LAMC section 80.36.11", href: "https://codelibrary.amlegal.com/codes/los_angeles/latest/lamc/0-0-0-166122", agency: "City of Los Angeles" },
      ] },
      { heading: "Report a problem", paragraphs: ["For parking violations, call LADOT dispatch at (818) 374-4823. For other traffic concerns, use the street and traffic request page."], links: [
        { label: "Street & traffic safety requests", href: "/transit-traffic-safety-requests/", agency: "Council District 4 / LADOT" },
      ] },
    ],
    sources: [
      { label: "Source page on cd4.lacity.gov", href: "https://cd4.lacity.gov/hollywood-hills-tourism/" },
      { label: "Council File Management System", href: "https://cityclerk.lacity.org/lacityclerkconnect/" },
    ],
    relatedTopics: ["transit-mobility", "public-safety", "parks"], neighborhoods: ["hollywood-hollywood-hills", "los-feliz-silver-lake"],
    meta: meta("hollywood-hills-tourism"),
  },
  {
    slug: "forest-lawn-dr-safety-mobility-project", title: "Forest Lawn Drive Safety & Mobility Project", kicker: "Street project",
    color: "teal", icon: "bus", sourceUpdated: "2025-01-20",
    summary: "An LADOT and StreetsLA project to resurface and reconfigure Forest Lawn Drive between Memorial Drive and Zoo Drive.",
    timeliness: "Construction timing and current status are published by LADOT. This page summarizes the project description and outreach record as of early 2025.",
    sections: [
      { heading: "What the project is", paragraphs: [
        "The project pairs resurfacing of Forest Lawn Drive, from Memorial Drive to Zoo Drive next to Griffith Park, with a reconfiguration of the roadway intended to lower vehicle speeds.",
        "LADOT measured median and 85th-percentile speeds on the corridor of 44 and 49 mph. The City's Mobility Plan classifies Forest Lawn Drive as an Avenue I, which has a target operating speed of 35 mph.",
      ] },
      { heading: "Planned changes", bullets: [
        "A protected curbside bike lane along most of the segment",
        "Longer and new left-turn pockets, and a center turn lane, at the entrances to Forest Lawn Memorial Park and Mount Sinai Memorial Park",
        "A new left-turn pocket at the Junior Achievement Center entrance",
        "Improved sightlines for turns onto and off Forest Lawn Drive",
      ] },
      { heading: "Public outreach", paragraphs: [
        "Between August 2023 and January 2025, LADOT and the district office recorded 2,765 pieces of feedback through an online survey, a public open house on December 4, 2024, an online feedback form, emails, letters, and a petition opposing the project.",
        "Commonly raised concerns included travel delay during funeral services, roadway capacity, and emergency access. LADOT's travel delay analysis and FAQ respond to these.",
      ] },
      { heading: "Project documents", links: [
        { label: "LADOT project page", href: "https://ladotlivablestreets.org/projects/forest-lawn", agency: "LADOT" },
        { label: "Complete Streets Design Guide", href: "https://planning.lacity.gov/odocument/c9596f05-0f3a-4ada-93aa-e70bbde68b0b/Complete_Street_Design_Guide.pdf", agency: "City Planning", description: "Defines street classifications and target operating speeds (PDF)." },
      ] },
    ],
    sources: [
      { label: "Source page on cd4.lacity.gov", href: "https://cd4.lacity.gov/forest-lawn-dr-safety-mobility-project/" },
      { label: "LADOT Livable Streets: Forest Lawn Drive", href: "https://ladotlivablestreets.org/projects/forest-lawn" },
    ],
    relatedTopics: ["transit-mobility", "public-safety"], neighborhoods: ["hollywood-hollywood-hills", "los-feliz-silver-lake", "studio-city-cahuenga-pass"],
    meta: meta("forest-lawn-dr-safety-mobility-project"),
  },
  {
    slug: "valley-lariverway-project", title: "Valley LARiverWay Project", kicker: "River project",
    color: "green", icon: "leaf", sourceUpdated: "2026-06-01",
    summary: "A planned continuous walking and biking path along the 12.4 miles of the Los Angeles River in the San Fernando Valley.",
    sections: [
      { heading: "What the project is", paragraphs: [
        "The LARiverWay is planned as a continuous multi-use path for walking and biking that connects existing segments along the Los Angeles River. The Bureau of Engineering divides the 12.4-mile San Fernando Valley stretch into nine segments.",
        "To date the path has been built segment by segment as grants became available.",
      ] },
      { heading: "2026 Urban Land Institute report", paragraphs: [
        "In February 2026 the district office and the Bureau of Engineering asked the Urban Land Institute to convene a Technical Assistance Panel on how to deliver the Valley path. The panel's report recommends:",
      ], bullets: [
        "Delivering the corridor as a single project rather than segment by segment",
        "Building the continuous path and safety features first, and adding other amenities over time",
        "Using one contract that combines design, construction, financing, and maintenance",
        "Aligning funding with the value the completed path is expected to create",
      ], links: [
        { label: "Valley LARiverWay Technical Assistance Panel report (PDF)", href: "https://cd4.lacity.gov/wp-content/uploads/2026/06/56-ULI-2026-TAP-Valley-LARiverWay-Project-TAP-Report-1.pdf", agency: "Urban Land Institute" },
      ] },
      { heading: "Who is responsible", paragraphs: ["The Bureau of Engineering manages design and construction of City river projects."], links: [
        { label: "Bureau of Engineering", href: "https://engineering.lacity.gov/", agency: "Bureau of Engineering" },
      ] },
    ],
    sources: [{ label: "Source page on cd4.lacity.gov", href: "https://cd4.lacity.gov/valley-lariverway-project/" }],
    relatedTopics: ["parks", "transit-mobility", "environment"], neighborhoods: ["encino", "reseda", "sherman-oaks-van-nuys", "studio-city-cahuenga-pass"],
    meta: meta("valley-lariverway-project"),
  },
];
