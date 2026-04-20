namespace SustainES_Backend.Models
{
    public class UserLogin
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User? User { get; set; }
        public string IPAddress { get; set; } = string.Empty;
        public DateTime LoginDate { get; set; } = DateTime.Now;
    }
}