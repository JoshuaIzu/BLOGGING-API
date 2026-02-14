const request = require('supertest');
const app = require('../app'); 

const userOne = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'Password@123'
};

async function getAuthToken(userData = userOne) {
    const res = await request(app)
        .post('/api/auth/signup')
        .send(userData);
    return res.body.token;
}

module.exports = { getAuthToken, userOne };