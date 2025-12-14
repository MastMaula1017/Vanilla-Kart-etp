const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  // Hardcoded Gmail config to avoid env var issues and force SSL
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Enhanced logging for debugging
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
