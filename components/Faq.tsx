import type { Faq } from "@/content/faqs";
import { Icon } from "./Icon";
import { SmartLink } from "./SmartLink";

/** FAQ accordion built on native <details>, so it works without JavaScript and with every input method. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q} className="faq__item">
          <summary><span>{f.q}</span><Icon name="chevron" size={22} /></summary>
          <div className="faq__answer">
            <p>{f.a}</p>
            {f.links && <ul role="list">{f.links.map((l) => <li key={l.href}><SmartLink className="arrow-link" href={l.href}>{l.label}</SmartLink></li>)}</ul>}
          </div>
        </details>
      ))}
    </div>
  );
}
