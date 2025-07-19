"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const res = await fetch("http://localhost:8080/me", {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (data.role !== "admin") {
          router.push("/login");
          return;
        }

        // Fetch orders
        const orderRes = await fetch("http://localhost:8080/orders", {
          credentials: "include",
        });

        const orderData = await orderRes.json();
        setOrders(orderData);
        setFilteredOrders(orderData);
        setLoading(false);
      } catch {
        router.push("/login");
      }
    };

    fetchUserAndOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.name.toLowerCase().includes(search.toLowerCase()) ||
        order.product_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [search, orders]);

  if (loading) {
    return <p className="text-center mt-20 text-gray-500 animate-pulse">Memuat pesanan...</p>;
  }

  return (
    <main className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">📋 Daftar Pesanan</h1>

      {/* Search Bar */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Cari nama atau produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-72 shadow-sm focus:ring focus:ring-green-300"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse shadow-sm">
          <thead className="bg-green-600 text-white sticky top-0">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nama Produk</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Alamat</th>
              <th className="px-4 py-3">Catatan</th>
              <th className="px-4 py-3">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-green-50 transition duration-150"
                >
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2 font-semibold text-green-700">{order.product_name}</td>
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">{order.address}</td>
                  <td className="px-4 py-2 text-gray-500">{order.note || "-"}</td>
                  <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Tidak ada pesanan ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
