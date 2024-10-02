import nodemailer from "nodemailer";
import "dotenv/config";
import { mailOption } from "../@types/userTypes";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSWORD,
  },
});
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `http://localhost:${process.env.PORT}/verify-email?token=${token}`;

  const mailOptions : mailOption = {
    from: process.env.GMAIL_ACCOUNT!,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: ${verificationUrl} `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  const mailOptions:mailOption = {
    from: process.env.GMAIL_ACCOUNT!,
    to: email,
    subject: "Password Reset",
    text: `Please reset your password by clicking on the following link: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
};
