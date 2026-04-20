import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            // Backend portunu kendi ayarına göre (5119 gibi) güncellemeyi unutma!
            axios.get(`http://localhost:5119/api/auth/verify?token=${token}`)
                .then(() => setStatus('success'))
                .catch(() => setStatus('error'));
        }
    }, [token]);

    const styles = {
        container: { textAlign: 'center', marginTop: '100px', fontFamily: '"Segoe UI", sans-serif' },
        card: { maxWidth: '400px', margin: '0 auto', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
        title: { color: '#046DAE' },
        button: { marginTop: '20px', padding: '10px 20px', backgroundColor: '#046DAE', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>E-posta Doğrulama</h2>
                
                {status === 'loading' && <p>🔍 Hesabınız doğrulanıyor, lütfen bekleyin...</p>}
                
                {status === 'success' && (
                    <>
                        <p style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Tebrikler! Hesabınız başarıyla doğrulandı.</p>
                        <button style={styles.button} onClick={() => navigate('/login')}>Giriş Yap</button>
                    </>
                )}
                
                {status === 'error' && (
                    <p style={{ color: '#dc3545' }}>❌ Doğrulama başarısız. Link hatalı veya süresi dolmuş.</p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;