import { content } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { ArchivePage } from "@/components/ArchivePage";

export const metadata = pageMeta({ title: "Newsletter archive (2020–2026)", description: "Historical newsletters from the District 4 Council office, with original dates.", route: "/newsletters/" });
export default function Page() {
  return <ArchivePage title="Newsletter archive" lede="Email newsletters sent by the District 4 Council office from 2020 to 2026, listed with their original dates." items={content.newsletters()} liveUrl="https://cd4.lacity.gov/newsletters/" />;
}
