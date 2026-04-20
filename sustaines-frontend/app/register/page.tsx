"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    fullName: "", 
    email: "", 
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/Auth/register", {
        FullName: formData.fullName.trim(),
        Email: formData.email.trim(),
        Password: formData.password
      });

      if (response.status === 200 || response.status === 201) {
        router.push(`/verification-sent?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-8">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="https://raw.githubusercontent.com/AmineCemileDogru/Sustaines-Email/main/Sustaines_Logosu.png" 
              alt="SustainES Logo" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="text-gray-500 font-medium">Sürdürülebilir bir gelecek için hesap oluşturun</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-1">👤 Ad Soyad</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070C0] outline-none text-black transition-all bg-gray-50/50"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-1">📧 E-posta Adresi</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070C0] outline-none text-black transition-all bg-gray-50/50"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-1">🔐 Şifre</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070C0] outline-none text-black transition-all bg-gray-50/50"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-1">🔐 Şifreyi Onayla</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070C0] outline-none text-black transition-all bg-gray-50/50"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0070C0] text-white py-3.5 rounded-xl font-bold hover:bg-[#005da0] transition-all text-lg shadow-lg disabled:opacity-50"
          >
            {loading ? "⏳ Kayıt Yapılıyor..." : "✅ Kayıt Ol"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            Zaten hesabınız var mı? <br/>
            <Link href="/login" className="text-[#0070C0] font-bold hover:underline">Giriş Yapın →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}