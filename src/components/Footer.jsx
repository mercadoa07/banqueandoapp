import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Banqueando</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Encuentra la tarjeta de crédito perfecta para ti. Comparamos todas las opciones del mercado para que tomes la mejor decisión financiera.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4">Producto</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/quiz" className="text-gray-400 hover:text-white transition-colors">
                  Quiz Inteligente
                </Link>
              </li>
              <li>
                <a href="#como-funciona" className="text-gray-400 hover:text-white transition-colors">
                  Cómo Funciona
                </a>
              </li>
              <li>
                <a href="#beneficios" className="text-gray-400 hover:text-white transition-colors">
                  Beneficios
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Banqueando. Todos los derechos reservados.</p>
          <p className="mt-2">Comparador independiente de tarjetas de crédito en Colombia 🇨🇴</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;