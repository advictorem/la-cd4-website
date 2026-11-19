"use client";

import { useState } from "react";
import type { Topic } from "@/content/types";
import { Icon } from "./Icon";
import { SmartLink } from "./SmartLink";

/**
 * Topic links. Desktop: a centered cluster of pill buttons.
 * Phones: a compact list of full-width rows. With `collapseAfter`, only the first rows show on phones
 * until "Show all topics" is pressed (the full set is always shown on larger screens).
 */
export function TopicPills({ topics, collapseAfter }: { topics: Topic[]; collapseAfter?: number }) {
  const [open, setOpen] = useState(false);
  const collapsible = collapseAfter !== undefined && topics.length > collapseAfter;
  return (
    <div className="pills-wrap">
      <ul className="pills" id="topic-pills" role="list" data-collapsed={collapsible && !open ? "" : undefined}>
        {topics.map((t, i) => (
          <li key={t.slug} className={collapsible && i >= collapseAfter! ? "pills__extra" : undefined}>
            <SmartLink className="pill" href={`/initiative/${t.slug}/`} data-color={t.color}>
              <Icon name={t.icon} size={18} /><span>{t.title}</span><Icon name="arrow" size={18} className="pill__chev" />
            </SmartLink>
          </li>
        ))}
      </ul>
      {collapsible && (
        <button type="button" className="pills__more" aria-expanded={open} aria-controls="topic-pills" onClick={() => setOpen(!open)}>
          {open ? "Show fewer topics" : `Show all ${topics.length} topics`}
          <Icon name="chevron" size={18} />
        </button>
      )}
    </div>
  );
}
