import express from "express"
import { forgetPassword, resetPassword, userLogin, userRegister } from "../controllers/authController.js"
import { verifyToken } from "../middleware/authMiddleware.js";

const routes = express.Router()

routes.post("/auth/register", userRegister);
routes.post("/auth/login", userLogin);
routes.post("/auth/forgot-password", forgetPassword);
routes.post("/auth/reset-password/:token", resetPassword);


routes.get("/test", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
        message: "Your are authorized"
    })
})

export default routes