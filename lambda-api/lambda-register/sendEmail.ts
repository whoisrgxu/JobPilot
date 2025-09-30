// lib/sendEmail.ts
import nodemailer from "nodemailer";

function assertEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

// If you're on Next.js App Router, ensure this runs on Node.js runtime (not edge)
// export const runtime = "nodejs";

export function makeGmailTransport() {
  const user = assertEnv("EMAIL_USER"); // your@gmail.com
  const pass = assertEnv("EMAIL_PASS"); // 16-char APP PASSWORD (not your Gmail login)
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: { user, pass },
  });
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
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
  } catch (err:unknown) {
    console.error("Failed to send email:", err);
    throw new Error("Email sending failed");
  }
}
