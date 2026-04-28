"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import {
  Leaf,
  BarChart3,
  Trophy,
  Menu,
  Bell,
  Target,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  href?: string;
}

export default function EcoHabitsLanding() {
  const { usuario, logout } = useAuth();

  const irAFormulario = (modo: "login" | "registro") => {
    window.dispatchEvent(new CustomEvent("cambiar-auth", { detail: modo }));

    setTimeout(() => {
      document.getElementById("registro-login")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] font-sans selection:bg-primary/20">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/40 h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-emerald-100 p-2 rounded-full group-hover:bg-emerald-200 transition-colors">
              <Leaf className="h-5 w-5 text-emerald-600" />
            </div>

            <span className="font-bold text-xl tracking-tight text-[#0f3b2f]">
              EcoTrack
              <span className="text-emerald-600 hidden sm:inline">
                {" "}– Consumo Responsable
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-emerald-600"
            >
              Sobre nosotros
            </Button>

            <Button
              variant="ghost"
              className="text-slate-600 hover:text-emerald-600"
            >
              Impacto
            </Button>

            <div className="w-px h-6 bg-slate-200 mx-2" />

            {usuario ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                    {usuario.nombres?.[0] || "U"}
                  </div>

                  <span className="font-medium text-emerald-700">
                    {usuario.nombres}
                  </span>
                </div>

                <Button variant="outline" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="font-medium"
                  onClick={() => irAFormulario("login")}
                >
                  Login
                </Button>

                <Button
                  className="font-bold rounded-full px-6 bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => irAFormulario("registro")}
                >
                  Registrarse
                </Button>
              </>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* HERO */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                Únete a la revolución verde
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#0f3b2f]"
              >
                Transforma tu{" "}
                <span className="text-emerald-600">consumo</span>,
                <br />
                transforma el planeta.
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-[#5f786d] max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Registra tus hábitos, monitorea tu consumo de agua, energía y
                gas, y gana puntos por consumir responsablemente.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/dashboard">
                  <Button className="rounded-full px-8 py-6 bg-emerald-600 text-white hover:bg-emerald-700 font-bold">
                    Ir al Dashboard
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6 font-bold"
                  onClick={() => irAFormulario("registro")}
                >
                  Crear cuenta
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex items-center justify-center"
            >
              <Image
                src="/hero-illustration.png"
                alt="Consumo Responsable"
                width={600}
                height={600}
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="container mx-auto px-4">
          <div className="rounded-[32px] bg-[#ebe9e6] p-4 md:p-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f3b2f] mb-4">
                Todo lo que necesitas para mejorar
              </h2>

              <p className="text-[#5f786d] text-lg">
                Un sistema completo diseñado para motivarte y medir tu impacto
                real en el medio ambiente.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                href="/dashboard"
                icon={<BarChart3 className="h-8 w-8 text-emerald-600" />}
                title="Dashboard de Indicadores"
                description="Visualiza tu progreso con gráficos intuitivos y métricas de impacto personalizadas."
                color="bg-emerald-100"
              />

              <FeatureCard
                icon={<Trophy className="h-8 w-8 text-yellow-600" />}
                title="Sistema de Puntos y Niveles"
                description="Gamifica tu experiencia. Sube de nivel de ‘Semilla’ a ‘Árbol Milenario’ cumpliendo metas."
                color="bg-yellow-100"
              />

              <FeatureCard
                icon={<Leaf className="h-8 w-8 text-emerald-600" />}
                title="Ranking Ecológico"
                description="Compite amistosamente con amigos y comunidad para ver quién reduce más su huella."
                color="bg-emerald-100"
              />

              <FeatureCard
                icon={<Bell className="h-8 w-8 text-cyan-600" />}
                title="Alertas Inteligentes"
                description="Recibe recordatorios personalizados para tus hábitos de consumo y ahorro."
                color="bg-cyan-100"
              />

              <FeatureCard
                icon={<Target className="h-8 w-8 text-purple-600" />}
                title="Metas Ambientales"
                description="Establece objetivos mensuales de reducción de residuos, agua, gas y energía."
                color="bg-purple-100"
              />

              <Card className="min-h-[300px] rounded-[28px] border-2 border-dashed border-emerald-200 bg-[#f9faf8] flex items-center justify-center hover:border-emerald-400 transition cursor-pointer group">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-[72px] w-[72px] rounded-[22px] bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ArrowRight className="h-8 w-8 text-emerald-700" />
                  </div>

                  <h3 className="text-[22px] font-bold text-[#0f3b2f] mb-3">
                    Descubre más
                  </h3>

                  <p className="text-[17px] text-[#5f786d]">
                    Explora todas las funciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  href,
}: FeatureCardProps) {
  const content = (
    <Card className="min-h-[300px] rounded-[28px] border border-[#d8ddd7] bg-[#f9faf8] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <CardContent className="p-8">
        <div
          className={`h-[72px] w-[72px] rounded-[22px] ${color} flex items-center justify-center mb-6`}
        >
          {icon}
        </div>

        <h3 className="text-[22px] font-bold leading-tight text-[#0f3b2f] mb-4">
          {title}
        </h3>

        <p className="text-[17px] leading-relaxed text-[#5f786d]">
          {description}
        </p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}