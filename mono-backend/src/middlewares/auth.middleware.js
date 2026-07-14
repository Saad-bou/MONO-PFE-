const { verifyToken } = require("../lib/jwt");
const authRepository = require("../modules/auth/auth.repository");

const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authorization.split(" ")[1];
    const payload = verifyToken(token);
    const user = await authRepository.findUserById(payload.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    const roleName = req.user && req.user.role && req.user.role.name;

    if (!roleName || !roles.includes(roleName)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return next();
  };
};

module.exports = authMiddleware;
module.exports.requireRole = requireRole;
