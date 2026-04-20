"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getStoredUser, clearStoredUser, isAdmin } from "@/lib/auth";

interface Product {
  id: number;
  productName: string;
  price: number;
  categoryId: number;
}

interface Category {
  id: number;
  categoryName: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await api.get("/Categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

    try {
      await api.delete(`/Products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      alert("Ürün başarıyla silindi.");
    } catch (error) {
      console.error("Ürün silinirken hata:", error);
      alert("Ürün silinirken bir hata oluştu.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await api.put(`/Products/${editingProduct.id}`, editingProduct);
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      alert("Ürün başarıyla güncellendi.");
    } catch (error) {
      console.error("Ürün güncellenirken hata:", error);
      alert("Ürün güncellenirken bir hata oluştu.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProduct = {
      productName: formData.get("productName"),
      price: parseFloat(formData.get("price") as string),
      categoryId: parseInt(formData.get("categoryId") as string)
    };

    try {
      const response = await api.post("/Products", newProduct);
      setProducts([...products, response.data]);
      setShowCreateForm(false);
      (e.target as HTMLFormElement).reset();
      alert("Ürün başarıyla oluşturuldu.");
    } catch (error) {
      console.error("Ürün oluşturulurken hata:", error);
      alert("Ürün oluşturulurken bir hata oluştu.");
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push("/login");
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.categoryName || "Kategorilendirmemiş";
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
            <h1 className="text-2xl font-bold text-[#0070C0]">Ürünler</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Product Button */}
        {isAdmin() && (
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#0070C0] text-white px-6 py-3 rounded-lg hover:bg-[#005da0] transition-colors font-medium"
            >
              {showCreateForm ? "İptal" : "Yeni Ürün Ekle"}
            </button>
          </div>
        )}

        {/* Create Product Form */}
        {isAdmin() && showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Yeni Ürün Ekle</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ürün Adı</label>
                <input
                  type="text"
                  name="productName"
                  required
                  placeholder="Ürün adını giriniz"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fiyat ($)</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  required
                  placeholder="9.99"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                <select
                  name="categoryId"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                >
                  <option value="">Kategori seçiniz</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0070C0] text-white py-3 rounded-lg hover:bg-[#005da0] transition-colors font-bold"
              >
                Ürün Oluştur
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Ürün Listesi</h3>
          </div>

          {products.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              Henüz ürün eklenmemiştir.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ürün Adı</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kategori</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fiyat</th>
                    {isAdmin() && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">İşlemler</th>}
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{product.productName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getCategoryName(product.categoryId)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                      {isAdmin() && (
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Sil
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Product Modal */}
        {editingProduct && isAdmin() && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ürünü Düzenle</h2>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ürün Adı</label>
                  <input
                    type="text"
                    value={editingProduct.productName}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fiyat ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0070C0] text-white py-2 rounded-lg hover:bg-[#005da0] transition-colors font-bold"
                  >
                    Güncelle
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors font-bold"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
