"use client";

import { useState } from "react";
import styles from "./RegistroYLogin.module.css";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

export default function HomeContent() {
  const { login } = useAuth();

  const [isActive, setIsActive] = useState(false);

  const [formData, setFormData] = useState({
    correo: "",
    nombres: "",
    apellidos: "",
    celular: "",
    departamento: "",
    municipio: "",
    direccion: "",
    barrio: "",
    estrato: "",
    tipo_documento: "",
    numero_documento: "",
    contrasena: "",
    rol: "usuario",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.tipo_documento) {
      Swal.fire({ icon: "warning", title: "Oops...", text: "Debes seleccionar un tipo de documento" });
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Registro exitoso 🎉", text: "Ahora puedes iniciar sesión" });
        setIsActive(false);
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.mensaje || "Error en registro" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error de conexión", text: "No se pudo conectar al servidor" });
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: formData.correo, contrasena: formData.contrasena }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        Swal.fire({ icon: "success", title: "Bienvenido 👋", text: `Hola ${data.usuario.nombres}` });
      } else {
        Swal.fire({ icon: "error", title: "Error de login", text: data.mensaje || "Credenciales incorrectas" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error de conexión", text: "No se pudo conectar al servidor" });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.container} ${isActive ? styles.active : ""}`}>

        {/* LOGIN */}
        <div className={`${styles.formContainer} ${styles.signIn}`}>
          <form onSubmit={handleLogin}>
            <h1>Iniciar Sesión</h1>
            <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />
            <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
            <button type="submit">Ingresar</button>
          </form>
        </div>

        {/* REGISTRO */}
        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <form onSubmit={handleRegister}>
            <h1>Crear cuenta</h1>
            <div className={styles.twoCol}>
              <input name="nombres" onChange={handleChange} placeholder="Nombres" required />
              <input name="apellidos" onChange={handleChange} placeholder="Apellidos" required />
              <input name="correo" onChange={handleChange} placeholder="Correo" required />
              <select name="tipo_documento" onChange={handleChange} defaultValue="">
                <option value="" disabled>Tipo Documento</option>
                <option value="CC">Cédula</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
              <input name="numero_documento" onChange={handleChange} placeholder="Documento" required />
              <input name="contrasena" type="password" onChange={handleChange} placeholder="Contraseña" required />
            </div>
            <button type="submit">Registrarse</button>
          </form>
        </div>

        {/* PANEL */}
        <div className={styles.toggleContainer}>
          <div className={styles.toggle}>
            <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
              <button onClick={() => setIsActive(false)} type="button">Iniciar Sesión</button>
            </div>
            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <button onClick={() => setIsActive(true)} type="button">Registrarse</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}