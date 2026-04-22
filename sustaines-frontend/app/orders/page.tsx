"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getStoredUser, clearStoredUser, isAdmin } from "@/lib/auth";

interface Order {
  id: number;
  productId: number;
  userId: number;
  quantity: number;
  orderDate: string;
  product: {
    id: number;
    productName: string;
    price: number;
    category: {
      id: number;
      categoryName: string;
    };
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/Orders");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Siparişler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin()) {
      alert("Sadece admin sipariş silebilir!");
      return;
    }

    if (!confirm("Bu siparişi silmek istediğinizden emin misiniz?")) return;

    try {
      await api.delete(`/Orders/${id}`);
      fetchOrders(); // Listeyi yenile
    } catch (error) {
      console.error("Sipariş silinirken hata:", error);
      alert("Sipariş silinemedi!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070C0] mx-auto"></div>
          <p className="mt-4 text-gray-600">Siparişler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📦 Siparişler</h1>
            <p className="text-gray-600 mt-2">Tüm siparişleri görüntüleyin ve yönetin</p>
          </div>
          <button
            onClick={() => router.push("/create-order")}
            className="bg-[#0070C0] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#005da0] transition-all shadow-lg"
          >
            ➕ Yeni Sipariş
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz sipariş yok</h3>
            <p className="text-gray-600 mb-6">İlk siparişi oluşturmak için yukarıdaki butona tıklayın.</p>
            <button
              onClick={() => router.push("/create-order")}
              className="bg-[#0070C0] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#005da0] transition-all shadow-lg"
            >
              İlk Siparişi Oluştur
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-2xl">📦</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {order.product.productName}
                        </h3>
                        <p className="text-gray-600">{order.product.category.categoryName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Adet:</span>
                        <p className="text-gray-900">{order.quantity}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Birim Fiyat:</span>
                        <p className="text-gray-900">₺{order.product.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Toplam:</span>
                        <p className="text-[#0070C0] font-semibold">
                          ₺{(order.product.price * order.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Tarih:</span>
                        <p className="text-gray-900">
                          {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isAdmin() && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all text-sm"
                      >
                        🗑️ Sil
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}