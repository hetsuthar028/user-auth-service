require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
    try {
        const accessToken = req.headers.authorization;

        const decoded = jwt.verify(accessToken, jwtSecret);
        req.email = decoded.email;
        req.username = decoded.username;
        req.userType = decoded.userType;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = verifyJWT;
