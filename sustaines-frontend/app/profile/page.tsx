"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getStoredUser, clearStoredUser, setStoredUser } from "@/lib/auth";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: ""
  });
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    fetchUserProfile(currentUser.id);
  }, [router]);

  const fetchUserProfile = async (userId: number) => {
    try {
      const response = await api.get(`/Users/${userId}`);
      const userData = {
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: typeof response.data.role === "string" ? response.data.role : response.data.role?.roleName || "User",
        isEmailVerified: response.data.isEmailVerified,
      };
      setUser(userData);
      setFormData({
        fullName: userData.fullName,
        email: userData.email
      });
    } catch (error) {
      console.error("Profil yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updatedUser = { ...user, ...formData };
      await api.put(`/Users/${user.id}`, updatedUser);

      setUser(updatedUser);
      setStoredUser(updatedUser); // Update stored user data
      setEditing(false);
      alert("Profil başarıyla güncellendi.");
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      alert("Profil güncellenirken bir hata oluştu.");
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Kullanıcı bulunamadı.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-[#0070C0]">Profilim</h1>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Kişisel Bilgiler</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-[#0070C0] text-white px-6 py-2 rounded-lg hover:bg-[#005da0] transition-colors"
              >
                Düzenle
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#0070C0] text-white px-6 py-2 rounded-lg hover:bg-[#005da0] transition-colors"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      fullName: user.fullName,
                      email: user.email
                    });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kullanıcı ID
                  </label>
                  <p className="text-lg text-gray-900">{user.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <p className="text-lg text-gray-900">{user.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    user.role === "Admin"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Doğrulama
                  </label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    user.isEmailVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {user.isEmailVerified ? "Doğrulandı" : "Doğrulanmamış"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}