import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/public-sans/index.css";
import "@fontsource-variable/source-serif-4/index.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/components.css";
import { site } from "@/content/site";
import { CityBar } from "@/components/CityBar";
import { OfficialNavbarLoader } from "@/components/OfficialNavbarLoader";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { StagingBanner } from "@/components/Layout";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.owner}`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  robots: site.isProduction ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
  icons: { icon: "/brand/la-city-seal.svg" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#04184a" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <StagingBanner />
        {site.cityNavbar === "official" && <OfficialNavbarLoader />}
        <CityBar />
        <SiteHeader />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
