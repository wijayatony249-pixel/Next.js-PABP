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

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(() => {
    const unique = new Set(initialProducts.map((item) => item.category));
    return ["all", ...Array.from(unique).sort()];
  }, [initialProducts]);

  const displayedProducts = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    let result = initialProducts.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(lowerSearch) ||
        item.description.toLowerCase().includes(lowerSearch);
      const matchesCategory = category === "all" || item.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating-desc") {
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
              {item}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="default">Urutan Default</option>
          <option value="price-asc">Harga Termurah</option>
          <option value="price-desc">Harga Termahal</option>
          <option value="rating-desc">Rating Tertinggi</option>
        </select>
      </div>

      <p className={styles.counter}>
        Menampilkan {displayedProducts.length} dari {initialProducts.length}{" "}
        produk
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
                <span>${item.price}</span>
                <span>⭐ {item.rating}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
