"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import {
  Leaf,
  BarChart3,
  Trophy,
  Bell,
  Target,
  ArrowRight,
  Menu,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function EcoHabitsLanding() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/40 h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              PCR <span className="text-primary hidden sm:inline">– Consumo Responsable</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              Sobre nosotros
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              Impacto
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Link href="/login">
              <Button variant="ghost" className="font-medium">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="font-bold rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                Registrarse
              </Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Únete a la revolución verde
              </motion.div>

              <motion.h1 variants={fadeIn} className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Transforma tu{" "}
                <span className="text-primary relative inline-block">
                  consumo
                  <svg className="absolute w-full h-3 bottom-1 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
                ,<br />
                transforma el planeta.
              </motion.h1>

              <motion.p variants={fadeIn} className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Registra tus hábitos, cumple retos diarios y gana puntos por consumir responsablemente. Tu pequeño cambio es nuestro gran impacto.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg h-14 px-8 rounded-full shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-transform">
                  <Leaf className="mr-2 h-5 w-5" /> Educación
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-2 hover:bg-secondary/50">
                  <Target className="mr-2 h-5 w-5 text-primary" /> Retos del Día
                </Button>
              </motion.div>

              <motion.div variants={fadeIn} className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Gratis para siempre</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Sin anuncios</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:h-[600px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
              <Image
                src="/hero-illustration.png"
                alt="Consumo Responsable Illustration"
                width={600}
                height={600}
                className="relative z-10 w-full max-w-[600px] drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20 bg-secondary/30 rounded-3xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Todo lo que necesitas para mejorar</h2>
            <p className="text-muted-foreground text-lg">
              Un sistema completo diseñado para motivarte y medir tu impacto real en el medio ambiente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<BarChart3 className="h-8 w-8 text-[hsl(var(--chart-1))]" />} title="Dashboard de Indicadores"
              description="Visualiza tu progreso con gráficos intuitivos y métricas de impacto personalizadas." color="bg-primary/10" />
            <FeatureCard icon={<Trophy className="h-8 w-8 text-[hsl(var(--chart-2))]" />} title="Sistema de Puntos y Niveles"
              description="Gamifica tu experiencia. Sube de nivel 'Semilla' a 'Árbol Milenario' cumpliendo metas." color="bg-secondary/60" />
            <FeatureCard icon={<Leaf className="h-8 w-8 text-primary" />} title="Ranking Ecológico"
              description="Compite amistosamente con amigos y comunidad para ver quién reduce más su huella." color="bg-primary/10" />
            <FeatureCard icon={<Bell className="h-8 w-8 text-[hsl(var(--chart-3))]" />} title="Alertas Inteligentes"
              description="Recibe recordatorios personalizados para tus hábitos de consumo y ahorro." color="bg-muted" />
            <FeatureCard icon={<Target className="h-8 w-8 text-[hsl(var(--chart-4))]" />} title="Metas Ambientales"
              description="Establece objetivos mensuales de reducción de residuos, agua y energía." color="bg-muted" />

            <Card className="border-2 border-dashed border-border bg-transparent flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center pt-8">
                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">Descubre más</h3>
                <p className="text-sm text-muted-foreground">Explora todas las funciones</p>
              </CardContent>
            </Card>
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card className="border-border/60 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-shadow">
      <CardContent className="p-6 pt-8">
        <div className={`h-14 w-14 rounded-2xl ${color} flex items-center justify-center mb-5`}>
          {icon}
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}