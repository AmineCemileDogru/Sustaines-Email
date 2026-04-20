using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SustainES_Backend.Data;
using SustainES_Backend.Models;
using SustainES_Backend.Services;

namespace SustainES_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public AuthController(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        private static string NormalizeEmail(string email)
        {
            return string.IsNullOrWhiteSpace(email) ? string.Empty : email.Trim().ToLowerInvariant();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // 1. E-posta kontrolü
            var normalizedEmail = NormalizeEmail(request.Email);
            var emailExists = await _context.Users.AnyAsync(u => u.Email == normalizedEmail);
            if (emailExists)
            {
                return BadRequest("Bu e-posta adresi zaten kayıtlı.");
            }

            try 
            {
                // 2. Doğrulama token'ı oluşturma
                string verificationToken = Guid.NewGuid().ToString();
                
                // 3. Yeni kullanıcıyı manuel oluşturma
                var newUser = new User
                {
                    FullName = request.FullName.Trim(),
                    Email = normalizedEmail,
                    Password = request.Password,
                    RoleId = 1, // Varsayılan "User" rolü
                    VerificationToken = verificationToken,
                    IsEmailVerified = false,
                    VerificationTokenExpira = DateTime.UtcNow.AddHours(24) // Token 24 saat geçerlı
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                bool emailSent = false;
                string emailError = string.Empty;

                // 4. Doğrulama e-postasını gönder
                try
                {
                    string frontendUrl = "http://localhost:3000"; // Frontend URL'ini ayarla
                    string verificationLink = $"{frontendUrl}/verify-email?token={verificationToken}";
                    string htmlContent = _emailService.GetEmailTemplate("verify-email.html", newUser.FullName, verificationLink);
                    
                    await _emailService.SendEmailAsync(newUser.Email, "SustainES - E-postanızı Doğrulayın", htmlContent);
                    emailSent = true;
                }
                catch (Exception emailEx)
                {
                    // Email gönderilemese bile, kullanıcı kaydı başarısız olmasın
                    emailError = emailEx.Message;
                    Console.WriteLine($"Email gönderilemedi, ancak kayıt tamamlandı. Token: {verificationToken}. Hata: {emailEx.Message}");
                }
                
                return Ok(new { message = "Kayıt başarıyla oluşturuldu! Lütfen e-postanızı doğrulayın.", emailSent, emailError });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Bir hata oluştu: " + ex.Message);
            }
        }

        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequest request)
        {
            var normalizedEmail = NormalizeEmail(request.Email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
            if (user == null)
                return NotFound(new { message = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı." });

            if (user.IsEmailVerified)
                return Ok(new { message = "E-posta zaten doğrulanmış." });

            string verificationToken = Guid.NewGuid().ToString();
            user.VerificationToken = verificationToken;
            user.VerificationTokenExpira = DateTime.UtcNow.AddHours(24);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            bool emailSent = false;
            string emailError = string.Empty;

            try
            {
                string frontendUrl = "http://localhost:3000";
                string verificationLink = $"{frontendUrl}/verify-email?token={verificationToken}";
                string htmlContent = _emailService.GetEmailTemplate("verify-email.html", user.FullName, verificationLink);
                await _emailService.SendEmailAsync(user.Email, "SustainES - E-postanızı Doğrulayın", htmlContent);
                emailSent = true;
            }
            catch (Exception ex)
            {
                emailError = ex.Message;
                Console.WriteLine($"Verification email resend failed: {ex.Message}");
            }

            return Ok(new { message = "Doğrulama e-postası yeniden gönderildi.", emailSent, emailError });
        }

        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequest request)
        {
            var normalizedEmail = NormalizeEmail(request.Email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
            if (user == null)
                return Ok(new { message = "Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi." });

            string resetToken = Guid.NewGuid().ToString();
            user.ResetPasswordToken = resetToken;
            user.ResetPasswordTokenExpira = DateTime.UtcNow.AddHours(1);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            bool emailSent = false;
            string emailError = string.Empty;
            
            try
            {
                string frontendUrl = "http://localhost:3000";
                string resetLink = $"{frontendUrl}/reset-password?token={resetToken}";
                string htmlContent = _emailService.GetEmailTemplate("reset-password.html", user.FullName, resetLink);
                await _emailService.SendEmailAsync(user.Email, "SustainES - Şifre Sıfırlama", htmlContent);
                emailSent = true;
            }
            catch (Exception ex)
            {
                emailError = ex.Message;
                Console.WriteLine($"Password reset email send failed: {ex.Message}");
            }

            return Ok(new { message = "Eğer kayıtlı bir hesap varsa, şifre sıfırlama e-postası gönderildi.", emailSent, emailError });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordChangeRequest request)
        {
            if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.NewPassword))
                return BadRequest(new { message = "Token ve yeni şifre gereklidir." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.ResetPasswordToken == request.Token);
            if (user == null)
                return NotFound(new { message = "Geçersiz veya süresi dolmuş token." });

            if (user.ResetPasswordTokenExpira < DateTime.UtcNow)
                return BadRequest(new { message = "Token süresi dolmuş." });

            user.Password = request.NewPassword;
            user.ResetPasswordToken = string.Empty;
            user.ResetPasswordTokenExpira = null;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Şifreniz başarıyla yenilendi." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            var normalizedEmail = NormalizeEmail(request.Email);
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == normalizedEmail && u.Password == request.Password);

            if (user == null)
                return Unauthorized(new { message = "E-posta veya şifre hatalı!" });

            if (!user.IsEmailVerified)
                return Unauthorized(new { message = "Lütfen önce e-postanızı doğrulayın!" });

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            _context.UserLogins.Add(new UserLogin
            {
                UserId = user.Id,
                IPAddress = ipAddress,
                LoginDate = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Giriş başarılı",
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role?.RoleName ?? "User",
                isEmailVerified = user.IsEmailVerified
            });
        }

        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token gerekli!" });

            // Token'a ait kullanıcıyı bul
            var user = await _context.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);

            if (user == null)
                return NotFound(new { message = "Geçersiz token!" });

            // Token süresi dolmuş mı kontrol et
            if (user.VerificationTokenExpira < DateTime.UtcNow)
                return BadRequest(new { message = "Token süresi dolmuş!" });

            // Kullanıcıyı doğrula
            user.IsEmailVerified = true;
            user.VerificationToken = string.Empty;
            user.VerificationTokenExpira = null;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "E-posta başarıyla doğrulandı! Giriş yapabilirsiniz." });
        }

        // Endpoint para testes - retorna o token de verificação de um usuário
        [HttpGet("test/gettoken/{email}")]
        public async Task<IActionResult> GetVerificationToken(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            if (user == null)
                return NotFound(new { message = "Usuário não encontrado!" });

            return Ok(new { email = user.Email, verificationToken = user.VerificationToken, isVerified = user.IsEmailVerified });
        }

        // Endpoint para testes - marcar email como verificado diretamente
        [HttpPost("verify-email/{email}")]
        public async Task<IActionResult> VerifyEmailByAddress(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            if (user == null)
                return NotFound(new { message = "Usuário não encontrado." });
            
            user.IsEmailVerified = true;
            user.VerificationToken = string.Empty;
            user.VerificationTokenExpira = null;
            
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = $"E-mail {email} foi verificado com sucesso!" });
        }
    }

    // --- DTO (Data Transfer Objects) ---
    
    public class RegisterRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserLoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ResendVerificationRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class PasswordResetRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class PasswordChangeRequest
    {
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}