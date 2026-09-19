import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeaders = req.headers.authorization;

        if (!authHeaders) {
            return res.status(401).json({
                success: false,
                message: "Authorized token required"
            });
        }

        const [type, token] = authHeaders.split(" ");


        if (!token || type !== "Bearer") {
            return res.status(401).json({
                success: false,
                message: "Invalid Authorized Format"
            });
        }

        const decode = jwt.verify(token, env.jwtSecret);

        req.user = decode;

        next();

    } catch (err) {
        

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};