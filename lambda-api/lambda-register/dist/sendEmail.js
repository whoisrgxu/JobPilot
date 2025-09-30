"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGmailTransport = makeGmailTransport;
exports.sendEmail = sendEmail;
// lib/sendEmail.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
function assertEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env ${name}`);
    return v;
}
// If you're on Next.js App Router, ensure this runs on Node.js runtime (not edge)
// export const runtime = "nodejs";
function makeGmailTransport() {
    const user = assertEnv("EMAIL_USER"); // your@gmail.com
    const pass = assertEnv("EMAIL_PASS"); // 16-char APP PASSWORD (not your Gmail login)
    return nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // SSL
        auth: { user, pass },
    });
}
async function sendEmail({ to, subject, html, }) {
    const user = assertEnv("EMAIL_USER");
    const transporter = makeGmailTransport();
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || user, // should match the Gmail account
            to,
            subject,
            html,
        });
        return info;
    }
    catch (err) {
        console.error("Failed to send email:", err);
        throw new Error("Email sending failed");
    }
}
