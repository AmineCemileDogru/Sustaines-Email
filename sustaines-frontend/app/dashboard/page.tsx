"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getStoredUser, clearStoredUser, isAdmin } from "@/lib/auth";

// --- GRAFİK BİLEŞENLERİ ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Interface tanımları aynı kalıyor...
interface AnalyticsData {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  lastMonthOrders: number;
  lastYearOrders: number;
}

interface MostOrderedProduct {
  productName: string;
  totalQuantity: number;
  totalRevenue?: number; // Fiyat verisi geliyorsa ekleyelim
}

interface OrderByYear {
  year: number;
  month: number;
  count: number;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [mostOrdered, setMostOrdered] = useState<MostOrderedProduct[]>([]);
  const [leastOrdered, setLeastOrdered] = useState<MostOrderedProduct[]>([]);
  const [ordersByYear, setOrdersByYear] = useState<OrderByYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    fetchAnalytics();
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      const [statsRes, mostRes, leastRes, yearRes] = await Promise.all([
        api.get("/Analytics/stats"),
        api.get("/Analytics/most-ordered"),
        api.get("/Analytics/least-ordered"),
        api.get("/Analytics/orders-last-year")
      ]);

      setAnalytics(statsRes.data);
      setMostOrdered(mostRes.data);
      setLeastOrdered(leastRes.data);
      setOrdersByYear(yearRes.data);
    } catch (error) {
      console.error("Analytics yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- GRAFİK VERİLERİ HAZIRLAMA ---
  const lineChartData = {
    labels: ordersByYear.map(item => `${item.month}/${item.year}`),
    datasets: [
      {
        label: 'Sipariş Sayısı',
        data: ordersByYear.map(item => item.count),
        borderColor: '#0070C0',
        backgroundColor: 'rgba(0, 112, 192, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: mostOrdered.slice(0, 5).map(p => p.productName),
    datasets: [
      {
        data: mostOrdered.slice(0, 5).map(p => p.totalQuantity),
        backgroundColor: [
          '#0070C0',
          '#4F46E5',
          '#10B981',
          '#F59E0B',
          '#EF4444',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-[#0070C0] animate-pulse">Veriler Hazırlanıyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Kısmı Değişmedi */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://raw.githubusercontent.com/AmineCemileDogru/Sustaines-Email/main/Sustaines_Logosu.png" 
                alt="Logo" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold text-[#0070C0] hidden sm:block">Yönetim Paneli</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all font-semibold border border-red-100">
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Cards Değişmedi */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">🚀 Hızlı Erişim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Buradaki NavCard'lar aynı kalacak */}
             <NavCard title="Siparişler" desc="Yeni sipariş girin" icon="📦" onClick={() => router.push("/create-order")} />
             {isAdmin() && (
               <>
                 <NavCard title="Ürün Yönetimi" desc="Envanter kontrolü" icon="🏷️" onClick={() => router.push("/products")} />
                 <NavCard title="Kategoriler" desc="Grupları düzenleyin" icon="🗂️" onClick={() => router.push("/categories")} />
                 <NavCard title="Kullanıcılar" desc="Ekibi yönetin" icon="👥" onClick={() => router.push("/users")} />
               </>
             )}
          </div>
        </section>

        {/* Analytics Section - Geliştirildi */}
        {analytics && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-2xl font-extrabold text-gray-900">Performans Analizleri</h2>
              <span className="bg-blue-100 text-[#0070C0] text-xs font-bold px-3 py-1 rounded-full">CANLI VERİ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Toplam Sipariş" value={analytics.totalOrders} color="blue" />
              <StatCard title="Toplam Ürün" value={analytics.totalProducts} color="indigo" />
              <StatCard title="Toplam Kullanıcı" value={analytics.totalUsers} color="green" />
              <StatCard title="Aylık Performans" value={analytics.lastMonthOrders} suffix=" Yeni" color="orange" />
            </div>

            {/* GRAFİK ALANI */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Satış Trendi Çizgi Grafiği */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">📈 Satış Trendi (Aylık)</h3>
                <div className="h-[300px] flex items-center justify-center">
                  <Line data={lineChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
              </div>

              {/* Ürün Dağılım Çarkı */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">🎡 En Çok Satan 5 Ürün (Oran)</h3>
                <div className="h-[300px] flex items-center justify-center">
                  <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataBox title="🔥 En Popüler Ürünler" data={mostOrdered} type="most" />
                <DataBox title="⚠️ İlgi Görmeyen Ürünler" data={leastOrdered} type="least" />
              </div>

              {/* Sağ Sütun: Bar Grafik */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">📊 Stok / Sipariş Analizi</h3>
                <div className="h-[400px]">
                   <Bar 
                    data={{
                      labels: ['Sipariş', 'Ürün', 'Kullanıcı'],
                      datasets: [{
                        label: 'Genel Durum',
                        data: [analytics.totalOrders, analytics.totalProducts, analytics.totalUsers],
                        backgroundColor: ['#0070C0', '#4F46E5', '#10B981']
                      }]
                    }} 
                    options={{ maintainAspectRatio: false }} 
                   />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// NavCard, StatCard ve DataBox bileşenleri aynı kalıyor...
function NavCard({ title, desc, icon, onClick }: { title: string, desc: string, icon: string, onClick: () => void }) {
    return (
      <button onClick={onClick} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-[#0070C0] hover:shadow-md transition-all text-left group">
        <span className="text-3xl mb-3 block">{icon}</span>
        <h3 className="font-bold text-gray-900 group-hover:text-[#0070C0]">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </button>
    );
  }
  
  function StatCard({ title, value, suffix = "", color }: { title: string, value: number, suffix?: string, color: string }) {
    const colors: any = {
      blue: "text-blue-600 bg-blue-50 border-blue-100",
      indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
      green: "text-green-600 bg-green-50 border-green-100",
      orange: "text-orange-600 bg-orange-50 border-orange-100",
    };
    return (
      <div className={`p-6 rounded-2xl border ${colors[color]} shadow-sm`}>
        <p className="text-sm font-bold opacity-80 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-black mt-1">{value}<span className="text-sm font-normal">{suffix}</span></p>
      </div>
    );
  }
  
  function DataBox({ title, data, type }: { title: string, data: any[], type: 'most' | 'least' }) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.slice(0, 5).map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
              <span className="text-sm font-semibold text-gray-700">{item.productName}</span>
              <span className={`text-xs font-black px-2 py-1 rounded-lg ${type === 'most' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                {item.totalQuantity} Adet
              </span>
            </div>
          ))}
          {data.length === 0 && <p className="text-sm text-gray-400 text-center py-4 italic">Veri bulunamadı</p>}
        </div>
      </div>
    );
  }