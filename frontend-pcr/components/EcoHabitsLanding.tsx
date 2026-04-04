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
} from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

// ── Tipos ────────────────────────────────────────────
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}

// ── Componente principal ─────────────────────────────
export default function EcoHabitsLanding() {
  const { usuario, logout } = useAuth();

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

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/40 h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">

          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              PCR{" "}
              <span className="text-primary hidden sm:inline">
                – Consumo Responsable
              </span>
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

            {usuario ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                    {usuario.nombres?.[0]}
                  </div>
                  <span className="font-medium text-primary">
                    {usuario.nombres}
                  </span>
                </div>
                <Button variant="outline" onClick={logout} className="ml-2">
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Únete a la revolución verde
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              >
                Transforma tu{" "}
                <span className="text-primary relative inline-block">
                  consumo
                </span>
                ,<br />
                transforma el planeta.
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Registra tus hábitos y gana puntos por consumir responsablemente.
              </motion.p>
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
              />
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="container mx-auto px-4 py-20 bg-secondary/30 rounded-3xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BarChart3 />}
              title="Dashboard"
              description="Visualiza tu progreso."
              color="bg-primary/10"
            />
            <FeatureCard
              icon={<Trophy />}
              title="Puntos"
              description="Sube de nivel."
              color="bg-secondary/60"
            />
            <FeatureCard
              icon={<Leaf />}
              title="Ranking"
              description="Compite con otros."
              color="bg-primary/10"
            />
          </div>
        </section>

      </main>
    </div>
  );
}

// ── FeatureCard ──────────────────────────────────────
function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <Card>
      <CardContent>
        <div className={`h-14 w-14 ${color}`}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}