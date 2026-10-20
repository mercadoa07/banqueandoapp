import React from 'react';
import { Link } from 'react-router-dom';

// Logo de Banqueando: el símbolo y el nombre con su degradado, tal cual el original.
// Se usa igual en la barra y en el pie (ambos sobre fondo claro) para que la marca no cambie.
export default function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Banqueando, inicio">
      <img src="/logo.png" alt="" className="h-10 w-10 object-contain" />
      <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
        Banqueando
      </span>
    </Link>
  );
}
