const jwt = require("jsonwebtoken");
const { formatErrorMessage } = require("../utils/helpers");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token expired",
          code: "TOKEN_EXPIRED"
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
        code: "INVALID_TOKEN"
      });
    }
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

module.exports = auth;
