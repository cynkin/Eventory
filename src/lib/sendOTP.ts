import nodemailer from 'nodemailer';
import {redis} from "@/lib/db";

export const sendOTP = async (userEmail: string) => {

    const otp = Math.floor(100000 + Math.random() * 900000);
    await redis.set(`otp_${userEmail}`, otp, { ex: 150 });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Eventory, Inc" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'OTP for Eventory',
        text: `Hi, For your security, don't share this code. Your secure code is ${otp}. It expires in 5 minutes. If you didn't request this, you can ignore this email.`,
    }

    await transporter.sendMail(mailOptions);
}
