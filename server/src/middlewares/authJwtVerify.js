require('dotenv').config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    
    // console.log("Received Token:", token); // Log received token

    if (!token) {
        return res.status(403).send({ message: "No token provided!!" });
    }

    jwt.verify(token, process.env.SECRETKEY, (error, decoded) => {
        if (error) {
            // console.error("Token Verification Error:", error); // Log error details
            return res.status(401).send({ message: "Unauthorized!", success: false });
        }
        
        // console.log("Decoded Token:", decoded); // Log decoded token
        
        req.id = decoded.id;
        req.name = decoded.name;
        req.username = decoded.username;
        req.password = decoded.password;
        next();
    });
}


module.exports = verifyToken;