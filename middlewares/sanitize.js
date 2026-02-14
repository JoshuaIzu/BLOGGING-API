const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');

module.exports = (app) => {
    app.use(helmet());

    app.use(mongoSanitize({
        replaceWith: '_',
        onSanitize: (req, key) => {
            console.warn(`Sanitized key: ${key} in ${req.path}`);
        },
    }));

    app.use(xss());
};