"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container">
      <section className="alert" role="alert">
        <h3>Terjadi kesalahan pada halaman</h3>
        <p>Silakan muat ulang halaman untuk mencoba lagi.</p>
        <button type="button" className="retryButton" onClick={() => reset()}>
          Coba Lagi
        </button>
      </section>
    </main>
  );
}