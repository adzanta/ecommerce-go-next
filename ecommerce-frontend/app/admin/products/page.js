"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const limit = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`http://localhost:8080/products?page=${currentPage}&limit=${limit}`);
      const result = await res.json();
      setProducts(result.data);
      setTotalPages(result.totalPages);
      setLoading(false);
    };

    fetchProducts();
  }, [currentPage]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleAddProduct = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("image", formData.image);

    const res = await fetch("http://localhost:8080/products", {
      method: "POST",
      body: data,
    });

    const newProduct = await res.json();
    setProducts([...products, newProduct]);
    setShowForm(false);
    setFormData({ name: "", description: "", price: "", image: null });
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/products/${id}`, {
      method: "DELETE",
    });
    setProducts(products.filter((p) => p.id !== id));
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-500 animate-pulse">Memuat produk...</p>;

  return (
    <main className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">📦 Manajemen Produk</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        {showForm ? "Tutup Form" : "Tambah Produk"}
      </button>

      {showForm && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Tambah Produk</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nama Produk"
              value={formData.name}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-lg"
            />
            <input
              type="text"
              name="description"
              placeholder="Deskripsi"
              value={formData.description}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-lg"
            />
            <input
              type="number"
              name="price"
              placeholder="Harga"
              value={formData.price}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded-lg"
            />
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="border px-4 py-2 rounded-lg"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Simpan Produk
          </button>
        </div>
      )}

      {/* Tabel Produk */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse shadow-sm">
          <thead className="bg-green-600 text-white sticky top-0">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Gambar</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={`${p.id}-${index}`} className="border-b hover:bg-green-50 transition">
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2 font-semibold">{p.name}</td>
                <td className="px-4 py-2 text-green-700 font-medium">
                  Rp {p.price ? Number(p.price).toLocaleString() : 0}
                </td>
                <td className="px-4 py-2">
                  <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1 ? "bg-green-600 text-white" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
