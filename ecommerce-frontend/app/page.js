"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(""); // "asc" atau "desc"
  const limit = 6;

  const fetchProducts = async (pageNum, searchQuery, sortOrder) => {
    const res = await fetch(
      `http://localhost:8080/products?page=${pageNum}&limit=${limit}&search=${searchQuery}&sort=${sortOrder}`
    );
    const result = await res.json();
    setProducts(result.data || []);
    setTotalPages(result.totalPages);
  };

  useEffect(() => {
    fetchProducts(page, search, sort);
  }, [page, search, sort]);

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-center">Produk Tersedia</h1>

      {/* ✅ Search & Sort */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset ke halaman 1
          }}
          className="border px-4 py-2 rounded-lg w-full sm:w-1/3"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-1/4"
        >
          <option value="">Urutkan</option>
          <option value="asc">Harga Terendah</option>
          <option value="desc">Harga Tertinggi</option>
        </select>
      </div>

      {/* Produk Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="h-40 w-full object-contain rounded-lg mb-3"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-green-600 font-bold">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 transition duration-200 text-white font-semibold py-2 px-4 rounded-lg mt-auto"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              Lihat Detail
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-green-600 text-white" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Footer />
    </main>
  );
}
