import { Lobster_Two } from "next/font/google";
import styles from "./store-header.module.css";

const brandFont = Lobster_Two({
  subsets: ["latin"],
  weight: ["700"],
});

export default function StoreHeader() {
  return (
    <section className={styles.banner}>
      <div className={styles.logoWrap} aria-hidden="true">
        <svg
          className={styles.logo}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 20H50L46 48H18L14 20Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M24 24V18C24 13.6 27.6 10 32 10C36.4 10 40 13.6 40 18V24"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M30 34H34"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <p className={styles.kicker}>Belanja Cepat, Harga Bersahabat</p>
        <h1 className={`${styles.brand} ${brandFont.className}`}>Tony&apos;s Mart</h1>
        <p className={styles.subtitle}>
          Katalog produk interaktif dengan data real-time dari DummyJSON.
        </p>
      </div>
    </section>
  );
}
