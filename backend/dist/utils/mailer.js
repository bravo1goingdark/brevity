var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from "nodemailer";
import "dotenv/config";
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD,
    },
});
export const sendVerificationEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `http://localhost:${process.env.PORT}/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.GMAIL_ACCOUNT,
        to: email,
        subject: "Email Verification",
        text: `Please verify your email by clicking on the following link: ${verificationUrl} `,
    };
    yield transporter.sendMail(mailOptions);
});
export const sendResetPasswordEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetUrl = `http://localhost:${process.env.PORT}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.GMAIL_ACCOUNT,
        to: email,
        subject: "Password Reset",
        text: `Please reset your password by clicking on the following link: ${resetUrl}`,
    };
    yield transporter.sendMail(mailOptions);
});
