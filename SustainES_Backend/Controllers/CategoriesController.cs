using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SustainES_Backend.Data;
using SustainES_Backend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SustainES_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // Kullanıcının rolünü hem Header'dan hem de Token'dan kontrol eden yardımcı metod
        private string? GetCurrentRole()
        {
            // 1. Manuel Header Kontrolü (Frontend'den X-User-Role gönderiliyorsa)
            if (Request.Headers.TryGetValue("X-User-Role", out var roleHeader))
            {
                return roleHeader.ToString().Trim();
            }

            // 2. JWT Token Kontrolü
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader)) return null;

            try 
            {
                var token = authHeader.Replace("Bearer ", "").Trim();
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);
                
                // Role bilgisini "role" veya standart ClaimTypes üzerinden ara
                var roleClaim = jwtToken.Claims.FirstOrDefault(c => 
                    c.Type == ClaimTypes.Role || c.Type == "role");
                
                return roleClaim?.Value;
            }
            catch { return null; }
        }

        // Admin mi değil mi kontrolü
        private bool IsAdmin() => string.Equals(GetCurrentRole(), "Admin", StringComparison.OrdinalIgnoreCase);

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetCategories()
        {
            // JSON döngü hatasını (Object Cycle) önlemek için Ürünleri dahil etmeden 
            // sadece gerekli alanları anonim nesne olarak dönüyoruz.
            var categories = await _context.Categories
                .Select(c => new {
                    id = c.Id,
                    categoryName = c.CategoryName
                })
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound("Kategori bulunamadı.");
            return Ok(category);
        }

        // POST: api/Categories
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Category>> PostCategory([FromBody] Category category)
        {
            if (string.IsNullOrEmpty(category.CategoryName)) 
                return BadRequest("Kategori adı boş olamaz.");

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutCategory(int id, [FromBody] Category category)
        {
            var existingCategory = await _context.Categories.FindAsync(id);
            if (existingCategory == null) return NotFound("Kategori bulunamadı.");

            // Sadece ismi güncelliyoruz
            existingCategory.CategoryName = category.CategoryName;
            
            _context.Entry(existingCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Categories.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound("Silinecek kategori bulunamadı.");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}