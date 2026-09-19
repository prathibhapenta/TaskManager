import express from "express"
import { getTodos, getTodosById, insertTodos, updateTodos, deleteTodos, getTodosWithUser, createTodoWithAudit, uploadFile } from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { todoValidate } from "../middleware/todoMiddleware.js";

import { upload } from "../middleware/uplodeMiddleware.js";
const routes = express.Router();

routes.get("/get-todos", verifyToken, getTodos);
routes.get("/getTodoById/:id", verifyToken, getTodosById);
routes.post("/insert-todo", verifyToken, todoValidate, insertTodos);
routes.put("/update-todo/:id", verifyToken, todoValidate, updateTodos);
routes.delete("/delete-todo/:id", verifyToken, deleteTodos)

// Get Todo with User information
routes.get("/get-todo-with-user", verifyToken, getTodosWithUser);


routes.post("/create-todo-with-audit", verifyToken, todoValidate, createTodoWithAudit);

routes.post("/upload-file", verifyToken, upload.single("file"), uploadFile)
export default routes