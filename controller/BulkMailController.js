const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}: ${error.message}`);
  }
}

async function sendBulkEmails(req, res) {
  try {
    const { emails, subject, html } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Emails array is required and must not be empty'
      });
    }

    if (!subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Subject and HTML content are required'
      });
    }

    emails.forEach((email, index) => {
      setTimeout(() => {
        sendEmail(email, subject, html);
      }, index * 10000); // 10 seconds interval
    });

    console.log(`🚀 Bulk email job scheduled. All emails spaced 10 seconds apart.`);

    return res.status(200).json({
      success: true,
      message: `Bulk email job started. All emails scheduled 10 seconds apart.`,
      totalEmails: emails.length
    });

  } catch (error) {
    console.error('❌ Bulk email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to start bulk email job',
      error: error.message
    });
  }
}

module.exports = { sendBulkEmails };
