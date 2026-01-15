const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "secreto_dev";

function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

function verify(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { sign, verify };
