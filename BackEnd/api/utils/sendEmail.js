require("dotenv").config();
const nodemailer = require("nodemailer");

// Looking to send emails in production? Check out our Email API/SMTP product!
// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  return transport.sendMail(mailOptions);
};

module.exports = sendEmail;
