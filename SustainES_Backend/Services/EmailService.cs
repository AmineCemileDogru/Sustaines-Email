using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;

namespace SustainES_Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;
        private readonly IWebHostEnvironment _environment;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger, IWebHostEnvironment environment)
        {
            _logger = logger;
            _environment = environment;
            _settings = configuration.GetSection("EmailSettings").Get<EmailSettings>() ?? new EmailSettings();
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            if (string.IsNullOrEmpty(_settings.SmtpHost) || string.IsNullOrEmpty(_settings.User) || string.IsNullOrEmpty(_settings.Password) || string.IsNullOrEmpty(_settings.SenderEmail))
            {
                var msg = "Email settings are not configured properly. Please set EmailSettings in appsettings.json.";
                _logger.LogError(msg);
                throw new InvalidOperationException(msg);
            }

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = htmlMessage };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                _logger.LogInformation($"Connecting to SMTP host {_settings.SmtpHost}:{_settings.SmtpPort}");
                smtp.AuthenticationMechanisms.Remove("XOAUTH2");
                await smtp.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_settings.User, _settings.Password);
                await smtp.SendAsync(email);
                _logger.LogInformation($"E-posta başarıyla gönderildi: {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"E-posta gönderilirken hata oluştu: {ex.Message}");
                throw;
            }
            finally
            {
                if (smtp.IsConnected)
                {
                    await smtp.DisconnectAsync(true);
                }
            }
        }

        // HTML Şablonunu okuyan ve içindeki alanları dolduran metod
        public string GetEmailTemplate(string templateName, string userName, string link = "")
        {
            // Klasör yolunu belirleme
            string filePath = Path.Combine(_environment.ContentRootPath, "..", "Resources", "EmailTemplates", templateName);
            
            // Eğer dosya yerinde yoksa (veya yol yanlışsa) basit bir fallback mesajı döner
            if (!File.Exists(filePath)) 
            {
                return $"<h1>Merhaba {userName}</h1><p>SustainES'e hoş geldiniz! Doğrulama linkiniz: <a href='{link}'>Buraya Tıklayın</a></p>";
            }

            string template = File.ReadAllText(filePath);
            
            // ÖNEMLİ: Eğer link null gelirse butonun tıklanabilir kalması için boş bir string atıyoruz
            string safeLink = string.IsNullOrEmpty(link) ? "#" : link;
            
            // 1. Kullanıcı adını yerleştir (HTML'deki {{UserName}} ile eşleşir)
            template = template.Replace("{{UserName}}", userName);
            
            // 2. Buton linklerini yerleştir (HTML'deki {verificationLink} veya {resetLink} ile eşleşir)
            // Not: Replace metodunun her iki hali için de çalışması için ayrı ayrı yazıyoruz
            template = template.Replace("{verificationLink}", safeLink);
            template = template.Replace("{resetLink}", safeLink);
            
            // 3. Yıl bilgisini dinamik yapalım (İsteğe bağlı)
            template = template.Replace("{DateTime.UtcNow.Year}", DateTime.UtcNow.Year.ToString());
            
            return template;
        }
    }
}