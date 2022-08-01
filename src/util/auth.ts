const jwt = require('jsonwebtoken');



export function generateAccessToken(email: string) {
    return jwt.sign({
        email: email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const api = {
    generateAccessToken
}

export default api;