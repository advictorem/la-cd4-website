/**
 * Photography used on the site, with the attribution each license requires.
 * Neighborhood photos are from Wikimedia Commons (downloaded 2026-11-17, cropped to 16:10 and resized).
 * CC BY-SA images must stay credited wherever they are used; /photo-credits/ lists all of them.
 */
export interface Photo { src: string; alt: string; title: string; artist: string; license: string; licenseUrl?: string; source?: string }

export const heroPhoto: Photo = {
  src: "/images/cd4-hills-panorama.webp",
  alt: "",
  title: "Panorama of the Cahuenga Pass and San Fernando Valley from the Hollywood Hills",
  artist: "Supplied by the project owner",
  license: "Usage rights to be confirmed before launch",
};

export const neighborhoodPhotos: Record<string, Photo> = {
  encino: {
    src: "/images/neighborhoods/encino.webp", alt: "Ventura Boulevard in Encino, lined with palm trees and office buildings.",
    title: "Encino, Los Angeles, CA, USA - panoramio (149)", artist: "Clotee Pridgen Alloc… (Panoramio)", license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", source: "https://commons.wikimedia.org/wiki/File:Encino,_Los_Angeles,_CA,_USA_-_panoramio_(149).jpg",
  },
  "hollywood-hollywood-hills": {
    src: "/images/neighborhoods/hollywood-hollywood-hills.webp", alt: "The Hollywood Sign on Mount Lee at sunset, seen from above the Hollywood Hills.",
    title: "The Hollywood sign on Mount Lee (2017-05-01)", artist: "Sasha (Instagram.com/sanfrancisco)", license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en", source: "https://commons.wikimedia.org/wiki/File:The_Hollywood_sign_on_Mount_Lee_(2017-05-01).jpg",
  },
  "los-feliz-silver-lake": {
    src: "/images/neighborhoods/los-feliz-silver-lake.webp", alt: "Griffith Observatory at dusk, above Los Feliz.",
    title: "Griffith Observatory, Los Angeles 2011", artist: "Pedro Szekely", license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Griffith_Observatory,_Los_Angeles_2011.jpg",
  },
  reseda: {
    src: "/images/neighborhoods/reseda.webp", alt: "Sherman Way in Reseda, with a row of tall palm trees along the street.",
    title: "Sherman Way in Reseda, Los Angeles", artist: "Clotee Pridgen Alloc… (Panoramio)", license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", source: "https://commons.wikimedia.org/wiki/File:Sherman_Way_in_Reseda,_Los_Angeles.jpg",
  },
  "sherman-oaks-van-nuys": {
    src: "/images/neighborhoods/sherman-oaks-van-nuys.webp", alt: "Office towers at Ventura and Sepulveda boulevards in Sherman Oaks.",
    title: "Citibank and City National Bank Buildings, Ventura & Sepulveda, Sherman Oaks", artist: "Cbl62", license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", source: "https://commons.wikimedia.org/wiki/File:Citibank_and_City_National_Bank_Buildings,_Ventura_%26_Sepulveda,_Sherman_Oaks.JPG",
  },
  "studio-city-cahuenga-pass": {
    src: "/images/neighborhoods/studio-city-cahuenga-pass.webp", alt: "Shops and palm trees along Ventura Boulevard in Studio City.",
    title: "Studio City's Ventura Boulevard Shopping District", artist: "Cbl62", license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", source: "https://commons.wikimedia.org/wiki/File:Studio_City%27s_Ventura_Boulevard_Shopping_District.JPG",
  },
};
