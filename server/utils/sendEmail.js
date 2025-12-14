const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  // START WITH MAILTRAP / GENERIC SMTP CONFIG
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
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
