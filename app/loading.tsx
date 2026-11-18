export default function Loading() {
  return (
    <div className="container section" role="status" aria-live="polite">
      <span className="visually-hidden">Loading page…</span>
      <div className="skeleton" style={{ height: "3rem", width: "min(28rem, 80%)" }} />
      <div className="skeleton" style={{ height: "1.25rem", width: "min(40rem, 95%)", marginTop: "1.25rem" }} />
      <div className="skeleton" style={{ height: "1.25rem", width: "min(34rem, 85%)", marginTop: "0.75rem" }} />
      <div className="grid grid--3" style={{ marginTop: "2.5rem" }}>
        {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: "9rem" }} />)}
      </div>
    </div>
  );
}
