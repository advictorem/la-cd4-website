"use client";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="container section" role="alert">
      <h1>Something went wrong</h1>
      <p className="lede" style={{ marginTop: "1rem" }}>This page could not be displayed. You can try again, or go to the home page. For City services, dial 311.</p>
      <div className="btn-row" style={{ marginTop: "1.5rem" }}>
        <button type="button" className="btn" onClick={reset}>Try again</button>
        {/* Full page load on purpose: recover from a broken client state. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="btn btn--secondary" href="/">Go to the home page</a>
      </div>
      {error.digest && <p className="small muted" style={{ marginTop: "1rem" }}>Reference: {error.digest}</p>}
    </div>
  );
}
