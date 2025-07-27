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
    const { emails, subject, message } = req.body;

    const STATIC_HTML =`
    ${message}
    <div style="display: flex;">
      <img src="https://nyc.cloud.appwrite.io/v1/storage/buckets/68681a5a0000f82fcbdb/files/6886000b001127585c50/view?project=686815b8002cdbf9d18d&mode=admin" width="130" height="70" style="margin-right:10px;" />
      <div>
        <p style="margin:0px; margin-top:10px;">
          Address:
          <a href="https://maps.app.goo.gl/6hhBpRE75BUJRLDZA">
            F-4, First Floor, Latest Ceramic Zone, B/H Ishan Complex, 8-A National Highway, Lalpar, Morbi-363642, Gujarat, India
          </a>
        </p>
        <p style="margin:0px;">
          Contact:
          <a href="tel:+919327624243">
            +91 9327624243
          </a>
        </p>
        <p style="margin:0px;">
          Web:
          <a href="https://asios.in">
            www.asios.in
          </a>
        </p>
      </div>
    </div>
    </div>
        </div>\n</div>`;


    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Emails array is required and must not be empty'
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject or message is required'
      });   
    }

    // 2. Use STATIC_HTML instead of html from req.body
    emails.forEach((email, index) => {
      setTimeout(() => {
        sendEmail(email, subject, STATIC_HTML);
      }, index * 2000);
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
