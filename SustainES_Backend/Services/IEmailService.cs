namespace SustainES_Backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
        // Parametre sayısını 3'e çıkardık (templateName, userName, link)
        string GetEmailTemplate(string templateName, string userName, string link = "");
    }
}