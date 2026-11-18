import type { Neighborhood, ContentMeta } from "./types";

const meta = (slug: string): ContentMeta => ({
  route: `/neighborhood/${slug}/`,
  sourceUrl: `https://cd4.lacity.gov/neighborhood/${slug}/`,
  verifiedAt: "2026-11-17",
  contentOwner: "Council District 4 office",
  // Addresses and phone numbers are carried over from the live page and must be re-confirmed before launch.
  status: "pending-review",
});

/**
 * Six neighborhood areas, using the live site's groupings and URLs.
 * Listings of other elected officials on the live pages were not carried over:
 * several were out of date, and they change independently of this site.
 */
export const neighborhoods: Neighborhood[] = [
  {
    slug: "encino", title: "Encino", areas: ["Encino"], region: "San Fernando Valley",
    overview: [
      "Encino, Spanish for “oak,” is the westernmost part of Council District 4, in the central San Fernando Valley.",
      "The area includes the Ventura Boulevard commercial corridor, Los Encinos State Historic Park, and the Sepulveda Basin Recreation Area.",
    ],
    councils: [{ name: "Encino Neighborhood Council", phone: "(747) 282-0450", href: "https://www.encinonc.org/" }],
    civic: [
      { name: "Encino–Tarzana Branch Library", address: "18231 Ventura Blvd., Tarzana, CA 91356", phone: "(818) 343-1983" },
      { name: "Encino Farmers Market", address: "17400 Victory Blvd., Van Nuys, CA 91406", href: "http://www.encinofarmersmarket.org/" },
      { name: "U.S. Post Office", address: "5805 White Oak Ave., Encino, CA 91316" },
    ],
    safety: [
      { name: "LAFD Fire Station 83", address: "4960 Balboa Blvd., Encino, CA 91436" },
      { name: "LAPD West Valley Community Police Station", address: "19020 Vanowen St., Reseda, CA 91335" },
    ],
    recreation: [
      { name: "Los Encinos State Historic Park", address: "16756 Moorpark St., Encino, CA 91436", phone: "(818) 784-4849", href: "https://losencinospark.com/rancho/" },
      { name: "Sepulveda Basin Recreation Area", address: "17017 Burbank Blvd., Encino, CA 91316", phone: "(818) 756-8189", href: "https://www.laparks.org/reccenter/sepulveda-basin-area" },
    ],
    projects: ["valley-lariverway-project"],
    relatedTopics: ["parks", "transit-mobility", "public-safety"],
    meta: meta("encino"),
  },
  {
    slug: "hollywood-hollywood-hills", title: "Hollywood & Hollywood Hills", areas: ["Hollywood", "Hollywood Hills"], region: "Hollywood Hills & Central LA",
    overview: [
      "The Hollywood Hills straddle the Cahuenga Pass in the Santa Monica Mountains and include hillside communities such as Beachwood Canyon, Laurel Canyon, Nichols Canyon, Outpost Estates, Whitley Heights, and Lake Hollywood Estates.",
      "The hills meet the Hollywood flats to the south. The area is home to the Hollywood Bowl, the Ford Theatre, and the Hollywood Sign.",
    ],
    councils: [
      { name: "Hollywood United Neighborhood Council", href: "https://hollywoodunitednc.org/" },
      { name: "Hollywood Hills West Neighborhood Council", href: "https://www.hhwnc.org/" },
      { name: "Bel Air–Beverly Crest Neighborhood Council", href: "https://www.babcnc.org/" },
    ],
    civic: [
      { name: "Will & Ariel Durant Branch Library", address: "7140 Sunset Blvd., Los Angeles, CA 90046", phone: "(323) 876-2741" },
      { name: "Frances Howard Goldwyn–Hollywood Regional Library", address: "1623 Ivar Ave., Los Angeles, CA 90028", phone: "(323) 856-8260" },
      { name: "Hollywood Farmers Market", address: "1600 Ivar Ave., Los Angeles, CA 90028", href: "https://seela.org/markets-hollywood/" },
    ],
    safety: [
      { name: "LAFD Fire Station 27", address: "1327 Cole Ave., Los Angeles, CA 90028", href: "https://www.lafd.org/fire-stations/station-27" },
      { name: "LAFD Fire Station 76", address: "3111 N. Cahuenga Blvd., Los Angeles, CA 90068" },
      { name: "LAFD Fire Station 82", address: "5769 Hollywood Blvd., Los Angeles, CA 90028" },
      { name: "LAPD Hollywood Community Police Station", address: "1358 Wilcox Ave., Los Angeles, CA 90028", phone: "(213) 972-2971" },
    ],
    recreation: [
      { name: "Lake Hollywood Park", address: "3160 Canyon Lake Dr., Los Angeles, CA 90068", href: "https://www.laparks.org/park/lake-hollywood" },
      { name: "Wattles Garden Park", address: "1850 N. Curson Ave., Los Angeles, CA 90046", href: "https://www.laparks.org/park/wattles-gardens" },
      { name: "Runyon Canyon Park", address: "2000 N. Fuller Ave., Los Angeles, CA 90046", href: "https://www.laparks.org/runyon/" },
    ],
    projects: ["hollywood-hills-tourism", "forest-lawn-dr-safety-mobility-project"],
    relatedTopics: ["public-safety", "parks", "transit-mobility"],
    meta: meta("hollywood-hollywood-hills"),
  },
  {
    slug: "los-feliz-silver-lake", title: "Los Feliz & Silver Lake", areas: ["Los Feliz", "Silver Lake"], region: "Hollywood Hills & Central LA",
    overview: [
      "Los Feliz is a hillside neighborhood in central Los Angeles next to Griffith Park and the Griffith Observatory.",
      "Silver Lake borders Los Feliz and is divided between Council District 4 and Council District 13. It includes the Silver Lake Reservoir and a network of historic public stairways.",
    ],
    councils: [
      { name: "Los Feliz Neighborhood Council", address: "1965 Hillhurst Ave., Los Angeles, CA 90027", phone: "(213) 973-9758", href: "https://www.losfeliznc.org/" },
      { name: "Silver Lake Neighborhood Council", address: "1850 W. Silver Lake Dr., Los Angeles, CA 90026", phone: "(323) 413-7562", href: "https://www.silverlakenc.org/" },
    ],
    civic: [
      { name: "Los Feliz Branch Library", address: "1874 Hillhurst Ave., Los Angeles, CA 90027", phone: "(323) 913-4710" },
      { name: "Silver Lake Branch Library", address: "2411 Glendale Blvd., Los Angeles, CA 90039", phone: "(323) 913-7451" },
      { name: "Silver Lake Farmers Market", address: "3700 Sunset Blvd., Los Angeles, CA 90026" },
    ],
    safety: [
      { name: "LAFD Fire Station 35", address: "1601 Hillhurst Ave., Los Angeles, CA 90027" },
      { name: "LAFD Fire Station 56", address: "2759 Rowena Ave., Los Angeles, CA 90039" },
      { name: "LAPD Northeast Community Police Station", address: "3353 N. San Fernando Rd., Los Angeles, CA 90065", phone: "(323) 561-3211" },
      { name: "LAPD Hollywood Community Police Station", address: "1358 Wilcox Ave., Los Angeles, CA 90028", phone: "(213) 972-2971" },
    ],
    recreation: [
      { name: "Griffith Park", href: "https://www.laparks.org/griffithpark/" },
      { name: "Silver Lake Recreation Center", address: "1850 W. Silver Lake Dr., Los Angeles, CA 90026", phone: "(323) 644-3946", href: "https://www.laparks.org/reccenter/silver-lake" },
      { name: "Silver Lake Dog Park", address: "1850 W. Silver Lake Dr., Los Angeles, CA 90026", href: "https://www.laparks.org/dogpark/silverlake" },
      { name: "Bond Park", address: "3222 Los Feliz Blvd., Los Angeles, CA 90039" },
    ],
    projects: ["forest-lawn-dr-safety-mobility-project", "hollywood-hills-tourism"],
    relatedTopics: ["parks", "renters-rights", "transit-mobility"],
    meta: meta("los-feliz-silver-lake"),
  },
  {
    slug: "reseda", title: "Reseda", areas: ["Reseda"], region: "San Fernando Valley",
    overview: [
      "Reseda is a west San Fernando Valley neighborhood centered on Sherman Way and Reseda Boulevard, with a mix of homes, apartments, restaurants, and shops.",
      "Only part of Reseda is in Council District 4. Use the district map or the City's address lookup to confirm your Council District.",
    ],
    councils: [{ name: "Reseda Neighborhood Council", address: "18118 Sherman Way, Reseda, CA 91335", href: "https://resedacouncil.org/" }],
    civic: [
      { name: "West Valley Regional Branch Library", address: "19036 Vanowen St., Reseda, CA 91335", href: "https://www.lapl.org/branches/west-valley" },
      { name: "U.S. Post Office", address: "7320 Reseda Blvd., Reseda, CA 91335" },
      { name: "Encino Farmers Market", address: "17400 Victory Blvd., Van Nuys, CA 91406", href: "http://www.encinofarmersmarket.org/" },
    ],
    safety: [
      { name: "LAFD Fire Station 73", address: "7419 Reseda Blvd., Reseda, CA 91335" },
      { name: "LAPD West Valley Community Police Station", address: "19020 Vanowen St., Reseda, CA 91335" },
    ],
    recreation: [{ name: "Reseda Park & Recreation Center", address: "18411 Victory Blvd., Reseda, CA 91335" }],
    projects: ["valley-lariverway-project"],
    relatedTopics: ["small-business", "transit-mobility", "housing-renters"],
    meta: meta("reseda"),
  },
  {
    slug: "sherman-oaks-van-nuys", title: "Sherman Oaks & Van Nuys", areas: ["Sherman Oaks", "Van Nuys"], region: "San Fernando Valley",
    overview: [
      "Sherman Oaks sits at the center of the district's stretch of the San Fernando Valley, with shopping and dining along Ventura Boulevard and hillside neighborhoods in the Santa Monica Mountains.",
      "Van Nuys, to the north, is a civic and commercial hub of the Valley. Only part of Van Nuys is in Council District 4.",
    ],
    councils: [
      { name: "Sherman Oaks Neighborhood Council", address: "PO Box 57721, Sherman Oaks, CA 91413", phone: "(818) 503-2399", href: "https://www.shermanoaksnc.org/" },
      { name: "Sherman Oaks Chamber of Commerce", address: "14827 Ventura Blvd. #207, Sherman Oaks, CA 91403", href: "https://www.shermanoakschamber.org/" },
    ],
    civic: [
      { name: "Sherman Oaks Martin Pollard Branch Library", address: "14245 Moorpark St., Sherman Oaks, CA 91423", phone: "(818) 205-9716" },
    ],
    safety: [
      { name: "LAFD Fire Station 88", address: "5101 Sepulveda Blvd., Sherman Oaks, CA 91403" },
      { name: "LAPD Van Nuys Community Police Station", address: "6240 Sylmar Ave., Van Nuys, CA 91401" },
    ],
    recreation: [
      { name: "Van Nuys/Sherman Oaks Recreation Center & Pool", address: "14201 Huston St., Sherman Oaks, CA 91423", phone: "(818) 783-5121", href: "https://www.laparks.org/reccenter/vnso" },
      { name: "Van Nuys/Sherman Oaks War Memorial Park", address: "14201 Huston St., Sherman Oaks, CA 91423" },
    ],
    projects: ["valley-lariverway-project", "wildfire-recovery-resources"],
    relatedTopics: ["small-business", "parks", "public-safety"],
    meta: meta("sherman-oaks-van-nuys"),
  },
  {
    slug: "studio-city-cahuenga-pass", title: "Studio City & Cahuenga Pass", areas: ["Studio City", "Cahuenga Pass"], region: "San Fernando Valley",
    overview: [
      "Studio City, in the southeast San Fernando Valley, takes its name from the studio lot established there in 1927. It includes a stretch of Ventura Boulevard and part of the LA River Greenway.",
      "The Cahuenga Pass, to the east, connects the Valley to Hollywood through the eastern Santa Monica Mountains. Its name comes from the Tongva village of Kawé’nga.",
    ],
    councils: [
      { name: "Studio City Neighborhood Council", phone: "(818) 655-5400", href: "https://www.studiocitync.org/" },
      { name: "Studio City Residents Association", href: "https://studiocityresidents.org/" },
      { name: "Studio City Chamber of Commerce", phone: "(818) 655-5916", href: "http://www.studiocitychamber.com/" },
    ],
    civic: [
      { name: "Studio City Branch Library", address: "12511 Moorpark St., Studio City, CA 91604", phone: "(818) 755-7873", href: "https://www.lapl.org/branches/studio-city" },
      { name: "Studio City Farmers Market", href: "http://studiocityfarmersmarket.com/" },
      { name: "U.S. Post Office", address: "3950 Laurel Canyon Blvd., Studio City, CA 91604" },
    ],
    safety: [
      { name: "LAFD Fire Station 78", address: "4041 Whitsett Ave., Studio City, CA 91604", href: "https://www.lafd.org/fire-stations/station-78" },
      { name: "LAPD North Hollywood Community Police Station", address: "11640 Burbank Blvd., North Hollywood, CA 91601", phone: "(818) 623-4016" },
    ],
    recreation: [
      { name: "Studio City Recreation Center", address: "12621 Rye St., Studio City, CA 91604", phone: "(818) 769-4415" },
      { name: "Woodbridge Park", address: "11240 Moorpark St., Studio City, CA 91602", href: "https://www.laparks.org/park/woodbridge" },
      { name: "Coldwater Canyon Park", address: "12601 N. Mulholland Dr., Beverly Hills, CA 90210", href: "https://www.laparks.org/park/coldwater-canyon" },
      { name: "Wilacre Park", address: "12601 Mulholland Dr., Studio City, CA 91604", href: "https://mrca.ca.gov/parks/park-listing/wilacre-park" },
      { name: "Fryman Canyon Park", address: "8401 Mulholland Dr., Studio City, CA 91604", href: "https://mrca.ca.gov/parks/park-listing/fryman-canyon-park/" },
      { name: "South Weddington Park", address: "Valleyheart Dr. and Lankershim Blvd., Studio City, CA 91604", href: "https://www.laparks.org/park/weddington-south" },
    ],
    projects: ["valley-lariverway-project", "forest-lawn-dr-safety-mobility-project"],
    relatedTopics: ["parks", "transit-mobility", "small-business"],
    meta: meta("studio-city-cahuenga-pass"),
  },
];
