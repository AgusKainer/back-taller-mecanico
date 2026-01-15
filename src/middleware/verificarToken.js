const jwtUtil = require("../utils/jwt");

module.exports = function verificarToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return next();
  const parts = auth.split(" ");
  if (parts.length !== 2) return next();
  const token = parts[1];
  try {
    const decoded = jwtUtil.verify(token);
    req.user = decoded;
  } catch (err) {
    // token inválido -> no attach user
  }
  return next();
};
