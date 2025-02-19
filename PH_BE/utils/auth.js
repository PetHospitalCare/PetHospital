const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (userId, role, username, email) => {
  return jwt.sign(
    { id: userId, role, username, email },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "1d" }
  );
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { generateToken, comparePassword };