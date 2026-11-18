import type { IconName } from "@/content/types";

/** Line icons drawn for this project (24px grid, 1.75 stroke). Always decorative: pair with a text label. */
const paths: Record<IconName, string> = {
  leaf: "M5 19c0-8 5-13 14-14 0 9-5 14-14 14Zm0 0 7-7",
  building: "M4 20h16M6 20V9l6-4 6 4v11M9.5 20v-5h5v5M9.5 11.5h.01M14.5 11.5h.01",
  hands: "M12 20s-7-4.2-7-9.2A3.8 3.8 0 0 1 12 8.6a3.8 3.8 0 0 1 7 2.2c0 5-7 9.2-7 9.2Z",
  chart: "M4 20h16M7 20v-6M12 20V6M17 20v-9",
  home: "M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5M10 20v-5.5h4V20",
  tree: "M12 21v-6M12 15c-3.6 0-6-2.2-6-5.2C6 6.5 8.7 3 12 3s6 3.5 6 6.8c0 3-2.4 5.2-6 5.2ZM9.5 17.5h5",
  shield: "M12 3l7 2.8v5.7c0 4.3-2.9 7.6-7 9.5-4.1-1.9-7-5.2-7-9.5V5.8L12 3Zm-3 9 2.2 2.2L15.5 10",
  key: "M8 15.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm4-4h8.5v3M16.5 11.5V14",
  store: "M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5V20h16V9.5M9 20v-5.5h6V20",
  bus: "M6 17V6.5A2.5 2.5 0 0 1 8.5 4h7A2.5 2.5 0 0 1 18 6.5V17M6 17h12M6 12h12M8 17v2.5M16 17v2.5M9 14.5h.010M15 14.5h.010",
  phone: "M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3A2 2 0 0 1 18 19.5C10.5 19 5 13.5 4.5 6A2 2 0 0 1 6.5 4Z",
  alert: "M12 4 3 19.5h18L12 4Zm0 6v4.5M12 17h.010",
  people: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.5 8c0-3 2.5-5 5.5-5s5.5 2 5.5 5M16 11a2.5 2.5 0 1 0 0-5M17 14.2c2 .500 3.5 2.2 3.5 4.8",
  briefcase: "M4 8h16v11H4V8Zm5 0V5.5h6V8M4 13h16",
  mail: "M4 6h16v12H4V6Zm0 1 8 6 8-6",
  calendar: "M5 6h14v14H5V6Zm0 4h14M9 4v4M15 4v4",
  map: "M9 5 4 7v12l5-2 6 2 5-2V5l-5 2-6-2Zm0 0v12M15 7v12",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4.5 4.5",
  external: "M10 5H5v14h14v-5M13 5h6v6M19 5l-8.5 8.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  chevron: "M6 9l6 6 6-6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  check: "M5 12.5 10 17.5 19 7",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5.5M12 7.5h.010",
  document: "M7 3.5h7l4 4V20.5H7V3.5Zm7 0v4h4M9.5 12h5M9.5 15.5h5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2",
  pin: "M12 21s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0c0 5 6.5 11 6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.5 12h17M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z",
  list: "M8 7h12M8 12h12M8 17h12M4 7h.010M4 12h.010M4 17h.010",
  grid: "M4 5h16v15H4V5Zm0 5h16M4 15h16M9.3 10v10M14.7 10v10",
};

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
