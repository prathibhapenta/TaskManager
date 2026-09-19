import dotenv from "dotenv"

dotenv.config();

import { env } from "./config/env.js";
import app from "./app.js";
import { initDatabase } from "./database/initDatabase.js";

const port = env.port || 5000;

const startServer = async () => {
    try{
        await initDatabase();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })

    }
    catch(err){
         console.log("Server failed to start:", err.message)
    }
}

startServer();