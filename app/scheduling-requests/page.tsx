import { pageMeta } from "@/lib/metadata";
import { FormPage } from "@/components/FormPage";

const [title, description] = ["Scheduling requests","Request a meeting with the Council District 4 office or invite the office to an event."];
export const metadata = pageMeta({ title, description, route: "/scheduling-requests/" });
export default function Page() {
  return <FormPage slug="scheduling-requests" />;
}
