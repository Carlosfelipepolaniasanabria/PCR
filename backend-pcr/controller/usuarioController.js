const Usuario = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registrarUsuario = async (req, res) => {
  try {
    console.log("BODY REGISTRO:", req.body);

    // 🔴 VALIDACIÓN CLAVE
    if (!req.body) {
      return res.status(400).json({ error: "Body no enviado" });
    }

    const {
      correo,
      nombres,
      apellidos,
      celular,
      departamento,
      municipio,
      direccion,
      barrio,
      estrato,
      tipo_documento,
      numero_documento,
      contrasena,
      rol
    } = req.body;

    // 🔴 VALIDAR CONTRASEÑA
    if (!contrasena) {
      return res.status(400).json({ error: "Falta contraseña" });
    }

    // 🔐 Encriptar
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    const usuario = await Usuario.create({
      correo,
      nombres,
      apellidos,
      celular,
      departamento,
      municipio,
      direccion,
      barrio,
      estrato,
      tipo_documento,
      numero_documento,
      contrasena: hash,
      rol
    });

    res.status(201).json({
      mensaje: "Usuario registrado",
      usuario
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
// LOGIN
const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const usuario = await Usuario.findByPk(correo);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const valido = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!valido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Token
    const token = jwt.sign(
      { correo: usuario.correo, rol: usuario.rol },
      "secreto",
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET (prueba protegido)
const perfil = async (req, res) => {
  res.json({
    mensaje: "Acceso permitido",
    usuario: req.usuario
  });
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  perfil
};