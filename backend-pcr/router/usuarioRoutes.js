const express = require("express");
const router = express.Router();

const {
  registrarUsuario,
  loginUsuario,
  perfil
} = require("../controller/usuarioController.js");

// Registro
router.post("/registro", registrarUsuario);

// Login
router.post("/login", loginUsuario);

// Ruta protegida
router.get("/perfil", perfil);

module.exports = router;