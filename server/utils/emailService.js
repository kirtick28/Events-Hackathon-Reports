const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #fff8e1; padding: 30px; border-radius: 10px; border: 1px solid #ffe082;">
        <div style="text-align: center;">
          <h2 style="color: #f9a825;">Password Reset Request</h2>
          <p style="color: #555;">Hi there,</p>
          <p style="color: #555;">We received a request to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 25px; background-color: #fbc02d; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            Reset Password
          </a>
          <p style="color: #999; margin-top: 30px;">This link is valid for 1 hour.</p>
          <p style="color: #999;">If you didn’t request this, please ignore this email.</p>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ffecb3;">
        <div style="text-align: center; color: #ccc; font-size: 12px;">
          <p>© 2025 Your Company Name</p>
          <p>This is an automated message. Please do not reply.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
