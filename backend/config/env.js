import dotenv from "dotenv"

dotenv.config()

export const env = {
    port: process.env.PORT,

    databaseUrl: process.env.DATABASE_URL,

    jwtSecret: process.env.JWT_SECRET,

    jwtExpiredIn: process.env.JWT_EXPIRED_IN,

    emailUser: process.env.EMAIL_USER,

    emailPassword: process.env.EMAIL_PASSWORD
}