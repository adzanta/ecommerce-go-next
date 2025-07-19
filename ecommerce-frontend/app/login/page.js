"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ⬅️ Penting agar cookie diterima
      body: JSON.stringify({ email, password }),
    });
  
    if (res.ok) {
      // ✅ Panggil endpoint /me untuk ambil user info dari token
      const meRes = await fetch("http://localhost:8080/me", {
        credentials: "include",
      });
  
      if (meRes.ok) {
        const me = await meRes.json();
        const role = me.role;
  
        if (role === "admin") {
          router.push("/admin/");
        } else {
          router.push("/");
        }
      } else {
        alert("Gagal mengambil data user");
      }
    } else {
      alert("Login gagal. Periksa email atau password.");
    }
  };
  

  return (
    <main className="max-w-sm mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-6">Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm mt-2 text-center">
          Belum punya akun? <a href="/register" className="text-green-600 underline">Daftar di sini</a>
        </p>
      </form>
    </main>
  );
}
