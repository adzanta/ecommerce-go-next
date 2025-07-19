"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Checkout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    fetch("http://localhost:8080/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("kamu belom login");
        return res.json();
      })
      .then((data) => {
        setUserId(data.user_id);
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);
  

  // Ambil data produk
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data));
    }
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Nama wajib diisi";
    if (!address.trim()) newErrors.address = "Alamat wajib diisi";
    if (name.length > 50) newErrors.name = "Nama maksimal 50 karakter";
    if (address.length > 100) newErrors.address = "Alamat maksimal 100 karakter";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const orderData = {
      product_id: product.id,
      user_id: userId,
      name,
      address,
      note,
    };
  
    console.log("DATA YANG DIKIRIM:", orderData);
  
    const res = await fetch("http://localhost:8080/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
      credentials: "include",
    });    
  
    if (res.ok) {
      router.push("/success");
    } else {
      alert("Gagal memproses pesanan.");
    }
  };
  

  if (!product)
    return <p className="text-center mt-20 text-gray-500 animate-pulse">Memuat produk...</p>;

  if (success)
    return (
      <div className="text-center mt-20 text-green-600 text-xl font-semibold animate-bounce">
        🎉 Pesanan berhasil dikirim!
      </div>
    );

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white mt-10 rounded-2xl shadow-lg border">
      <h1 className="text-3xl font-bold mb-4 text-center text-green-700">
        Checkout Produk
      </h1>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full md:w-1/2 h-60 object-contain rounded-lg border bg-gray-50"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-700 mt-2">{product.description}</p>
          <p className="mt-4 text-green-600 text-lg font-bold">
            Rp {product.price}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Nama Lengkap</span>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Nama kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Alamat Lengkap</span>
          <textarea
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Alamat pengiriman"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}

        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Catatan (opsional)</span>
          <textarea
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Contoh: Kirim siang hari"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </label>

        <button
          type="submit"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
        >
          Kirim Pesanan 🚀
        </button>
      </form>
    </main>
  );
}
