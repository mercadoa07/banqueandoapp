import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Banqueando
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
              Inicio
            </Link>
            <a href="#como-funciona" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
              Cómo Funciona
            </a>
            <a href="#beneficios" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
              Beneficios
            </a>
            <Link 
              to="/quiz" 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all"
            >
              Empezar Quiz
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link 
              to="/quiz" 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm"
            >
              Quiz
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;