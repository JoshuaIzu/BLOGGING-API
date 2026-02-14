const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Blog = require('../models/Blog');
const { getAuthToken, userOne } = require('./testHelper');
require('dotenv').config();

jest.setTimeout(20000);
let token;

const blogData = {
    title: 'Testing with Jest',
    description: 'A guide to testing',
    body: 'This is the content of the blog',
    tags: ['test', 'jest']
};

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URI);
    token = await getAuthToken(); 
});

afterEach(async () => {
    await Blog.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Blog API', () => {
    
    describe('POST /api/blogs', () => {
        it('should create a blog post', async () => {
            const res = await request(app)
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(blogData);

            expect(res.statusCode).toBe(201);
            expect(res.body.data.title).toBe(blogData.title);
            expect(res.body.data.state).toBe('draft');
        });
    });

    describe('GET /api/blogs', () => {
        it('should get a list of published blogs', async () => {
            const created = await request(app)
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(blogData);

            await request(app)
                .put(`/api/blogs/${created.body.data._id}/publish`)
                .set('Authorization', `Bearer ${token}`);

            const res = await request(app).get('/api/blogs');
            expect(res.statusCode).toBe(200);
            expect(res.body.data.length).toBe(1);
        });
    });
});