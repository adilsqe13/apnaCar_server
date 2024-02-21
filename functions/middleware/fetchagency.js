require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchagency = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: 'Please authenticate a valid token' })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.seller = data.seller;
        next();

    } catch (error) {
        res.status(401).send({ error: 'Please authenticate a valid token' });
    }
}

module.exports = fetchagency;

