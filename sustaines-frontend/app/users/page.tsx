"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getStoredUser, clearStoredUser, isAdmin } from "@/lib/auth";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/Users");
      const mappedUsers = response.data.map((user: any) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: typeof user.role === "string" ? user.role : user.role?.roleName || "User",
        isEmailVerified: user.isEmailVerified,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;

    try {
      await api.delete(`/Users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      alert("Kullanıcı başarıyla silindi.");
    } catch (error) {
      console.error("Kullanıcı silinirken hata:", error);
      alert("Kullanıcı silinirken bir hata oluştu.");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updateData = {
        fullName: editingUser.fullName,
        email: editingUser.email,
        roleName: editingUser.role,
      };

      await api.put(`/Users/${editingUser.id}`, updateData);
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
      alert("Kullanıcı başarıyla güncellendi.");
    } catch (error) {
      console.error("Kullanıcı güncellenirken hata:", error);
      alert("Kullanıcı güncellenirken bir hata oluştu.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newUser = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      roleName: (formData.get("roleId") as string) === "2" ? "Admin" : "User"
    };

    try {
      const response = await api.post("/Users", newUser);
      setUsers([...users, response.data]);
      setShowCreateForm(false);
      alert("Kullanıcı başarıyla oluşturuldu.");
    } catch (error) {
      console.error("Kullanıcı oluşturulurken hata:", error);
      alert("Kullanıcı oluşturulurken bir hata oluştu.");
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
            <h1 className="text-2xl font-bold text-[#0070C0]">Kullanıcı Yönetimi</h1>
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
        {/* Create User Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#0070C0] text-white px-6 py-3 rounded-lg hover:bg-[#005da0] transition-colors font-medium"
          >
            {showCreateForm ? "İptal" : "Yeni Kullanıcı Ekle"}
          </button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Yeni Kullanıcı Oluştur</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                    placeholder="Ad Soyad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                    placeholder="Şifre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    name="roleId"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                  >
                    <option value="1">User</option>
                    <option value="2">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#0070C0] text-white px-6 py-2 rounded-lg hover:bg-[#005da0] transition-colors"
                >
                  Oluştur
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit User Form */}
        {editingUser && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Kullanıcı Düzenle</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={editingUser.fullName}
                    onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    value={editingUser.role === "Admin" ? "2" : "1"}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value === "2" ? "Admin" : "User"})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0070C0] outline-none"
                  >
                    <option value="1">User</option>
                    <option value="2">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#0070C0] text-white px-6 py-2 rounded-lg hover:bg-[#005da0] transition-colors"
                >
                  Güncelle
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Kullanıcı Listesi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ad Soyad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-posta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doğrulama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "Admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isEmailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.isEmailVerified ? "Doğrulandı" : "Bekliyor"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-[#0070C0] hover:text-[#005da0] mr-4"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}