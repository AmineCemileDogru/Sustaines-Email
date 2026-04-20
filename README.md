🚀 SustainES Email & Management System
Bu proje, sürdürülebilirlik odaklı bir işletme için geliştirilmiş, Full-Stack bir yönetim paneli ve e-posta sistemidir. Kullanıcılar ürünleri, kategorileri ve siparişleri şık bir dashboard üzerinden yönetebilir.

📂 Proje Yapısı
Proje üç ana bölümden oluşmaktadır:

sustaines-frontend/: Next.js 14, Tailwind CSS ve Axios kullanılarak geliştirilen modern kullanıcı arayüzü.

sustaines-backend/: .NET Core Web API kullanılarak geliştirilen, veritabanı yönetimini ve yetkilendirmeyi sağlayan arka uç.

database/: Projenin çalışması için gerekli olan SQL Server veritabanı şemasını ve örnek verileri içeren .sql dosyası.

✨ Özellikler
📊 Dinamik Dashboard: Satış istatistikleri, ürün hedefleri ve görsel grafikler.

🏷️ Kategori & Ürün Yönetimi: Tam kapsamlı CRUD (Ekle, Listele, Güncelle, Sil) işlemleri.

👥 Kullanıcı Yetkilendirme: JWT tabanlı güvenli giriş ve Admin/User rol yönetimi.

📈 Analitik Veriler: En çok satan ürünler ve aylık sipariş trendleri.

🎨 Modern Tasarım: Şirket kimliğine uygun kurumsal renk paleti ve responsive (mobil uyumlu) yapı.

🛠️ Kurulum Notları
1. Veritabanı
SQL Server Management Studio'yu açın.

database/ klasöründeki .sql dosyasını çalıştırarak veritabanını ve tabloları oluşturun.

2. Backend (.NET API)
sustaines-backend/ klasörünü Visual Studio ile açın.

appsettings.json dosyasındaki ConnectionStrings bölümünü kendi yerel SQL Server bilgilerinizle güncelleyin.

Projeyi çalıştırın (Varsayılan: https://localhost:7xxx).

3. Frontend (Next.js)
sustaines-frontend/ klasörüne gidin.

Gerekli paketleri yükleyin:

Bash
npm install
Uygulamayı başlatın:

Bash
npm run dev
Tarayıcıda http://localhost:3001 adresine gidin.

🛠️ Kullanılan Teknolojiler
Frontend: Next.js 14, React, Tailwind CSS, Lucide Icons.

Backend: .NET 8 Web API, Entity Framework Core.

Database: MS SQL Server.

API Client: Axios.

👤 Hazırlayan
Amine Cemile Doğru - [GitHub Profilin](https://github.com/AmineCemileDogru)