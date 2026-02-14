const jwt = require('jsonwebtoken');

const protect = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized, token missing' });
    }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id : decoded.userId };
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Unauthorized, invalid token' });
        };
};

module.exports = { protect };
