const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const bcrypt = require("bcrypt");

const Usuario = sequelize.define("Usuario", {
  correo: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  municipio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  barrio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estrato: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_documento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero_documento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contrasena: {   
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "usuario",
  },
}, {
  tableName: "usuarios",
  timestamps: true,
});

module.exports = Usuario;