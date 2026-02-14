const { SignUpUser, LoginUser } = require('../utils/authService');

const signUp = async(req, res, next) => {
    try {
        const result = await SignUpUser(req.body);

        if(result.status === 400) {
            return res.status(400).json({ message: result.message });
        }
        res.status(201).json(result);
    } catch(error) {
        next(error);
    }
};

const signIn = async(req, res, next) => {
    try {
        const result = await LoginUser(req.body.email, req.body.password);

        if (result.status === 400) {
            return res.status(400).json({ message: result.message });
        }
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    signUp,
    signIn
}
