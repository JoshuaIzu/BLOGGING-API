const validateSignUp = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const isRequired = (value, fieldName) => 
        !value ? `${fieldName} is required.`: null;

    const isValidEmail = (email) => 
        email && !emailRegex.test(email) ? 'Invalid email format' : null;

    const isValidPassword = (password) => 
        password && password.length < 6 ? 'Password must be at least 6 characters': null;

    const errors = [
        isRequired(first_name, 'First name'),
        isRequired(last_name, 'Last name'),
        isRequired(email, 'Email'),
        isRequired(password, 'Password'),
        isValidEmail(email),
        isValidPassword(password)
    ].filter(Boolean)
    
    if(errors.length > 0) {
        return res.status(400).json({ success: false, error: errors });

    }

    next();
};
module.exports = { validateSignUp };

