"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getStoredUser, clearStoredUser, isAdmin } from "@/lib/auth";

export default function CreateCategoryPage() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/dashboard");
      return;
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setSubmitting(true);
    try {
      const categoryData = {
        categoryName: categoryName.trim()
      };

      await api.post("/Categories", categoryData);
      alert("Kategori başarıyla oluşturuldu!");
      setCategoryName("");
      router.push("/dashboard");
    } catch (error) {
      console.error("Kategori oluşturulurken hata:", error);
      alert("Kategori oluşturulurken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-[#0070C0]">Yeni Kategori Oluştur</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-[#0070C0] hover:text-[#005da0] font-medium"
              >
                Yönetim Paneli
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategori Bilgileri</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Adı
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                placeholder="Kategori adını girin (örn: Elektronik, Giyim, Yiyecek)"
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kategori Özeti</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori Adı:</span>
                  <span className="font-medium">{categoryName || "Henüz girilmedi"}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting || !categoryName.trim()}
                className="flex-1 bg-[#0070C0] text-white py-3 px-6 rounded-lg hover:bg-[#005da0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Kategori Oluşturuluyor..." : "Kategori Oluştur"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}