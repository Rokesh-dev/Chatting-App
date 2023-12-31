const jwt = require("jsonwebtoken");
const User = require("../modules/users/User");

const auth = async (req, res, next) => {
    let token;
  
    // If 'authorization' header present and starts Wwth 'Bearer' word
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1]; // Splits "Bearer <TOKEN>"
  
        //decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Find user with the id and return it without the password
        req.user = await User.findById(decoded.id).select("-password");
  
        if (req.originalUrl.includes('/admin/') && decoded.role !== 'admin') {
          return res.status(403).json({
            success: false,
            statusCode: 403,
            message: "Forbidden - Insufficient permissions",
          });
        }

        next(); // Move on to next operation
      } catch (error) {
        console.log(error)
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: "Not authorized, token failed",
        });
      }
    }
  
    // If token is not present
    if (!token) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Not authorized, no token provided",
      });
    }
  };
  
  module.exports = auth;