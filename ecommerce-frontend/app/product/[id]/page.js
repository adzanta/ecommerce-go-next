"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const checkLoginAndFetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:8080/me", {
          credentials: "include",
        });
  
        if (!res.ok) {
          router.push("/login");
          return;
        }
  
        if (id) {
          const productRes = await fetch(`http://localhost:8080/products/${id}`);
          const data = await productRes.json();
          setProduct(data);
        }
      } catch (err) {
        router.push("/login");
      }
    };
  
    checkLoginAndFetchProduct();
  }, [id, router]);
  
  
  

  if (!product) return <p className="text-center mt-20">Memuat produk...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white mt-10 rounded-xl shadow-md">
      <img
        src={product.image_url}
        alt={product.name}
        className="h-40 w-full object-contain rounded-lg mb-3 bg-white"
        />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-green-600 font-bold text-xl mb-6">Rp {product.price}</p>

      <button
      onClick={() => router.push(`/checkout?id=${product.id}`)}
      className="bg-green-600 hover:bg-green-700 transition duration-200 text-white font-semibold py-2 px-4 rounded-lg"
      >
      Beli Sekarang
    </button>

    </main>
  );
}
