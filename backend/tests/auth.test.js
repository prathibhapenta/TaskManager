import { expect, jest, test } from "@jest/globals";
import request from "supertest"
import app from "../app.js"
import { pool } from "../config/db.js"

jest.setTimeout(15000);
describe("AUTH API", () => {

    const testEmail = `test${Date.now()}@getMaxListeners.com`;
    const testPassword = "password"
     
    let token;

    //register
    test("Register test Successfully", async() => {

        const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Test User",
            email: testEmail,
            password: testPassword
        });
        expect(response.statusCode).toBe(201)
        expect(response.body.success).toBe(true)
        
    })

    //register fail
    test("Register should fail if email is missing", async() => {

        const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Test User",
            password: testPassword
        });
        
        expect(response.statusCode).toBe(400)
        expect(response.body.success).toBe(false)
    })

    //login success
    test("Login successfully", async() => {
        const response = await request(app)

        .post("/api/auth/login")
        .send({
            email: testEmail,
            password: testPassword
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.token).toBeDefined()

        token = response.body.token;
    })

    //login fail
    test("Login should Failed if email is missing", async() => {
        const response = await request(app)
        .post("/api/auth/login")
        .send({
            password: testPassword
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.token).toBeUndefined()
    })

    
    // protected route success
test("Access protected route with valid token", async () => {

    const response = await request(app)
        .get("/api/test")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeDefined();
});

//protected without token
test("Access Protected route without valid token", async() => {
    const response = await request(app)

    .get("/api/test")

    expect(response.statusCode).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Authorized token required")
})

//protected token invalid token
test("Access Protected route invalid token", async() => {
    const response = await request(app)

    .get("/api/test")
    .set("Authorization", "Bearer Invalid token")

    expect(response.statusCode).toBe(401)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe("Invalid or expired token")
})

    afterAll(async () => {
        await pool.query(
            "DELETE FROM users WHERE email = $1",
            [testEmail]
        );
    });
     
})

