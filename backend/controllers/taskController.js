
import { pool } from "../config/db.js";

//1. getTodos
export const getTodos = async(req, res, next) => {
    try{
        console.log("Logged in user:", req.user);
        const {search, status, priority, page = 1, limit = 10} = req.query;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

        const offset = (pageNumber - 1) * limitNumber;


       const response = await pool.query(`
            SELECT * FROM todos
            WHERE user_id = $1
            AND ($2 = '' OR title ILIKE '%' || $2 || '%')
            AND ($3 = '' OR status = $3)
            AND ($4 = '' OR priority = $4)
            ORDER BY created_at DESC
            LIMIT $5
            OFFSET $6
        `, [req.user.id, search || "", status || "", priority || "", limitNumber, offset]);

            const todo = response.rows
        res.status(200).json({
            success: true,
            page: pageNumber,
            limit: limitNumber,
            todo,
            message: "Fetched all Todos"
        })

    }catch(err){
        next(err)
    }
}

//2.getTodosById
export const getTodosById = async(req,res,next) => {
    try{
        const {id} = req.params;
        const response = await pool.query(`
            SELECT * FROM todos WHERE id = $1 AND user_id = $2`, [id,req.user.id])
          if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Todo Not Found"
            });
        }
            const todo = response.rows[0]
        res.status(200).json({
            success: true,
            todo,
            message: "Fetched Todos by Id"
        })

    }catch(err){
        next(err)
    }
}
//3. insert Todos
export const insertTodos = async(req, res, next) => {
    try{
        const {title,description, status, priority,due_date, location,file_url} = req.body;

        const response = await pool.query(`
            INSERT INTO todos (
            user_id,
            title,
            description,
            status, 
            priority,
            due_date, 
            location,
            file_url
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *

            `,
        [
            req.user.id,
            title,
            description,
            status || "PENDING", 
            priority || "MEDIUM",
            due_date || null, 
            location || null,
            file_url || null
        ])

        const todo = response.rows[0];

        res.status(201).json({
            success: true,
            todo,
            message: "Inserted Todos Successfully"
        })

    }catch(err){
        next(err)
    }
}

//4. update Todo
export const updateTodos = async(req,res,next) => {
    try{
        const {id} = req.params;

        const {title,description, status, priority,due_date, location,file_url} = req.body;

        const response = await pool.query(`
            UPDATE todos SET 
            title = $1,
            description = $2, 
            status = $3, 
            priority = $4,
            due_date = $5,
            location = $6,
            file_url = $7,
            updated_at = CURRENT_TIMESTAMP
            
             WHERE id = $8 AND user_id = $9 RETURNING *`, [
            title,
            description,
            status, 
            priority,
            due_date, 
            location,
            file_url,
            id,
            req.user.id,
                    ])
            
            if(response.rows.length === 0){
                return res.status(400).json({
                    success: false,
                    message: "Todos Not Found"
                })
            }
            
            const todo = response.rows[0]
            res.status(200).json({
                success: true,
                todo,
                message: "Updated todo Successfully"
            })

    }catch(err){
        next(err)
    }
}

//5. delete Todo
export const deleteTodos = async(req,res,next) => {
    try{
        const {id} = req.params;

      const response = await pool.query(`DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING * `, [id, req.user.id] );
        if(response.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "Todo Not Found"
            })
        }

        const todo = response.rows[0]

        res.status(200).json({
            success: true,
            todo,
            message: "Todo Deleted Successfully"
        })
    }catch(err){
        next(err)
    }
}

//6. get todo with user name
export const getTodosWithUser = async(req, res, next) => {
    try{
        const response = await pool.query(`
            SELECT 
            todos.id,
            todos.title,
            todos.description,
            todos.status, 
            todos.priority,
            todos.due_date, 
            todos.location,
            todos.file_url,
            users.id AS user_id,
            users.name AS user_name,
            users.email AS user_email
            FROM todos 
            INNER JOIN users
            ON todos.user_id = users.id
            WHERE todos.user_id = $1
            ORDER BY todos.created_at DESC
            `,[req.user.id])

        res.status(200).json({
            success: true,
            todo: response.rows,
            message: "Fetched Todos with User information successfully"
        })

    }catch(err){
        next(err)
    }
}

//7. create Todo With Audit
export const createTodoWithAudit = async(req,res, next) => {
    const client = await pool.connect();
    try{
         const {
            title,
            description,
            status,
            priority,
            due_date,
            location,
            file_url
        } = req.body;

        await client.query("BEGIN");

        //1. insert todos
        const todoResponse = await client.query(`
            INSERT INTO todos (
            user_id,
             title,
            description,
            status,
            priority,
            due_date,
            location,
            file_url) 
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
            RETURNING *`,
        [
            req.user.id,
            title,
            description,
            status || "PENDING",
            priority || "MEDIUM",
            due_date || null,
            location || null,
            file_url || null 
        ])

        //2. todo
        const todo = todoResponse.rows[0]

        //3. insert audit
        const auditResponse = await client.query(`
            INSERT INTO audit_logs(user_id, todo_id, action) 
            VALUES ($1, $2,$3)
            RETURNING *
            `, [
                req.user.id, todo.id, "TODO_CREATED"
            ])

             const auditLog = auditResponse.rows[0];

        //save both operation
        await client.query("COMMIT");

        //response
        res.status(201).json({
            success: true,
            todo,
            auditLog,
            message: "Todo and audit log created successfully"
        })



    }catch(err){
        //cancel everything if any operation fails
        await client.query("ROLLBACK");
        next(err)
    }
    finally{
        //Return connect to pool
        client.release()

    }
}

//8. upload file
export const uploadFile = async (req, res, next) => {
    try{
        
        const file = req.file || null;

        res.status(200).json({
            success: true,
            file: req.file,
            message: file ?  "File uploaded successfully" : "No file uploaded"
        })

    }
    catch(err){
        next(err)
    }
}

