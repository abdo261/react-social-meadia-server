const jwt = require('jsonwebtoken');

require('dotenv').config()
const isAuth = async (req, res, next) => {

  try {
    console.log('Incoming Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    if (!payload) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req._id = payload._id;
    next();
  } catch (error) {

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
console.log(error)
    res.status(500).json({ message: error.message });
  }
};

module.exports = isAuth;
