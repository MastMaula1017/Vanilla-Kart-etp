const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  // START WITH MAILTRAP / GENERIC SMTP CONFIG
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Support Team" <noreply@example.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional: if we want to send HTML emails later
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
