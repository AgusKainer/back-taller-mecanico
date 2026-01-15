const bcrypt = require("bcryptjs");
const jwtUtil = require("../utils/jwt");
const adminModel = require("../models/adminModel");

async function register({ correo, contraseña, tallerName }) {
  if (!correo || !contraseña) throw new Error("Faltan datos");
  const exists = await adminModel.findByCorreo(correo);
  if (exists) throw new Error("Correo ya registrado");
  const hash = await bcrypt.hash(contraseña, 8);
  const admin = await adminModel.createAdmin({ correo, contraseñaHash: hash, tallerName });
  return admin;
}

async function login({ correo, contraseña }) {
  if (!correo || !contraseña) throw new Error("Faltan datos");
  const admin = await adminModel.findByCorreo(correo);
  if (!admin) throw new Error("Credenciales inválidas");
  const match = await bcrypt.compare(contraseña, admin.contraseña);
  if (!match) throw new Error("Credenciales inválidas");
  const token = jwtUtil.sign({ id: admin.id, correo: admin.correo, companyId: admin.companyId });
  return { token, admin };
}

module.exports = { register, login };
