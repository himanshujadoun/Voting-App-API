const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendVerificationEmail = (email, token) => {
    const templatePath = path.join(__dirname, "../templates/verify-email.html");
    const rawHtml = fs.readFileSync(templatePath, "utf8");

    const verificationLink = `${process.env.CLIENT_BASE_URL}/#/VerifyEmail?token=${token}`;
    const finalHtml = rawHtml.replace("{{VERIFICATION_LINK}}", verificationLink);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        html: finalHtml,
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) console.error("Error sending email:", err);
    });
};
