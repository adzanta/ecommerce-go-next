"use client";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Pesanan Berhasil!</h1>
      <p className="text-gray-700 text-lg mb-6">
        Terima kasih telah melakukan pemesanan. Kami akan segera memprosesnya. 🚚
      </p>

      <a
        href="/"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
      >
        Kembali ke Beranda
      </a>
      <Footer />
    </main>
  );
}
