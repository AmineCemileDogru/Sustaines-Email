using System.Text.Json.Serialization;

namespace SustainES_Backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public virtual User? User { get; set; }

        public int ProductId { get; set; }
        public virtual Product? Product { get; set; }
        public int Quantity { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
    }
}