import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendMail = async (to: string, subject: string, text: string) => {
    await transporter.sendMail({
        from: '"Equipe HelpDesk" <no-reply@helpdesk.com>',
        to,
        subject,
        text,
    });
};
