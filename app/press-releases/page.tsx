import { content } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { ArchivePage } from "@/components/ArchivePage";

export const metadata = pageMeta({ title: "Press release archive (2020–2026)", description: "Historical press releases and statements from the District 4 Council office, with original dates.", route: "/press-releases/" });
export default function Page() {
  return <ArchivePage title="Press release archive" lede="Press releases and statements issued by the District 4 Council office from 2020 to 2026, listed with their original dates." items={content.pressReleases()} liveUrl="https://cd4.lacity.gov/press-releases/" />;
}
