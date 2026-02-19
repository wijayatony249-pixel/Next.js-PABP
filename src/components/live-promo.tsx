"use client";

import { useEffect, useState } from "react";

type PromoProduct = {
  id: number;
  title: string;
  discountPercentage: number;
};

type PromoResponse = {
  products: PromoProduct[];
};

const formatPersen = (value: number) => `${value.toFixed(1)}%`;

export default function LivePromo() {
  const [items, setItems] = useState<PromoProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPromo() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          "https://dummyjson.com/products?limit=5&select=id,title,discountPercentage",
        );

        if (!response.ok) {
          throw new Error("Gagal memuat promo realtime.");
        }

        const data = (await response.json()) as PromoResponse;
        if (isMounted) {
          setItems(data.products);
          setUpdatedAt(
            new Intl.DateTimeFormat("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date()),
          );
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Promo realtime belum tersedia. Coba muat ulang.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPromo();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="livePromo">
      <h3>Promo Realtime (CSR)</h3>
      <p className="livePromoNote">Data ini diambil di browser saat halaman dibuka.</p>

      {isLoading ? <p className="liveState">Sedang memuat promo...</p> : null}
      {errorMessage ? <p className="liveState">{errorMessage}</p> : null}

      {!isLoading && !errorMessage ? (
        <>
          <ul className="promoList">
            {items.map((item) => (
              <li key={item.id} className="promoItem">
                <span>{item.title}</span>
                <strong>Diskon {formatPersen(item.discountPercentage)}</strong>
              </li>
            ))}
          </ul>
          <p className="liveStamp">Pembaruan terakhir: {updatedAt}</p>
        </>
      ) : null}
    </section>
  );
}
