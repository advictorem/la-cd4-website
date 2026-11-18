import { pageMeta } from "@/lib/metadata";
import { FormPage } from "@/components/FormPage";

const [title, description] = ["Street & traffic safety requests","How to request traffic and transportation services in Council District 4."];
export const metadata = pageMeta({ title, description, route: "/transit-traffic-safety-requests/" });
export default function Page() {
  return <FormPage slug="transit-traffic-safety-requests" />;
}
