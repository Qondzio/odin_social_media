let nodemailer = require('nodemailer');

function sendEmail(email,randomToken){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'koobiesupport@gmail.com',
            pass: process.env.GMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: 'koobiesupport@gmail.com',
        to: `${email}`,
        subject: 'Koobie - Password reset',
        html: `<h2>Have you forgotten your Koobie password?</h2>
        <p>Please click on the link below to reset your password:</p>
        <a href="http://localhost:5173/reset-password/${randomToken}">localhost:5173/reset-password/${randomToken}</a>
        <p>You will be redirected to a website were you'll be able to enter a new password for your account.</p>
        <p>This link is only valid for 1 hour. After it expires, you must request a new one.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Only a person with access to your email can reset your account password.</p>
        `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports={sendEmail}