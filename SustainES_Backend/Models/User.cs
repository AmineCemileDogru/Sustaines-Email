namespace SustainES_Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public virtual Role? Role { get; set; }
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        
        // E-posta doğrulama alanları
        public string VerificationToken { get; set; } = string.Empty;
        public bool IsEmailVerified { get; set; } = false;
        public DateTime? VerificationTokenExpira { get; set; }

        public string ResetPasswordToken { get; set; } = string.Empty;
        public DateTime? ResetPasswordTokenExpira { get; set; }
    }
}