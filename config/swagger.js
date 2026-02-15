const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blogging API',
            version: '1.0.0',
            description: 'A RESTful API for a blogging platform built with Node.js, Express, and MongoDB',
            contact: {
                name: 'Uzuegbu Joshua',
                github: 'JoshuaIzu',
            },
        },
        servers: [
            {
                url: 'https://blogging-api-x47f.onrender.com/',
                description: 'Development server',
            },
            {
                url: 'https://blogging-api-x47f.onrender.com/',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60c72b2f9b1d8e5a5c8f9a1ca' },
                        first_name: { type: 'string', example: 'John' },
                        last_name: { type: 'string', example: 'Doe' },
                        email: { type: 'string', format: 'email', example: 'john.doe@example.com' }, 
                    },
                },
                Blog: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60c72b2f9b1d8e5a5c8f9a1cb' },
                        title: { type: 'string', example: 'My First Blog Post' },
                        description: { type: 'string', example: 'An intro into Swagger' },
                        body: { type: 'string', example: 'Content of the blog post '},
                        tags: { type:'array', items: { type: 'string' }, example: ['tech', 'api'] },
                        author: { $ref: '#/components/schemas/User' },
                        state: { type: 'string', enum: ['draft', 'published'], example: 'published' },
                        read_count: { type: 'integer', example: 10 },
                        reading_time: { type: 'string', example: 2 },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
                SignupRequest: {
                    type: 'object',
                    required: ['first_name', 'last_name', 'email', 'password'],
                    properties: {
                        first_name: { type: 'string', example: 'John' },
                        last_name: { type: 'string', example: 'Doe' },
                        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                        password: { type: 'string', example: 'P@ssword123', description: 'Min 8 chars, uppercase, lowercase, number, special char' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                        password: { type: 'string', format:'password', example: 'P@ssword123' }
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        message: { type: 'string', example: 'Error description' }, 
                    },
                },    
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
     apis: ['./routes/*.js']
    };

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;