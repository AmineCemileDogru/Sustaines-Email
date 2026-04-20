'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function VerifyEmailPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tokenParam = searchParams.get('token');
        setToken(tokenParam);

        if (tokenParam) {
            api.get(`/auth/verify?token=${tokenParam}`)
                .then(() => {
                    setStatus('success');
                    setTimeout(() => router.push('/login'), 3000);
                })
                .catch(() => setStatus('error'));
        } else {
            setStatus('error');
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 text-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="mb-8">
                    <div className="text-5xl mb-4">
                        {status === 'loading' && '🔍'}
                        {status === 'success' && '✅'}
                        {status === 'error' && '❌'}
                    </div>
                    <h2 className="text-2xl font-bold text-[#046DAE]">E-posta Doğrulama</h2>
                </div>
                
                {status === 'loading' && (
                    <div className="space-y-4">
                        <p className="text-gray-700 font-semibold">Hesabınız doğrulanıyor, lütfen bekleyin...</p>
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070C0]"></div>
                        </div>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="space-y-4">
                        <p className="text-green-700 font-bold text-lg">Tebrikler! Hesabınız başarıyla doğrulandı.</p>
                        <p className="text-gray-600">Giriş sayfasına yönlendiriliyorsunuz...</p>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="space-y-6">
                        <p className="text-red-700 font-bold">Doğrulama başarısız oldu.</p>
                        <p className="text-gray-600 text-sm">Link hatalı veya süresi dolmuş olabilir.</p>
                        <div className="flex flex-col gap-3">
                            <Link 
                                href="/resend-verification" 
                                className="block bg-[#0070C0] text-white py-3 rounded-xl font-semibold hover:bg-[#005da0] transition-all"
                            >
                                E-posta Yeniden Gönder
                            </Link>
                            <Link 
                                href="/register" 
                                className="block text-[#0070C0] font-semibold hover:text-[#005da0]"
                            >
                                Tekrar Kayıt Ol
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
