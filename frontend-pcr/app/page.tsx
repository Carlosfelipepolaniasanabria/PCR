"use client";
import { useState } from "react";
import HomeContent from "./page/ContenidoPrincipal/ContenidoPrincipal";

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
          <a className="nav-link text-white d-inline" href="#registro">
            Registro
          </a>
        </div>
      </div>
    </nav>
    
    <HomeContent />
    </>
  );
}