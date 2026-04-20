using Microsoft.EntityFrameworkCore;
using SustainES_Backend.Models;


namespace SustainES_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Tablolarımızı buraya tanımlıyoruz
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserLogin> UserLogins { get; set; }
        public DbSet<Order> Orders { get; set; }
    }
}