import fs from "fs"
import path from "path"
import { pool } from "../config/db.js"

export const initDatabase = async () => {
    try{
        const schemaPath = path.join(process.cwd(), "database", "schema.sql")

        const schema = fs.readFileSync(schemaPath, "utf-8");

        await pool.query(schema)

        console.log("Database Initialized Successfully")

    }
    catch(err){
        console.log("Database Initialization failed:", err.message)
    }
}