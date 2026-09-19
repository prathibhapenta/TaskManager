import { pool } from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { env } from "../config/env.js";

import { sendResetEmail } from "../utils/emailService.js";
//1.register
export const userRegister = async (req, res, next) => {
    try{
        const {name, email, password} = req.body;
        
        //1. check field
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }

        //2. check existing user
        const existingUser = await pool.query(`
            SELECT * FROM users WHERE email = $1`, [email])

        if(existingUser.rows.length > 0){
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        //3. hashedPassword 
        const hashedPassword = await bcrypt.hash(password, 10);

        //4. insert user
        const response = await pool.query(`
            INSERT INTO users (name, email, password) VALUES ($1, $2,$3) RETURNING id, name, email, created_at`, [name, email, hashedPassword]);
        
        //5. user
        const user = response.rows[0]

        //6.response 
        res.status(201).json({
            success: true,
            user,
            message: "Registered successfully"
        })

    }catch(err){
        next(err)
    }
}

//2. login
export const userLogin = async(req, res, next) => {
    try{
        const {email, password} = req.body;

        //1. check field
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }

        //2. check email
        const response = await pool.query(`
            SELECT * FROM users WHERE email = $1`, [email])
        if(response.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        //3. user 
        const user = response.rows[0]

        //4. password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
     
        if(!isPasswordCorrect){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        //4. token
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
            env.jwtSecret,
            {
                expiresIn: env.jwtExpiredIn
            }
        )

        //5. response
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token,
            message: "Login Successfully"
        })

    }catch(err){
        next(err)
    }
}

//3. forget Password
export const forgetPassword = async(req, res, next) => {
    try{
        const {email} = req.body;

        //1. check field
        if(!email){
             return res.status(400).json({
                success: false,
                message: "All fields required"
            })    
        }

        //2.check email
        const response =await pool.query(`
            SELECT id, email FROM users WHERE email = $1`, [email])
        
        if(response.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "Email Not Found"
            })
        }
        //3. user
        const user = response.rows[0]

        //4.resend token
        const resetToken = crypto.randomBytes(30).toString("hex");

        //5. expire token
        const resetExpireToken = new Date(Date.now() + 15 * 60 * 1000);

        //6. save expire token
        await pool.query(`
            UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3`, [resetToken, resetExpireToken, user.id])
        
        //7. reset Token
        const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`
        
        //8. send email
        await sendResetEmail(email, resetLink)

        //9. response 
        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        })

    }
    catch(err){
        next(err)
    }
}

//4. reset Password
export const resetPassword = async(req, res, next) => {
    try{
        const {token} = req.params;
        const {password} = req.body;

        //1. check password
        if(!password){
            return res.status(400).json({
                success: false,
                message: "Password is required"
            })
        }

        //2.token
        const response = await pool.query(`
            SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()`, [token])

        if(response.rows.length === 0){
            return res.status(400).json({
                success: false,
                message: "Invalid or expire token"
            })
        }

        //3. user 
        const user = response.rows[0]

        //4.hashPassword
        const hashPassword = await bcrypt.hash(password, 10);

        //5. select
        await pool.query(`
        UPDATE users
SET password = $1,
    reset_token = NULL,
    reset_token_expires = NULL
WHERE id = $2`, [hashPassword, user.id])
        //6. response 
        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    }
    catch(err){
        next(err)
    }
}