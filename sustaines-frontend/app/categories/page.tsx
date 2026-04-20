"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getStoredUser, clearStoredUser, isAdmin } from "@/lib/auth";

interface Category {
  id: number;
  categoryName: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/Categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Kategoriler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !isAdmin()) return;

    try {
      await api.post("/Categories", { categoryName: newCategoryName });
      setNewCategoryName("");
      setShowCreateForm(false);
      fetchCategories();
      alert("Kategori başarıyla eklendi.");
    } catch (error) {
      console.error("Kategori oluşturulurken hata:", error);
      alert("Kategori eklenemedi.");
    }
  };

  const handleEdit = async (id: number) => {
    if (!editingName.trim() || !isAdmin()) return;

    try {
      await api.put(`/Categories/${id}`, { id, categoryName: editingName });
      setEditingId(null);
      setEditingName("");
      fetchCategories();
      alert("Kategori güncellendi.");
    } catch (error) {
      console.error("Kategori güncellenirken hata:", error);
      alert("Kategori güncellenemedi.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?") || !isAdmin()) return;

    try {
      await api.delete(`/Categories/${id}`);
      fetchCategories();
      alert("Kategori başarıyla silindi.");
    } catch (error) {
      console.error("Kategori silinirken hata:", error);
      alert("Kategori silinemedi.");
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-gray-600 animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-[#0070C0]">Kategoriler</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-[#0070C0] hover:text-[#005da0] font-medium"
              >
                Yönetim Paneli
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Yeni Kategori Ekleme Butonu - Sadece Admin */}
        {isAdmin() && (
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#0070C0] text-white px-6 py-3 rounded-lg hover:bg-[#005da0] transition-colors font-medium shadow-md"
            >
              {showCreateForm ? "İptal" : "Yeni Kategori Ekle"}
            </button>
          </div>
        )}

        {/* Yeni Kategori Formu */}
        {isAdmin() && showCreateForm && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Yeni Kategori Ekle</h2>
            <form onSubmit={handleCreate} className="flex gap-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Kategori adını girin..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none text-black bg-gray-50/50"
                required
              />
              <button 
                type="submit" 
                className="bg-[#0070C0] text-white px-8 py-3 rounded-lg hover:bg-[#005da0] font-bold transition-all"
              >
                Ekle
              </button>
            </form>
          </div>
        )}

        {/* Kategoriler Tablosu */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Mevcut Kategoriler</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kategori Adı</th>
                  {isAdmin() && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">İşlemler</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                      Kategori bulunmamaktadır.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {editingId === category.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full p-2 border border-blue-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium">{category.categoryName}</span>
                        )}
                      </td>
                      {isAdmin() && (
                        <td className="px-6 py-4 text-sm space-x-4">
                          {editingId === category.id ? (
                            <>
                              <button
                                onClick={() => handleEdit(category.id)}
                                className="text-green-600 hover:text-green-800 font-bold"
                              >
                                Kaydet
                              </button>
                              <button
                                onClick={() => { setEditingId(null); setEditingName(""); }}
                                className="text-gray-500 hover:text-gray-700 font-bold"
                              >
                                İptal
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => { setEditingId(category.id); setEditingName(category.categoryName); }}
                                className="text-[#0070C0] hover:text-[#005da0] font-semibold"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
                                className="text-red-600 hover:text-red-800 font-semibold"
                              >
                                Sil
                              </button>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}