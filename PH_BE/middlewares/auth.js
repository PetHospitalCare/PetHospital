const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json({ error: `Unauthorized ${token}` });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.userRole) ? req.userRole : [req.userRole];
    if (!userRoles.some(role => roles.includes(role))) {
      return res.status(403).json({ error: "Permission denied" });
    }
    next();
  };
};