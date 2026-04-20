'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setMessage('');

    try {
      const response = await api.post('/Auth/resend-verification', { email: email.trim() });
      if (response.status === 200) {
        setStatus('success');
        setMessage('✅ Doğrulama e-postası gönderildi! Lütfen gelen kutunuzu ve spam klasörünü kontrol edin.');
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (error: any) {
      setStatus('error');
      setMessage('❌ ' + (error.response?.data?.message || 'Doğrulama e-postası gönderilirken bir sorun oluştu.'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="mb-8">
          <div className="text-4xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-[#046DAE] mb-2">Doğrulama E-postası</h1>
          <p className="text-gray-600">E-posta adresinizi girin. Doğrulama bağlantısını tekrar göndereceğiz.</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-semibold ${
            status === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta Adresi</label>
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
              {status === 'sending' ? '⏳ Gönderiliyor...' : '📨 Yeniden Gönder'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            <Link href="/login" className="text-[#0070C0] font-semibold hover:text-[#005da0]">
              ← Giriş Sayfasına Dön
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Henüz kayıt olmadınız mı? {' '}
            <Link href="/register" className="text-[#0070C0] font-semibold hover:text-[#005da0]">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
