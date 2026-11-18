import { pageMeta } from "@/lib/metadata";
import { FormPage } from "@/components/FormPage";

const [title, description] = ["Grant requests","Status of the Council District 4 discretionary funding program."];
export const metadata = pageMeta({ title, description, route: "/grant-requests/" });
export default function Page() {
  return <FormPage slug="grant-requests" />;
}
