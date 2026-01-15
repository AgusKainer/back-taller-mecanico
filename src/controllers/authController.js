const authService = require("../services/authService");

async function register(req, res) {
  try {
    const admin = await authService.register(req.body);
    return res.status(201).json({ mensaje: "Admin registrado exitosamente", admin: { id: admin.id, correo: admin.correo } });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { token, admin } = await authService.login(req.body);
    return res.status(200).json({ mensaje: "Login exitoso", token, admin: { id: admin.id, correo: admin.correo } });
  } catch (err) {
    console.log("error al logearse: ", err);
    
    return res.status(401).json({ error: err.message });
  }
}

module.exports = { register, login };
