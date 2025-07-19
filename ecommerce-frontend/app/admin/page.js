"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [role, setRole] = useState(null);
  const [chartData, setChartData] = useState([]); // ✅ Array untuk grafik
  const [orders, setOrders] = useState([]); // ✅ Array untuk tabel
  const router = useRouter();

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        // ✅ Cek apakah user admin
        const res = await fetch("http://localhost:8080/me", {
          credentials: "include",
        });
        if (!res.ok) {
          router.push("/login");
          return;
        }

        const user = await res.json();
        if (user.role !== "admin") {
          router.push("/login");
          return;
        }
        setRole(user.role);

        // ✅ Ambil data orders
        const orderRes = await fetch("http://localhost:8080/orders", {
          credentials: "include",
        });
        const orderData = await orderRes.json();

        if (Array.isArray(orderData)) {
          setOrders(orderData);

          // ✅ Format data untuk chart (jumlah order per tanggal)
          const grouped = orderData.reduce((acc, order) => {
            const date = new Date(order.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
            });
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});

          const chartArray = Object.entries(grouped).map(([date, total]) => ({
            date,
            total,
          }));

          setChartData(chartArray);
        }
      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
        router.push("/login");
      }
    };

    checkAdminAndFetchData();
  }, []);

  if (!role) {
    return <p className="text-center mt-20 text-gray-500">Memuat Dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">📊 Admin Dashboard</h1>

      {/* ✅ Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500 text-sm">Total Orders</h2>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500 text-sm">Grafik Data</h2>
          <p className="text-2xl font-bold">{chartData.length} Hari</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="text-gray-500 text-sm">Status</h2>
          <p className="text-2xl font-bold text-green-600">Aktif</p>
        </div>
      </div>

      {/* ✅ Grafik Order */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Grafik Order per Hari</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Tabel 5 Order Terbaru */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">5 Order Terbaru</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) &&
              orders.slice(0, 5).map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">
                    {new Date(order.created_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
