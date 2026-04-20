using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SustainES_Backend.Data;
using SustainES_Backend.Models;

namespace SustainES_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
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

        private int? GetCurrentUserId()
        {
            if (Request.Headers.TryGetValue("X-User-Id", out var idHeader) && int.TryParse(idHeader.ToString(), out var id))
            {
                return id;
            }
            return null;
        }

        private bool IsAdmin() => string.Equals(GetCurrentRole(), "Admin", StringComparison.OrdinalIgnoreCase);

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            if (!IsAdmin())
                return StatusCode(403, "Sadece yönetici tüm kullanıcıları görüntüleyebilir.");

            var users = await _context.Users.Include(u => u.Role).ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var currentUserId = GetCurrentUserId();
            if (!IsAdmin() && currentUserId != id)
                return StatusCode(403, "Sadece kendi profilinizi görüntüleyebilirsiniz.");

            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            if (!IsAdmin())
                return StatusCode(403, "Sadece yönetici kullanıcı ekleyebilir.");

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("Bu e-posta adresi zaten kullanılıyor.");

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == request.RoleName);
            if (role == null)
                return BadRequest("Geçersiz rol seçildi.");

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password,
                RoleId = role.Id,
                IsEmailVerified = true,
                VerificationToken = string.Empty,
                ResetPasswordToken = string.Empty
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            var currentUserId = GetCurrentUserId();
            if (!IsAdmin() && currentUserId != id)
                return StatusCode(403, "Sadece kendi profilinizi güncelleyebilirsiniz.");

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            user.FullName = request.FullName ?? user.FullName;
            user.Email = request.Email ?? user.Email;
            if (!string.IsNullOrWhiteSpace(request.Password))
                user.Password = request.Password;

            if (IsAdmin() && request.RoleName != null)
            {
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == request.RoleName);
                if (role != null)
                    user.RoleId = role.Id;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!IsAdmin())
                return StatusCode(403, "Sadece yönetici kullanıcı silebilir.");

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class CreateUserRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string RoleName { get; set; } = "User";
    }

    public class UpdateUserRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? RoleName { get; set; }
    }
}
