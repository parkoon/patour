const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Active in gmail 'less secure app' option
  });

  console.log({
    service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Active in gmail 'less secure app' option
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'parkoon <hello@parkoon.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  console.log(mailOptions);
  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
