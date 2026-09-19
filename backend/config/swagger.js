import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Manager API",
            version: "1.0.0",
            description: "Task Manager Backend API"
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ]
    },

    apis: ["./routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);