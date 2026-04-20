using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SustainES_Backend.Data;   // AppDbContext için
using SustainES_Backend.Models; // Product ve Category modelleri için

namespace SustainES_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        private string? GetCurrentRole()
        {
            if (Request.Headers.TryGetValue("X-User-Role", out var roleHeader))
            {
                return roleHeader.ToString();
            }
            return null;
        }

        private bool IsAdmin() => string.Equals(GetCurrentRole(), "Admin", StringComparison.OrdinalIgnoreCase);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.Include(p => p.Category).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (!IsAdmin())
                return StatusCode(403, "Sadece yönetici ürün ekleyebilir.");

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (!IsAdmin())
                return StatusCode(403, "Sadece yönetici ürünü güncelleyebilir.");

            if (id != product.Id) return BadRequest();
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (!IsAdmin())
                return StatusCode(403, "Sadece yönetici ürünü silebilir.");

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}