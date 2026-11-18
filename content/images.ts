/**
 * Photography used on the site, with the attribution each license requires.
 * Five neighborhood photos and the home hero were supplied by the project owner; their sources and usage
 * rights are not yet confirmed. The Hollywood photo is from Wikimedia Commons (CC0). All are cropped to 16:10
 * and resized. /photo-credits/ lists every photo.
 */
export interface Photo { src: string; alt: string; title: string; artist: string; license: string; licenseUrl?: string; source?: string }

export const heroPhoto: Photo = {
  src: "/images/cd4-hills-panorama.webp",
  alt: "",
  title: "Panorama of the Cahuenga Pass and San Fernando Valley from the Hollywood Hills",
  artist: "Supplied by the project owner",
  license: "Usage rights to be confirmed before launch",
};

const SUPPLIED = { artist: "Supplied by the project owner", license: "Source and usage rights to be confirmed before launch" };

export const neighborhoodPhotos: Record<string, Photo> = {
  encino: {
    src: "/images/neighborhoods/encino-v2.webp", alt: "Ventura Boulevard in Encino at dusk, under the Encino Commons sign.",
    title: "Encino Commons sign over Ventura Boulevard at dusk", ...SUPPLIED,
  },
  "hollywood-hollywood-hills": {
    src: "/images/neighborhoods/hollywood-hollywood-hills.webp", alt: "The Hollywood Sign on Mount Lee at sunset, seen from above the Hollywood Hills.",
    title: "The Hollywood sign on Mount Lee (2017-05-01)", artist: "Sasha (Instagram.com/sanfrancisco)", license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en", source: "https://commons.wikimedia.org/wiki/File:The_Hollywood_sign_on_Mount_Lee_(2017-05-01).jpg",
  },
  "los-feliz-silver-lake": {
    src: "/images/neighborhoods/los-feliz-silver-lake-v2.webp", alt: "A lake with lit swan boats and a fountain at dusk, with the downtown Los Angeles skyline behind it.",
    title: "Lake with swan boats and the downtown skyline at dusk (supplied as silverlake.jpg)", ...SUPPLIED,
  },
  reseda: {
    src: "/images/neighborhoods/reseda-v2.webp", alt: "The yellow and blue Reseda sign on Sherman Way.",
    title: "Reseda sign on Sherman Way", ...SUPPLIED,
  },
  "sherman-oaks-van-nuys": {
    src: "/images/neighborhoods/sherman-oaks-van-nuys-v2.webp", alt: "A brick cafe patio with bougainvillea in Sherman Oaks.",
    title: "Cafe patio in Sherman Oaks", ...SUPPLIED,
  },
  "studio-city-cahuenga-pass": {
    src: "/images/neighborhoods/studio-city-cahuenga-pass-v2.webp", alt: "Ventura Boulevard in Studio City, lined with palm trees, beside the former Studio City Theatre.",
    title: "Ventura Boulevard in Studio City", ...SUPPLIED,
  },
};

/** Small category photos for the Local Resources block on neighborhood pages (Wikimedia Commons; cropped to 16:9 and resized). */
export const resourcePhotos: Record<"councils" | "civic" | "safety" | "parks", Photo> = {
  councils: { src: "/images/resources/councils.webp", alt: "", title: "Interior entrance of the Summit Community Center in Summit, New Jersey", artist: "Tomwsulcer", license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en", source: "https://commons.wikimedia.org/wiki/File:Interior_entrance_of_the_Summit_Community_Center_in_Summit,_New_Jersey.jpg" },
  civic: { src: "/images/resources/civic.webp", alt: "", title: "052707-031-FarmersMarket (Farmers Market, Los Angeles)", artist: "Bobak Ha’Eri", license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0", source: "https://commons.wikimedia.org/wiki/File:052707-031-FarmersMarket.jpg" },
  safety: { src: "/images/resources/safety.webp", alt: "", title: "Engine Co. No. 27 (Los Angeles Fire Department Museum)", artist: "Los Angeles (Wikimedia Commons user)", license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", source: "https://commons.wikimedia.org/wiki/File:Engine_Co._No._27_(Los_Angeles_Fire_Department_Museum).JPG" },
  parks: { src: "/images/resources/parks.webp", alt: "", title: "Downtown LA from Griffith Park", artist: "Serouj", license: "Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Downtown_LA_from_Griffith_Park.jpg" },
};
