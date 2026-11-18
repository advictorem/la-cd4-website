import { pageMeta } from "@/lib/metadata";
import { FormPage } from "@/components/FormPage";

const [title, description] = ["Sign up for updates","Subscribe to Council District 4 email updates."];
export const metadata = pageMeta({ title, description, route: "/sign-up/" });
export default function Page() {
  return <FormPage slug="sign-up" />;
}
