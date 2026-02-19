"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
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

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("semua");
  const [sortBy, setSortBy] = useState("bawaan");

  const categories = useMemo(() => {
    const unique = new Set(initialProducts.map((item) => item.category));
    return ["semua", ...Array.from(unique).sort()];
  }, [initialProducts]);

  const displayedProducts = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    let result = initialProducts.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(lowerSearch) ||
        item.description.toLowerCase().includes(lowerSearch);
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
              <p>{item.description}</p>
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