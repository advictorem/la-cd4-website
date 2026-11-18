import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/public-sans/index.css";
import "@fontsource-variable/source-serif-4/index.css";
import "@fontsource/open-sans/400.css"; // used only by the City global bar, to match the City widget
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/components.css";
import { site } from "@/content/site";
import { CityBar } from "@/components/CityBar";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { SignupPrompt } from "@/components/SignupPrompt";
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
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Apply saved accessibility options before first paint (see components/AccessibilityMenu.tsx). */}
        <script dangerouslySetInnerHTML={{ __html: `try{var p=JSON.parse(localStorage.getItem("cd4-a11y")||"{}"),d=document.documentElement.dataset;if(p.text&&p.text!=="default")d.text=p.text;if(p.contrast)d.contrast="high";if(p.links)d.links="underline";if(p.spacing)d.spacing="wide";if(p.motion)d.motion="off"}catch(e){}` }} />
        <a className="skip-link" href="#main">Skip to main content</a>
        <CityBar />
        <StagingBanner />
        <SiteHeader />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <SignupPrompt />
      </body>
    </html>
  );
}
