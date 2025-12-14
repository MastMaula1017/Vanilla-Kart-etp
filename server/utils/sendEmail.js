const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  // Resend SMTP Configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
    logger: true,
    debug: true
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER, // Use custom name or default to user email
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional: if we want to send HTML emails later
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
