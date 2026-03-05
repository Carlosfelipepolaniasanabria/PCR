"use client";

import styles from "./ContenidoPrincipal.module.css";
import Link from "next/link";

export default function ContenidoPrincipal() {
  return (
    
    <div className={styles.page}>
      {/* NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.logoCircle} aria-hidden="true">
            🍃
          </div>
          <span className={styles.brand}>
            PCR <span className={styles.brandAccent}>- Consumo Responsable</span>
          </span>
        </div>

        <nav className={styles.navCenter}>
          <a className={styles.navLink} href="#sobre">Sobre nosotros</a>
          <a className={styles.navLink} href="#impacto">Impacto</a>
          <span className={styles.navDivider} />
          <Link className={styles.navLinkStrong} href="/login">Login</Link>
          <Link className={styles.navButton} href="/registro">Registrarse</Link>
        </nav>
      </header>

      {/* HERO */}
      <main className={styles.heroWrap}>
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.badge}>
              <span className={styles.dot} />
              Únete a la revolución verde
            </div>

            <h1 className={styles.title}>
              Transforma tu <span className={styles.titleAccent}>consumo</span>,<br />
              transforma el planeta.
            </h1>

            <p className={styles.subtitle}>
              Registra tus hábitos, cumple retos diarios y gana puntos por consumir
              responsablemente. Tu pequeño cambio es nuestro gran impacto.
            </p>

            <div className={styles.ctaRow}>
              <Link className={styles.primaryBtn} href="/educacion">
                <span className={styles.btnIcon}>🍃</span>
                Educación
              </Link>

              <Link className={styles.secondaryBtn} href="/retos">
                <span className={styles.btnIcon}>◎</span>
                Retos del Día
              </Link>
            </div>

            <div className={styles.bullets}>
              <div className={styles.bulletItem}>
                <span className={styles.check}>✓</span> Gratis para siempre
              </div>
              <div className={styles.bulletItem}>
                <span className={styles.check}>✓</span> Sin anuncios
              </div>
            </div>
          </div>

          <div className={styles.heroRight} aria-hidden="true">
            {/* “Ilustración” (sin imagen) para que se parezca al mockup */}
            <div className={styles.illustration}>
              <div className={styles.illusCard}>📈</div>
              <div className={styles.illusCard}>🌱</div>
              <div className={styles.illusCard}>📊</div>
              <div className={styles.illusBlob} />
              <div className={styles.illusPerson}>🙂📱</div>
              <div className={styles.illusTree}>🌳</div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className={styles.features} id="impacto">
          <h2 className={styles.featuresTitle}>Todo lo que necesitas para mejorar</h2>
          <p className={styles.featuresSubtitle}>
            Un sistema completo diseñado para motivarte y medir tu impacto real en el medio ambiente.
          </p>

          <div className={styles.grid}>
            <FeatureCard
              icon="📊"
              title="Dashboard de Indicadores"
              desc="Visualiza tu progreso con gráficos intuitivos y métricas de impacto personalizadas."
            />
            <FeatureCard
              icon="🏆"
              title="Sistema de Puntos y Niveles"
              desc="Gamifica tu experiencia. Sube de nivel 'Semilla' a 'Árbol Milenario' cumpliendo metas."
            />
            <FeatureCard
              icon="🍃"
              title="Ranking Ecológico"
              desc="Compite amistosamente con amigos y comunidad para ver quién reduce más su huella."
            />
            <FeatureCard
              icon="🔔"
              title="Alertas Inteligentes"
              desc="Recibe recordatorios personalizados para tus hábitos de consumo y ahorro."
            />
            <FeatureCard
              icon="🎯"
              title="Metas Ambientales"
              desc="Establece objetivos mensuales de reducción de residuos, agua y energía."
            />
            <DiscoverMoreCard />
          </div>
        </section>

        {/* ANCLAS */}
        <section className={styles.anchor} id="sobre" />
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardIcon} aria-hidden="true">{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
    </article>
  );
}

function DiscoverMoreCard() {
  return (
    <article className={`${styles.card} ${styles.discoverCard}`}>
      <div className={styles.discoverInner}>
        <div className={styles.discoverArrow} aria-hidden="true">→</div>
        <h3 className={styles.cardTitle}>Descubre más</h3>
        <p className={styles.cardDesc}>Explora todas las funciones</p>
      </div>
    </article>
  );
}