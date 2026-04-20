'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await api.post('/Auth/request-password-reset', { email: email.trim() });
      if (response.status === 200) {
        setStatus('success');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="mb-8">
          <div className="text-4xl mb-4">🔑</div>
          <h1 className="text-2xl font-bold text-[#046DAE] mb-2">Şifre Sıfırlama</h1>
          <p className="text-gray-600">Kayıtlı e-posta adresinizi girin. Size bir sıfırlama bağlantısı göndereceğiz.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta Adresiniz</label>
            <input
              type="email"
              required
              placeholder="e-posta@adresiniz.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0070C0] outline-none text-black transition-all bg-gray-50/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'sending'}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0070C0] text-white py-3.5 rounded-xl font-bold hover:bg-[#005da0] transition-all shadow-lg shadow-blue-100 text-lg disabled:opacity-50"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? '⏳ Gönderiliyor...' : '📧 Bağlantı Gönder'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4 text-green-800 text-sm font-semibold">
            ✅ Sıfırlama bağlantısı gönderildi! E-postanızı kontrol edin. 3 saniye içinde giriş sayfasına yönlendirileceksiniz.
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm font-semibold">
            ❌ Bir hata oluştu. Lütfen tekrar deneyin veya e-posta adresinizi kontrol edin.
          </div>
        )}

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            <Link href="/login" className="text-[#0070C0] font-semibold hover:text-[#005da0]">
              ← Giriş Sayfasına Dön
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Hesabınız yok mu? {' '}
            <Link href="/register" className="text-[#0070C0] font-semibold hover:text-[#005da0]">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
