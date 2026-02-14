const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const SignUpUser = async(userData) => {
    const existingUser = await UserModel.findOne({ email: userData.email });

    if(existingUser) {
        return { status: 400, message: 'Email already in use' };
    }

    const user = await UserModel.create(userData);

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    const _user = user.toObject();
    delete _user.password;

    return {
        status: 201,
        message: 'User created successfully',
        user: _user,
        token
    };
}

const LoginUser = async(email, password) => {
    const user = await UserModel.findOne({ email });

    if(!user) {
        return { status: 400, message: 'Invalid credentials' };
    }

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid) {
        return { status: 400, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    const _user = user.toObject();
    delete _user.password;

    return {
        status: 200,
        message: 'Login successful',
        user: _user,
        token
    };
}

module.exports = {
    SignUpUser,
    LoginUser
}