'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function VerificationSentPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="mb-8">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-[#046DAE] mb-2">Doğrulama E-postası Gönderildi</h1>
        </div>
        
        <div className="space-y-4 mb-8">
          <p className="text-gray-700 font-semibold">
            {email
              ? `${email} adresine bir doğrulama maili gönderdik.`
              : 'Kayıtlı e-posta adresinize bir doğrulama maili gönderdik.'}
          </p>
          <p className="text-gray-600 text-sm">
            Lütfen gelen kutunuzu ve spam/junk klasörünü kontrol edin.
          </p>
          <p className="text-gray-600 text-sm">
            Bağlantı 24 saat geçerlidir.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href={email ? `/resend-verification?email=${encodeURIComponent(email)}` : '/resend-verification'}
            className="block bg-[#0070C0] text-white py-3.5 rounded-xl font-semibold hover:bg-[#005da0] transition-all"
          >
            📨 E-posta gelmedi? Yeniden Gönder
          </Link>
          <Link
            href="/login"
            className="block text-[#0070C0] font-semibold hover:text-[#005da0] py-2"
          >
            ← Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
