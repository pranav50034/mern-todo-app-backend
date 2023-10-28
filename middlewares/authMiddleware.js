const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = (req, res, next) => {
   const token = req.headers["authorization"];
   if (!token) {
      return res.status(401).json({
         status: 401,
         message: "Access denied. No token provided.",
      });
   }

   try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.locals = decoded
      next();
   } catch (error) {
      return res.status(403).json({
         status: 403,
         message: "Access denied. Invalid token.",
         error: error,
      });
   }
};

module.exports = {authMiddleware}
