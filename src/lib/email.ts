import nodemailer from "nodemailer";
import { BASE_URL } from "@/variables/globals";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function sendInvitationEmail(
  email: string,
  orgName: string,
  invitedBy: string,
  token: string
) {
  const confirmUrl = `${BASE_URL}/invitation/${token}`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">You've been invited to ${orgName}</h2>
      <p>${invitedBy} has invited you to join their organization on Apprena.</p>
      <p>Click the button below to accept the invitation:</p>
      <a href="${confirmUrl}" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
        Accept Invitation
      </a>
      <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
    </div>
  `;

  return sendEmail(email, `You've been invited to ${orgName}`, html);
}

export async function sendShareNotificationEmail(
  email: string,
  roadmapTitle: string,
  sharedBy: string,
  slug: string
) {
  const shareUrl = `${BASE_URL}/share/${slug}`;
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Roadmap Shared With You</h2>
      <p>${sharedBy} has shared their roadmap "<strong>${roadmapTitle}</strong>" with you.</p>
      <a href="${shareUrl}" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
        View Roadmap
      </a>
    </div>
  `;

  return sendEmail(email, `${sharedBy} shared a roadmap with you`, html);
}