const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html, attachmentPath) => {
                const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                                user: process.env.SENDER_EMAIL,
                                                pass: process.env.SENDER_PASS,
                                },
                });

                const mailOptions = {
                                from: process.env.SENDER_EMAIL,
                                to,
                                subject,
                                html,
                                attachments: attachmentPath
                                                ? [
                                                                {
                                                                                path: attachmentPath,
                                                                },
                                                ]
                                                : [],
                };

                await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
