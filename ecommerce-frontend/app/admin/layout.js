"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaChartBar, FaBoxOpen, FaClipboardList, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

export default function AdminLayout({ children }) {
  const [role, setRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = async () => {
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
        setRole(data.role);
      } catch {
        router.push("/login");
      }
    };

    checkAdmin();
  }, []);

  if (!role) {
    return <p className="text-center mt-20">Memuat...</p>;
  }

  // ✅ Menu items
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FaChartBar /> },
    { name: "Orders", path: "/admin/orders", icon: <FaClipboardList /> },
    { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-green-700 text-white flex flex-col justify-between transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 z-50`}        
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white text-2xl"
            >
              <FaTimes />
            </button>
          </div>
          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-lg font-medium transition-all ${
                  pathname === item.path
                    ? "bg-green-500 shadow-lg"
                    : "hover:bg-green-600"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-6">
          <button
            onClick={() => {
              fetch("http://localhost:8080/logout", { credentials: "include" });
              router.push("/login");
            }}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg bg-red-600 hover:bg-red-700 text-white text-lg font-medium"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay untuk HP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Navbar */}
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden bg-green-700 text-white px-3 py-2 rounded"
          >
            <FaBars />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
