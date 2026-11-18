import { Icon } from "./Icon";

/** GET form to /search/. Works without JavaScript; results are rendered on the server. */
export function SiteSearch({ id, variant = "header", defaultValue, label }: { id: string; variant?: "header" | "hero"; defaultValue?: string; label?: string }) {
  return (
    <form className={`site-search${variant === "hero" ? " site-search--hero" : ""}`} role="search" action="/search/" method="get" aria-label={label ?? (variant === "hero" ? "Search Council District 4" : "Site search")}>
      <div className="field">
        <label htmlFor={id} className="visually-hidden">Search this site</label>
        <input id={id} name="q" type="search" placeholder={variant === "hero" ? "Search services, topics, neighborhoods" : "Search"} defaultValue={defaultValue} autoComplete="off" enterKeyHint="search" />
      </div>
      <button type="submit">
        <Icon name="search" size={20} />
        <span className={variant === "hero" ? undefined : "visually-hidden"}>Search</span>
      </button>
    </form>
  );
}
