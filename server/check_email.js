const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

(async function() {
  try {
    const data = await resend.emails.send({
      from: 'ConsultPro <support@mail.vanshraturi.me>',
      to: 'vanshraturi@gmail.com', // Using a safe test email, or we can use the user's email if widely known due to context, but 'test' is safer
      subject: 'Test Email from Debug Script',
      html: '<p>If you see this, Resend is working!</p>'
    });
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
})();
