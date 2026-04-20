using Microsoft.EntityFrameworkCore; 
using System.Text.Json.Serialization;
using SustainES_Backend.Data;         
using SustainES_Backend.Services; 

var builder = WebApplication.CreateBuilder(args);

// 1. CORS Politikası: Frontend'in her iki porta (3000 ve 3001) erişimine izin veriyoruz
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS",
        policy => policy.WithOrigins("http://localhost:3000", "http://localhost:3001") 
                        .AllowAnyMethod() 
                        .AllowAnyHeader());
});

// 2. Servis Kayıtları
builder.Services.AddScoped<IEmailService, EmailService>(); 

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed default roller ve admin
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Roles.Any())
    {
        db.Roles.AddRange(
            new SustainES_Backend.Models.Role { RoleName = "User" },
            new SustainES_Backend.Models.Role { RoleName = "Admin" }
        );
        db.SaveChanges();
    }

    if (!db.Users.Any(u => u.Email == "admin@sustaines.com"))
    {
        var adminRole = db.Roles.FirstOrDefault(r => r.RoleName == "Admin");
        if (adminRole != null)
        {
            db.Users.Add(new SustainES_Backend.Models.User
            {
                FullName = "SustainES Admin",
                Email = "admin@sustaines.com",
                Password = "Admin123!",
                RoleId = adminRole.Id,
                IsEmailVerified = true,
                VerificationToken = string.Empty,
                ResetPasswordToken = string.Empty
            });
            db.SaveChanges();
        }
    }
}

// 3. Middleware Sıralaması
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ÖNEMLİ: CORS her zaman Authorization'dan ÖNCE, MapControllers'dan ÖNCE gelmeli
app.UseCors("AllowNextJS");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();