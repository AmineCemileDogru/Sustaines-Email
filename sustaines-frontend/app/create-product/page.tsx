"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getStoredUser, clearStoredUser, isAdmin } from "@/lib/auth";

interface Category {
  id: number;
  categoryName: string;
}

export default function CreateProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    categoryId: ""
  });
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

    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/Categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        productName: formData.productName,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId)
      };

      await api.post("/Products", productData);
      alert("Ürün başarıyla oluşturuldu!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Ürün oluşturulurken hata:", error);
      alert("Ürün oluşturulurken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-[#0070C0]">Yeni Ürün Oluştur</h1>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ürün Bilgileri</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Adı
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                placeholder="Ürün adını girin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                required
              >
                <option value="">Kategori seçin...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ürün Özeti</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ürün Adı:</span>
                  <span className="font-medium">{formData.productName || "Henüz girilmedi"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fiyat:</span>
                  <span className="font-medium">${formData.price || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori:</span>
                  <span className="font-medium">
                    {categories.find(c => c.id.toString() === formData.categoryId)?.categoryName || "Seçilmedi"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#0070C0] text-white py-3 px-6 rounded-lg hover:bg-[#005da0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Ürün Oluşturuluyor..." : "Ürün Oluştur"}
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