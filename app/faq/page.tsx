import { faqCategories } from "@/content/faqs";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot, ContactActions } from "@/components/Layout";
import { FaqList } from "@/components/Faq";
import { SmartLink } from "@/components/SmartLink";

export const metadata = pageMeta({ title: "Frequently asked questions", description: "Answers to common questions about housing, safety, and contacting the Council District 4 office.", route: "/faq/" });

export default function FaqPage() {
  return (
    <>
      <PageHeader title="Frequently asked questions" lede="Short answers to common questions, with links to the page that has the details." crumbs={[{ label: "About CD4", href: "/district-4/" }, { label: "FAQ" }]} />
      <div className="container section">
        <div className="split">
          <div>
            <nav aria-label="FAQ categories" className="faq-jump">
              <ul role="list">
                {faqCategories.map((c) => <li key={c.id}><SmartLink className="pill" href={`#${c.id}`}>{c.title}</SmartLink></li>)}
              </ul>
            </nav>
            {faqCategories.map((c) => (
              <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} style={{ marginTop: "var(--s7)", scrollMarginTop: "1rem" }}>
                <h2 id={`${c.id}-h`} style={{ fontSize: "var(--step-2)" }}>{c.title}</h2>
                <FaqList items={c.items} />
              </section>
            ))}
          </div>
          <div><ContactActions heading="Didn’t find your answer?" /></div>
        </div>
        <PageFoot title="Frequently asked questions" />
      </div>
    </>
  );
}
