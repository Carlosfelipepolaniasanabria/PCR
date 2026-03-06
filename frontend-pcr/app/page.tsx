/* "use client";
import { useState } from "react";
import HomeContent from "./page/RegistroYLogin/RegistroYLogin";
import ContenidoPrincipal from "./page/ContenidoPrincipal/ContenidoPrincipal";

export default function Home() {

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">PCR</a>
          <div>
            <a className="nav-link text-white d-inline me-3" href="#login">
              Login
            </a>
            <a className="nav-liAnk text-white d-inline">
              Registro
            </a>
          </div>
        </div>
      </nav>

      <ContenidoPrincipal />

      <HomeContent />
    </>
  );
} 

 */

"use client";

import EcoHabitsLanding from "@/components/EcoHabitsLanding";
import HomeContent from "./page/RegistroYLogin/RegistroYLogin";

export default function Home() {
  return (
    <>
    <EcoHabitsLanding />
    <HomeContent />

    </>
  );
}