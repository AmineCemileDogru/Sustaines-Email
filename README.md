# 🚀 SustainES Email & Management System

> **Staj Projesi - Full-Stack E-Ticaret Yönetim Sistemi**

Bu proje, sürdürülebilirlik odaklı bir işletme için geliştirilmiş, modern ve güvenli bir **Full-Stack E-Ticaret Yönetim Sistemi** ve **E-posta Otomasyon Sistemi**'dir. Kullanıcılar ürünleri, kategorileri ve siparişleri şık bir dashboard üzerinden yönetebilirken, sistem aynı zamanda email doğrulama, şifre sıfırlama ve bildirim gönderme özelliklerini de içerir.

## 📋 Proje Genel Bakış

### 🎯 Proje Amacı
- Sürdürülebilir ürünler satan bir e-ticaret işletmesi için kapsamlı yönetim sistemi
- Güvenli kullanıcı yetkilendirme ve rol yönetimi
- Otomatik e-posta bildirimleri ve doğrulama sistemi
- Modern, responsive ve kullanıcı dostu arayüz
- Gerçek zamanlı analitik ve raporlama

### 🏗️ Mimari Yapı
Proje **Microservices** yaklaşımıyla geliştirilmiş olup üç ana bileşenden oluşmaktadır:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend     │    │   Database      │
│   (Next.js)     │◄──►│   (.NET Core)   │◄──►│   (SQL Server)  │
│                 │    │                 │    │                 │
│ - React 19      │    │ - ASP.NET Core  │    │ - Entity        │
│ - TypeScript    │    │ - EF Core       │    │   Framework     │
│ - Tailwind CSS  │    │ - JWT Auth      │    │ - Migrations    │
│ - Axios         │    │ - BCrypt        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📂 Proje Yapısı

```
SustainES-Emails/
├── 📁 sustaines-frontend/          # Next.js Frontend Uygulaması
│   ├── 📁 app/                     # Next.js 13+ App Router
│   ├── 📁 components/              # React Bileşenleri
│   ├── 📁 lib/                     # Yardımcı Fonksiyonlar
│   ├── 📁 public/                  # Statik Dosyalar
│   └── 📄 package.json             # Node.js Bağımlılıkları
│
├── 📁 SustainES_Backend/           # .NET Core Web API
│   ├── 📁 Controllers/             # API Controller'ları
│   ├── 📁 Models/                  # Entity Modelleri
│   ├── 📁 Services/                # İş Mantığı Servisleri
│   ├── 📁 Data/                    # Veritabanı Bağlamı
│   └── 📁 Properties/              # Uygulama Ayarları
│
├── 📁 database/                    # Veritabanı Dosyaları
│   └── 📄 sustaines_backup.sql     # SQL Server Backup
│
├── 📁 Resources/                   # E-posta Şablonları
│   └── 📁 EmailTemplates/          # HTML E-posta Şablonları
│
└── 📄 README.md                    # Bu Dokümantasyon
```

## 🛡️ Güvenlik Özellikleri

### 🔐 Şifre Güvenliği
- **BCrypt Hashing**: Tüm şifreler BCrypt algoritması ile güvenli bir şekilde hash'lenir
- **Salt Generation**: Her şifre için benzersiz salt değeri oluşturulur
- **Timing Attack Protection**: Şifre doğrulama süresi sabitlenir

```csharp
// PasswordHasher.cs - Güvenli Şifre Hash'leme
public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}
```

### 🔑 JWT Yetkilendirme
- **Token-based Authentication**: Güvenli JWT token'ları
- **Role-based Access Control**: Admin/User rol yönetimi
- **Token Expiration**: Otomatik token süresi dolma

### 📧 E-posta Güvenliği
- **SMTP Encryption**: TLS/SSL şifreli e-posta gönderimi
- **Email Verification**: Kayıt sonrası e-posta doğrulama
- **Password Reset**: Güvenli şifre sıfırlama bağlantıları

## 🛠️ Kullanılan Teknolojiler

### Backend (.NET Core)
- **Framework**: ASP.NET Core 8.0 / .NET 10.0
- **ORM**: Entity Framework Core 8.0
- **Database**: SQL Server 2022
- **Authentication**: JWT Bearer Tokens
- **Password Hashing**: BCrypt.Net-Next 4.0.3
- **Email Service**: MailKit 4.15.1
- **Documentation**: Swagger/OpenAPI

### Frontend (Next.js)
- **Framework**: Next.js 16.2.3
- **React**: React 19.2.4
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios 1.7.9
- **State Management**: React Hooks
- **Build Tool**: Turbopack

### Development Tools
- **IDE**: Visual Studio 2022 / VS Code
- **Version Control**: Git & GitHub
- **API Testing**: Postman / Swagger UI
- **Database Management**: SQL Server Management Studio

## 🚀 Kurulum ve Çalıştırma

### 📋 Ön Gereksinimler
- **.NET SDK**: 8.0 veya üzeri
- **Node.js**: 18.0 veya üzeri
- **SQL Server**: 2019 veya üzeri
- **Git**: 2.0 veya üzeri

### 1. 📥 Projeyi İndirme
```bash
git clone https://github.com/AmineCemileDogru/SustainES-Email-Management-System.git
cd SustainES-Emails
```

### 2. 🗄️ Veritabanı Kurulumu
```sql
-- SQL Server Management Studio'da çalıştırın
-- database/sustaines_backup.sql dosyasını restore edin
RESTORE DATABASE SustainES_Db
FROM DISK = 'C:\path\to\sustaines_backup.sql'
WITH MOVE 'SustainES_Db' TO 'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\SustainES_Db.mdf',
     MOVE 'SustainES_Db_log' TO 'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\SustainES_Db_log.ldf'
```

### 3. ⚙️ Backend Yapılandırması
```bash
cd SustainES_Backend

# appsettings.json dosyasını düzenleyin
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=SustainES_Db;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "your-email@gmail.com",
    "SenderPassword": "your-app-password"
  }
}

# Projeyi çalıştırın
dotnet run
```
**Backend URL**: http://localhost:5119

### 4. 🎨 Frontend Kurulumu
```bash
cd sustaines-frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```
**Frontend URL**: http://localhost:3000

### 5. 🔍 API Dokümantasyonu
Backend çalışırken Swagger UI'a erişin:
**Swagger URL**: http://localhost:5119/swagger

## 📊 API Endpoints

### 🔐 Authentication Endpoints
```http
POST /api/Auth/register          # Kullanıcı kaydı
POST /api/Auth/login             # Kullanıcı girişi
POST /api/Auth/resend-verification  # Doğrulama e-postası tekrar gönder
GET  /api/Auth/verify            # E-posta doğrulama
POST /api/Auth/request-password-reset  # Şifre sıfırlama isteği
POST /api/Auth/reset-password    # Şifre sıfırlama
```

### 📦 Product Management
```http
GET    /api/Products             # Ürünleri listele
GET    /api/Products/{id}        # Ürün detayı
POST   /api/Products             # Ürün ekle
PUT    /api/Products/{id}        # Ürün güncelle
DELETE /api/Products/{id}        # Ürün sil
```

### 🏷️ Category Management
```http
GET    /api/Categories           # Kategorileri listele
GET    /api/Categories/{id}      # Kategori detayı
POST   /api/Categories           # Kategori ekle
PUT    /api/Categories/{id}      # Kategori güncelle
DELETE /api/Categories/{id}      # Kategori sil
```

### 📈 Analytics
```http
GET /api/Analytics/dashboard     # Dashboard istatistikleri
GET /api/Analytics/sales         # Satış analizi
GET /api/Analytics/products      # Ürün performansı
```

### 👥 User Management (Admin Only)
```http
GET    /api/Users                # Kullanıcıları listele
GET    /api/Users/{id}           # Kullanıcı detayı
PUT    /api/Users/{id}           # Kullanıcı güncelle
DELETE /api/Users/{id}           # Kullanıcı sil
```

## 🗄️ Veritabanı Yapısı

### 📋 Tablolar

#### Users Tablosu
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    Password NVARCHAR(MAX) NOT NULL,  -- BCrypt hash'lenmiş
    RoleId INT NOT NULL,
    IsEmailVerified BIT DEFAULT 0,
    VerificationToken NVARCHAR(255),
    VerificationTokenExpira DATETIME2,
    ResetPasswordToken NVARCHAR(255),
    ResetPasswordTokenExpira DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);
```

#### Products Tablosu
```sql
CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18,2) NOT NULL,
    StockQuantity INT NOT NULL,
    CategoryId INT NOT NULL,
    ImageUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);
```

#### Orders Tablosu
```sql
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT NOT NULL,
    OrderDate DATETIME2 DEFAULT GETDATE(),
    TotalAmount DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Pending',
    ShippingAddress NVARCHAR(MAX),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

### 🔑 Default Admin Hesabı
- **Email**: admin@sustaines.com
- **Şifre**: admin123
- **Rol**: Admin
- **Durum**: E-posta doğrulanmış

## 🎨 Frontend Bileşenleri

### 📱 Ana Sayfalar
- `/` - Ana Sayfa / Dashboard
- `/login` - Giriş Sayfası
- `/register` - Kayıt Sayfası
- `/dashboard` - Yönetim Paneli
- `/products` - Ürün Yönetimi
- `/categories` - Kategori Yönetimi
- `/orders` - Sipariş Yönetimi
- `/users` - Kullanıcı Yönetimi (Admin)
- `/profile` - Profil Yönetimi

### 🧩 Temel Bileşenler
```typescript
// AuthContext - Global authentication state
// ApiService - HTTP istekleri için axios wrapper
// DashboardCharts - Grafik bileşenleri
// DataTable - Listeleme tabloları
// Modal - Form modalları
// Notification - Toast bildirimleri
```

## 🔧 Yapılandırma Dosyaları

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=SustainES_Db;Trusted_Connection=True;"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "noreply@sustaines.com",
    "SenderPassword": "app-specific-password"
  },
  "JwtSettings": {
    "SecretKey": "your-256-bit-secret-key",
    "Issuer": "SustainES",
    "Audience": "SustainES-Users",
    "ExpiryInMinutes": 60
  }
}
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5119/api
NEXT_PUBLIC_APP_NAME=SustainES
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd sustaines-frontend
npm run build
npm start

# Backend
cd SustainES_Backend
dotnet publish -c Release
dotnet SustainES_Backend.dll
```

### Docker Deployment (Opsiyonel)
```dockerfile
# Dockerfile örneği
FROM mcr.microsoft.com/dotnet/aspnet:8.0
COPY . /app
WORKDIR /app
EXPOSE 80
ENTRYPOINT ["dotnet", "SustainES_Backend.dll"]
```

## 📈 Özellikler ve Yetenekler

### ✅ Tamamlanan Özellikler
- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ JWT tabanlı yetkilendirme
- ✅ BCrypt şifre hash'leme
- ✅ E-posta doğrulama sistemi
- ✅ Şifre sıfırlama
- ✅ Ürün, kategori ve sipariş yönetimi
- ✅ Admin dashboard
- ✅ Responsive tasarım
- ✅ API dokümantasyonu

### 🔄 Geliştirme Aşamasında
- 🔄 Gelişmiş analitik raporları
- 🔄 Çoklu dil desteği
- 🔄 Push notification sistemi
- 🔄 İleri düzey arama ve filtreleme

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

**Geliştirici**: Amine Cemile Doğru
**E-posta**: amine@example.com
**GitHub**: https://github.com/AmineCemileDogru

## 📜 Lisans

Bu proje eğitim amaçlı geliştirilmiştir ve MIT lisansı altında yayınlanmıştır.

---

⭐ **Bu proje staj çalışmaları kapsamında geliştirilmiştir.**
Frontend: Next.js 14, React, Tailwind CSS, Lucide Icons.

Backend: .NET 8 Web API, Entity Framework Core.

Database: MS SQL Server.

API Client: Axios.

👤 Hazırlayan
Amine Cemile Doğru - [GitHub Profilin](https://github.com/AmineCemileDogru)