import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for 465 port
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.SMTP_MAIL}`,
        to: options.email,
        subject: options.subject,
        html: options.html, // Hum pure HTML templates bheinjein ge
    };

    await transporter.sendMail(message);
};

export default sendEmail;