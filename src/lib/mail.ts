import nodemailer from "nodemailer";
import crypto from "crypto";
import { money } from "./format";
import { paymentLabel, type Order } from "./types";

export function siteUrl() {
  return (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function mailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendMail(options: { to: string; subject: string; html: string }) {
  if (!mailConfigured()) {
    return { sent: false as const, error: "Email is not set up yet. Add SMTP_USER and SMTP_PASS." };
  }
  try {
    await transporter().sendMail({
      from: process.env.SMTP_FROM || `SitnDip <${process.env.SMTP_USER}>`,
      ...options,
    });
    return { sent: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send email.";
    console.error("sendMail", message);
    return { sent: false as const, error: message };
  }
}

export function unsubscribeToken(email: string) {
  const secret = process.env.SMTP_PASS || process.env.SMTP_USER || "sitndip";
  return crypto.createHmac("sha256", secret).update(email.toLowerCase()).digest("hex").slice(0, 24);
}

function wrap(title: string, body: string) {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#161616;background:#f6f1ea;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:28px;border:1px solid #e8e4dc">
    <p style="font-size:22px;letter-spacing:-0.03em;margin:0 0 16px">SitnDip</p>
    <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
    ${body}
    <p style="font-size:12px;color:#6d6d6d;margin-top:28px">SitnDip · sitndip@gmail.com · +961 70 888 898</p>
  </div></body></html>`;
}

export async function sendWelcomeSubscriber(email: string) {
  const unsub = `${siteUrl()}/api/subscribe/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken(email)}`;
  return sendMail({
    to: email,
    subject: "You are subscribed to SitnDip offers",
    html: wrap(
      "You are subscribed",
      `<p>Thank you. This email is now on the SitnDip list for offers and discounts.</p>
       <p>We will only send news about SitnDip jars, cups, and special prices.</p>
       <p style="font-size:12px;color:#6d6d6d"><a href="${unsub}">Unsubscribe</a></p>`,
    ),
  });
}

export async function sendPasswordReset(email: string, token: string) {
  const href = `${siteUrl()}/account/reset?token=${encodeURIComponent(token)}`;
  return sendMail({
    to: email,
    subject: "Reset your SitnDip password",
    html: wrap(
      "Reset your password",
      `<p>We received a request to reset the password for this SitnDip account.</p>
       <p><a href="${href}" style="display:inline-block;background:#2b1c14;color:#fff;padding:10px 18px;text-decoration:none">Choose a new password</a></p>
       <p>This link expires in 1 hour. If you did not ask for this, you can ignore this email.</p>`,
    ),
  });
}

export async function sendOrderReceipt(order: Order) {
  const lines = order.items
    .map((item) => `<tr><td style="padding:6px 0">${item.name} × ${item.qty}</td><td style="text-align:right">${money(item.price * item.qty)}</td></tr>`)
    .join("");
  const address = [order.customer.address, order.customer.buildingNumber, order.customer.city]
    .filter(Boolean)
    .join(", ");
  return sendMail({
    to: order.customer.email,
    subject: `SitnDip receipt ${order.id}`,
    html: wrap(
      `Receipt ${order.id}`,
      `<p>Hi ${order.customer.name}, thank you for your SitnDip order.</p>
       <table style="width:100%;border-collapse:collapse">${lines}
         <tr><td style="padding-top:10px;border-top:1px solid #e8e4dc"><strong>Total</strong></td>
         <td style="padding-top:10px;border-top:1px solid #e8e4dc;text-align:right"><strong>${money(order.total)}</strong></td></tr>
       </table>
       <p><strong>Payment:</strong> ${paymentLabel(order.paymentMethod)}</p>
       <p><strong>Deliver to:</strong> ${address}<br/>Phone: ${order.customer.phone}</p>`,
    ),
  });
}

export async function sendOffer(to: string, subject: string, message: string) {
  const unsub = `${siteUrl()}/api/subscribe/unsubscribe?email=${encodeURIComponent(to)}&token=${unsubscribeToken(to)}`;
  return sendMail({
    to,
    subject,
    html: wrap(
      subject,
      `<p style="white-space:pre-wrap">${message.replace(/</g, "&lt;")}</p>
       <p style="font-size:12px;color:#6d6d6d"><a href="${unsub}">Unsubscribe</a></p>`,
    ),
  });
}
