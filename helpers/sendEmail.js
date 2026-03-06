import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_PASSWORD, UKR_NET_EMAIL} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, // 25, 465, 887, 2525
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSWORD
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (payload) => {
  const email = { ...payload, from: UKR_NET_EMAIL };
  try {
    const info = await transport.sendMail(email);
    console.log("[sendEmail] Sent to", payload.to, "— messageId:", info.messageId);
    return info;
  } catch (err) {
    console.error("[sendEmail] Failed:", err.message);
    throw err;
  }
};

export default sendEmail;