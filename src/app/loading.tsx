export default function Loading() {
  return (
    <main className="container">
      <section className="loadingBlock" aria-label="Sedang memuat data">
        <div className="loadingTitle shimmer" />
        <div className="loadingSubtitle shimmer" />
        <div className="loadingGrid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="loadingCard shimmer" />
          ))}
        </div>
      </section>
    </main>
  );
}