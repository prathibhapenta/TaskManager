import nodemailer from "nodemailer"
import { env } from "../config/env.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.emailUser,
        pass: env.emailPassword
    }
})

export const sendResetEmail = async (email, resetLink) => {
    await transporter.sendMail({
        from: env.emailUser,
        to:email,
        subject: "Reset your Password",
        html: `
        <h2>Password Reset</h2>

        <p>You requested a password reset</p>

        <p>Click the link below to reset your password:</p>

        <a href = "${resetLink}">Reset Password</a>

        <p>This link will expire in 15 minutes</p>
        `
    })
}