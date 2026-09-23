import express from "express"
import cors from "cors"
import helmet from "helmet";
import rateLimit from "express-rate-limit"

import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import { errorHandler } from "./middleware/errorMiddleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express()

app.use(express.json());
app.use(cors())
app.use(helmet())

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 1000,
// })

// app.use(limiter) 

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Manager API is running"
    });
});
app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(errorHandler);

export default app