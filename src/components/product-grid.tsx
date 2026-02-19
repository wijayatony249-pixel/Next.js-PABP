"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./product-grid.module.css";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
};

type ProductGridProps = {
  initialProducts: Product[];
};

const USD_TO_IDR_RATE = 16000;

const formatRupiah = (usdPrice: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(usdPrice * USD_TO_IDR_RATE);

const formatLabelKategori = (value: string) => {
  if (value === "semua") {
    return "Semua Kategori";
  }

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const RULES_TERJEMAHAN: Array<[RegExp, string]> = [
  [/\bwith\b/gi, "dengan"],
  [/\band\b/gi, "dan"],
  [/\bfor\b/gi, "untuk"],
  [/\bfrom\b/gi, "dari"],
  [/\bthe\b/gi, ""],
  [/\ba\b/gi, "sebuah"],
  [/\bhigh-quality\b/gi, "berkualitas tinggi"],
  [/\bpremium\b/gi, "premium"],
  [/\blightweight\b/gi, "ringan"],
  [/\bdurable\b/gi, "tahan lama"],
  [/\bcomfortable\b/gi, "nyaman"],
  [/\bwireless\b/gi, "nirkabel"],
  [/\bsmartphone\b/gi, "ponsel pintar"],
  [/\blaptop\b/gi, "laptop"],
  [/\bheadphones\b/gi, "headphone"],
  [/\bshoes\b/gi, "sepatu"],
  [/\bwatch\b/gi, "jam tangan"],
  [/\bfragrance\b/gi, "parfum"],
  [/\bmoisturizing\b/gi, "melembapkan"],
  [/\bskin\b/gi, "kulit"],
  [/\bhair\b/gi, "rambut"],
  [/\bcare\b/gi, "perawatan"],
  [/\bproduct\b/gi, "produk"],
];

const terjemahkanDeskripsi = (text: string) => {
  let hasil = text;

  for (const [pattern, replacement] of RULES_TERJEMAHAN) {
    hasil = hasil.replace(pattern, replacement);
  }

  return hasil
    .replace(/\s{2,}/g, " ")
    .replace(/\s([.,!?])/g, "$1")
    .trim();
};

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("semua");
  const [sortBy, setSortBy] = useState("bawaan");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("theme-mode") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    window.localStorage.setItem("theme-mode", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const categories = useMemo(() => {
    const unique = new Set(initialProducts.map((item) => item.category));
    return ["semua", ...Array.from(unique).sort()];
  }, [initialProducts]);

  const displayedProducts = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    let result = initialProducts
      .map((item) => ({
        ...item,
        translatedDescription: terjemahkanDeskripsi(item.description),
      }))
      .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(lowerSearch) ||
        item.description.toLowerCase().includes(lowerSearch) ||
        item.translatedDescription.toLowerCase().includes(lowerSearch);
      const matchesCategory = category === "semua" || item.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "harga-naik") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "harga-turun") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating-tertinggi") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, initialProducts, search, sortBy]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.themeButton}
          onClick={() => setIsDarkMode((prev) => !prev)}
        >
          {isDarkMode ? "Mode Terang" : "Mode Gelap"}
        </button>
      </div>

      <div className={styles.controls}>
        <input
          className={styles.input}
          placeholder="Cari produk..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className={styles.select}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {formatLabelKategori(item)}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="bawaan">Urutan Bawaan</option>
          <option value="harga-naik">Harga Terendah</option>
          <option value="harga-turun">Harga Tertinggi</option>
          <option value="rating-tertinggi">Rating Tertinggi</option>
        </select>
      </div>

      <p className={styles.counter}>
        Menampilkan {displayedProducts.length} dari {initialProducts.length} produk
      </p>

      <div className={styles.grid}>
        {displayedProducts.map((item) => (
          <article key={item.id} className={styles.card}>
            <Image
              className={styles.thumb}
              src={item.thumbnail}
              alt={item.title}
              width={320}
              height={180}
            />
            <div className={styles.cardBody}>
              <h2>{item.title}</h2>
              <p>{item.translatedDescription}</p>
              <div className={styles.meta}>
                <span>{formatRupiah(item.price)}</span>
                <span>Rating {item.rating}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
