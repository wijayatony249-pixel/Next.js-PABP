import ProductGrid from "@/components/product-grid";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
};

type ProductResponse = {
  products: Product[];
};

export const dynamic = "force-static";

async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products?limit=24", {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data produk dari DummyJSON.");
  }

  const data = (await response.json()) as ProductResponse;
  return data.products;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="container">
      <h1 className="title">Katalog Produk DummyJSON (SSG + useState)</h1>
      <p className="subtitle">
        Data dibangun secara static site generation lalu diolah dinamis di
        browser.
      </p>
      <ProductGrid initialProducts={products} />
    </main>
  );
}
