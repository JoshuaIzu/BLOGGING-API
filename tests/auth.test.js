const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
require('dotenv').config();

jest.setTimeout(20000); 


beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URI);
});


afterEach(async () => {
    await User.deleteMany({});
});


afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth API', () => {
    const validUser = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@test.com',
        password: 'Password@123'
    };

    describe('POST /api/auth/signup', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send(validUser);
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
        });

        it('should not register user with duplicate email', async () => {
            await request(app).post('/api/auth/signup').send(validUser);
            
            const res = await request(app)
                .post('/api/auth/signup')
                .send(validUser);
            
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/signup').send(validUser);
        });

        it('should login user with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: validUser.email,
                    password: validUser.password
                });
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should reject login with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: validUser.email,
                    password: 'wrongpassword'
                });
            
            expect(res.statusCode).toBe(400); 
        });
    });
});