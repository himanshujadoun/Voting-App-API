const nodemailer = require("nodemailer");
const fs = require("fs/promises");
const path = require("path");

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

exports.sendVerificationEmail = async (email, token) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "verify-email.html"
    );

    const rawHtml = await fs.readFile(templatePath, "utf8");

    const verificationLink =
      `${process.env.CLIENT_BASE_URL}/#/VerifyEmail?token=${token}`;

    const finalHtml = rawHtml.replace(
      "{{VERIFICATION_LINK}}",
      verificationLink
    );

    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: finalHtml,
    });

    console.log("✅ Verification email sent to", email);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};
