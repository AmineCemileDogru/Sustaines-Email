const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// E-posta gönderici ayarları (Gmail örneği)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sustaines.info@gmail.com', // Kendi mailin
        pass: 'your-app-password'        // Google App Password
    }
});

/**
 * @param {string} to - Alıcı adresi
 * @param {string} type - 'verify' veya 'reset'
 * @param {string} dynamicLink - Butona tıklayınca gidilecek link
 */
const sendSustainESEmail = async (to, type, dynamicLink) => {
    try {
        // 1. Dosya adını belirle
        const fileName = type === 'verify' ? 'verify-email.html' : 'reset-password.html';
        const filePath = path.join(__dirname, 'Resources', 'EmailTemplates', fileName);
        
        // 2. HTML dosyasını oku
        let htmlContent = fs.readFileSync(filePath, 'utf8');

        // 3. Değişkenleri (Placeholder) doldur
        const subject = type === 'verify' ? 'E-postanızı Doğrulayın' : 'Şifre Sıfırlama';
        const linkPlaceholder = type === 'verify' ? '{verificationLink}' : '{resetLink}';
        
        htmlContent = htmlContent.replace(linkPlaceholder, dynamicLink);
        htmlContent = htmlContent.replace('{DateTime.UtcNow.Year}', new Date().getFullYear());

        // 4. Gönder
        const mailOptions = {
            from: '"SustainES" <sustaines.info@gmail.com>',
            to: to,
            subject: subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('E-posta başarıyla gönderildi: ' + info.response);
        return { success: true };

    } catch (error) {
        console.error('E-posta gönderim hatası:', error);
        return { success: false, error };
    }
};

module.exports = sendSustainESEmail;