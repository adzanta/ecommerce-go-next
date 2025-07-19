"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Panggil endpoint logout backend (hapus cookie)
      const res = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
  
      if (res.ok) {
        router.push("/login");
      } else {
        alert("Gagal logout");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Terjadi kesalahan saat logout");
    }
  };
  

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Hwacamart</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
