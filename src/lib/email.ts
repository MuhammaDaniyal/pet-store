import "server-only";

import nodemailer from "nodemailer";

type VerificationEmailInput = {
  name: string;
  email: string;
  code: string;
};

type SendVerificationEmailResult = {
  debugCode?: string;
};

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getFromAddress() {
  return process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@pet-store.local";
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (process.env.SMTP_URL) {
    cachedTransporter = nodemailer.createTransport(process.env.SMTP_URL);
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: {
        user,
        pass,
      },
    });
    return cachedTransporter;
  }

  return null;
}

export async function sendVerificationEmail(
  input: VerificationEmailInput,
): Promise<SendVerificationEmailResult> {
  const transporter = getTransporter();

  if (!transporter) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SMTP is not configured. Returning the verification code for local development.");
      return { debugCode: input.code };
    }

    throw new Error("SMTP configuration is missing. Set SMTP_URL or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.");
  }

  const subject = "Verify your PetStore account";
  const text = [
    `Hi ${input.name},`,
    "",
    `Your PetStore verification code is: ${input.code}`,
    "",
    `This code expires in 15 minutes.`,
    "",
    "If you did not request this code, you can ignore this message.",
  ].join("\n");

  await transporter.sendMail({
    from: getFromAddress(),
    to: input.email,
    subject,
    text,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0A0A0A">
        <p>Hi ${input.name},</p>
        <p>Your PetStore verification code is:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:0.3em">${input.code}</p>
        <p>This code expires in 15 minutes.</p>
        <p>If you did not request this code, you can ignore this message.</p>
      </div>
    `,
  });

  return {};
}

export async function sendVetWelcomeEmail(
  name: string,
  email: string,
) {
  const transporter = getTransporter();

  if (!transporter) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SMTP is not configured. Simulating sending Vet welcome email.");
      return;
    }

    throw new Error("SMTP configuration is missing. Set SMTP_URL or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.");
  }

  const subject = "Your Vet Account has been Verified!";
  const text = [
    `Hi ${name},`,
    "",
    `Your Veterinarian account at PetStore has been verified by our admins!`,
    "",
    `You can now log in to manage your dashboard and appointments.`,
    "",
    `Welcome to the platform!`,
  ].join("\n");

  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject,
    text,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0A0A0A">
        <p>Hi ${name},</p>
        <p>Your Veterinarian account at PetStore has been verified by our admins!</p>
        <p>You can now log in to manage your dashboard and appointments.</p>
        <p>Welcome to the platform!</p>
      </div>
    `,
  });
}
