"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getStoredUser, clearStoredUser } from "@/lib/auth";

interface Product {
  id: number;
  productName: string;
  price: number;
  category: {
    id: number;
    categoryName: string;
  };
}

export default function CreateOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "1"
  });
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/Products");
      setProducts(response.data);
    } catch (error) {
      console.error("Ürünler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = getStoredUser();
    if (!currentUser) return;

    setSubmitting(true);
    try {
      const orderData = {
        userId: currentUser.id,
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity)
      };

      await api.post("/Orders", orderData);
      alert("Sipariş başarıyla oluşturuldu!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Sipariş oluşturulurken hata:", error);
      alert("Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find(p => p.id.toString() === formData.productId);
  const totalPrice = selectedProduct ? selectedProduct.price * parseInt(formData.quantity || "1") : 0;

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
            <h1 className="text-2xl font-bold text-[#0070C0]">Yeni Sipariş Oluştur</h1>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sipariş Bilgileri</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Seçin
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                required
              >
                <option value="">Ürün seçin...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id.toString()}>
                    {product.productName} - {product.category.categoryName} (${product.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miktar
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                required
              />
            </div>

            {selectedProduct && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sipariş Özeti</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ürün:</span>
                    <span className="font-medium">{selectedProduct.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategori:</span>
                    <span className="font-medium">{selectedProduct.category.categoryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Birim Fiyat:</span>
                    <span className="font-medium">${selectedProduct.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Miktar:</span>
                    <span className="font-medium">{formData.quantity}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Toplam:</span>
                    <span className="text-lg font-bold text-[#0070C0]">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#0070C0] text-white py-3 px-6 rounded-lg hover:bg-[#005da0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sipariş Oluşturuluyor..." : "Sipariş Oluştur"}
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