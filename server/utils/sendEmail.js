const { Resend } = require('resend');

const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'support@mail.vanshraturi.me',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html, // Optional
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);
  } catch (err) {
    console.error("Send Email Wrapper Error:", err);
    throw err;
  }
};

module.exports = sendEmail;
