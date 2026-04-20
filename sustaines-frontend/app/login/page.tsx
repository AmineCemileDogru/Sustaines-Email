"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { setStoredUser } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/Auth/login", {
        email: email.trim(),
        password: password
      });

      if (response.status === 200) {
        setStoredUser({
          id: response.data.id,
          fullName: response.data.fullName,
          email: response.data.email,
          role: response.data.role
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="https://raw.githubusercontent.com/AmineCemileDogru/Sustaines-Email/main/Sustaines_Logosu.png" 
              alt="SustainES Logo" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="text-gray-500 font-medium">Hoş geldiniz, lütfen giriş yapın</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold text-left">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📧 E-Posta Adresi</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070C0] outline-none text-black transition-all bg-gray-50/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🔐 Şifre</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070C0] outline-none text-black transition-all bg-gray-50/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-between text-sm font-semibold">
            <Link href="/forgot-password" title="Şifremi Unuttum" className="text-[#0070C0] hover:underline">
              Şifremi Unuttum
            </Link>
            <Link href="/resend-verification" className="text-[#0070C0] hover:underline">
              Doğrulama Maili
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0070C0] text-white py-3.5 rounded-xl font-bold hover:bg-[#005da0] transition-all shadow-lg text-lg disabled:opacity-50"
          >
            {loading ? "⏳ Giriş Yapılıyor..." : "✅ Giriş Yap"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            Henüz bir hesabınız yok mu? <br/>
            <Link href="/register" className="text-[#0070C0] font-bold hover:underline">Kayıt Olun →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}