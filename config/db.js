const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async() => {
    try {
        let mongoUrl = process.env.MONGODB_URL;
        const dbName = process.env.DATABASE;

        if (!mongoUrl) {
            throw new Error('MONGODB_URL is not defined in .env file');
        }

        if (dbName) {

            if (mongoUrl.includes('?')) {
                mongoUrl = mongoUrl.replace('/?', `/${dbName}?`);
            }
            else if (!/\/[^\/]+$/.test(mongoUrl)) {
                mongoUrl = `${mongoUrl}/${dbName}`;
            }
        }

        const conn = await mongoose.connect(mongoUrl);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;