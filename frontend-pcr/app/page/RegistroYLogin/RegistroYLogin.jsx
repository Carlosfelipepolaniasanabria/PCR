"use client";
import { useState } from "react";
import styles from "./RegistroYLogin.module.css";

export default function HomeContent() {

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
    rol: "usuario"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.container} ${isActive ? styles.active : ""}`}>

        {/* LOGIN */}
        <div className={`${styles.formContainer} ${styles.signIn}`}>
          <form>
            <h1>Iniciar Sesión</h1>

            <span>o usa tu correo y contraseña</span>

            <input type="email" placeholder="Correo" />
            <input type="password" placeholder="Contraseña" />

            <button type="submit">Ingresar</button>
          </form>
        </div>

        {/* REGISTRO */}
        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <form onSubmit={handleSubmit}>
            <h1>Crear cuenta</h1>

  <div className={styles.twoCol}>
    <input placeholder="Nombres" />
    <input placeholder="Apellidos" />
    <input placeholder="Correo" />
    <input placeholder="Celular" />
    <input placeholder="Departamento" />
    <input placeholder="Municipio" />
    <input placeholder="Dirección" />
    <input placeholder="Barrio" />
    <input placeholder="Estrato" />
    <input placeholder="Tipo Documento" />
    <input placeholder="Número Documento" />
    <input placeholder="Contraseña" type="password" />
  </div>

  <button>Registrarse</button>
</form>
        </div>

        {/* PANEL DESLIZANTE */}
        <div className={styles.toggleContainer}>
          <div className={styles.toggle}>

            <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
              <h1>¡Bienvenido!</h1>
              <p>Ingresa tus datos personales para usar todas las funciones</p>
              <button
                className={styles.hidden}
                onClick={() => setIsActive(false)}
                type="button"
              >
                Iniciar Sesión
              </button>
            </div>

            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <h1>Hola 👋</h1>
              <p>Regístrate para comenzar a usar el sistema</p>
              <button
                className={styles.hidden}
                onClick={() => setIsActive(true)}
                type="button"
              >
                Registrarse
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

