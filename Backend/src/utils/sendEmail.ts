import nodemailer from "nodemailer";

export const sendEmail = async (to: string, otp: string) => {
  try {
    console.log("📧 Trying to send email...");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"TripSnap" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};