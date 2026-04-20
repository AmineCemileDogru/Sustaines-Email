"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getStoredUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-center">
          <div className="text-2xl font-bold text-[#046DAE]">🌱 SustainES</div>
          <div className="flex gap-4 justify-center">
            {user ? (
              <>
                <span className="text-gray-700 font-semibold">{user.fullName}</span>
                <Link href="/dashboard" className="text-[#0070C0] hover:underline font-semibold">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-[#0070C0] hover:underline font-semibold">
                  Profilim
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:underline font-semibold"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[#0070C0] hover:underline font-semibold">
                  Giriş Yap
                </Link>
                <Link href="/register" className="text-[#0070C0] hover:underline font-semibold">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🌍 SustainES'e Hoş Geldiniz
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sürdürülebilir ürünler ve hizmetleri keşfedin
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="bg-[#0070C0] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#005da0] transition"
              >
                Kayıt Ol
              </Link>
              <Link
                href="/login"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Giriş Yap
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ürünleri Keşfet</h3>
            <p className="text-gray-600">
              Sağlayan kategorilerden sürdürülebilir ürünleri inceleyin
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Siparişleri Yönet</h3>
            <p className="text-gray-600">
              Kolayca siparişler oluşturun ve takip edin
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">İstatistikler</h3>
            <p className="text-gray-600">
              Detaylı analizler ve raporlar görüntüleyin
            </p>
          </div>
        </div>

        {/* Quick Links */}
        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Link
              href="/products"
              className="bg-blue-100 p-6 rounded-lg hover:bg-blue-200 transition font-semibold text-[#0070C0]"
            >
              📦 Ürünler
            </Link>
            <Link
              href="/create-order"
              className="bg-green-100 p-6 rounded-lg hover:bg-green-200 transition font-semibold text-green-700"
            >
              ✅ Sipariş Oluştur
            </Link>
            <Link
              href="/categories"
              className="bg-purple-100 p-6 rounded-lg hover:bg-purple-200 transition font-semibold text-purple-700"
            >
              🏷️ Kategoriler
            </Link>
            <Link
              href={user?.role === "Admin" ? "/users" : "/profile"}
              className="bg-orange-100 p-6 rounded-lg hover:bg-orange-200 transition font-semibold text-orange-700"
            >
              👤 {user?.role === "Admin" ? "Kullanıcılar" : "Profil"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}