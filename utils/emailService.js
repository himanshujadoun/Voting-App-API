const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendVerificationEmail = (email, token) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `<p>Click <a href="http://localhost:3000/verify-email?token=${token}">here</a> to verify your email.</p>`,
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) console.error('Error sending email:', err);
    });
};
