import { expect, test } from "@jest/globals"; 
import request from "supertest"; 
import app from "../app.js"; 
import { pool } from "../config/db.js";

describe("TODO API", () => {
    const testEmail = `test${Date.now()}@getMaxListeners.com`;
    const testPassword = "password"
     
    let token;
    let todoId;

    //test register
    test("Register test User", async() => {
        const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Test User",
            email: testEmail,
            password: testPassword
        })
        expect(response.statusCode).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("Registered successfully")
    })
    //test login
    test("Login test user", async() => {
        const response = await request(app)

        .post("/api/auth/login")
        .send({
           email: testEmail,
           password: testPassword
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.token).toBeDefined()

        token = response.body.token
    })

    //test create todo
    test("Create todo", async() => {
        const response = await request(app)

        .post("/api/insert-todo")
        .set("Authorization", `Bearer ${token}`)
        .send({
                title: "Automated Testing",
                description: "Learn Jest and Supertest",
                status: "IN_PROGRESS",
                priority: "HIGH"
        })
        expect(response.statusCode).toBe(201)
        expect(response.body.success).toBe(true)
        expect(response.body.todo).toBeDefined()

        todoId = response.body.todo.id;
    })

    //test get todo
    test("Get Todos", async() => {
        const response = await request(app)
        .get("/api/get-todos")
        .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.todo).toBeDefined()
    })
test("Get Todos without token", async () => {

    const response = await request(app)
        .get("/api/get-todos");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
});
test("Get Todos with invalid token", async () => {

    const response = await request(app)
        .get("/api/get-todos")
        .set("Authorization", "Bearer invalid-token");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
});
    //test getById
    test("get Todos ById", async() => {
        const response = await request(app)
        .get(`/api/getTodoById/${todoId}`)
        .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.todo).toBeDefined()
    })

    //test update todo
    test("Test Update Todo", async() => {
        const response = await request(app)
        .put(`/api/update-todo/${todoId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Updated Todo",
            description: "Updated description",
            status: "DONE",
            priority: "MEDIUM"
        });
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.todo).toBeDefined()
    })
     
    

    //test delete
    test("Test Delete Todo", async() => {
        const response = await request(app)
        .delete(`/api/delete-todo/${todoId}`)
        .set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("Todo Deleted Successfully")
    })
    afterAll(async () => {
    await pool.end();
});
})