import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Building2, ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Banqueando" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Banqueando
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
              Inicio
            </Link>
            
            {/* Dropdown de Productos */}
            <div 
              className="relative"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button 
                className="flex items-center text-gray-700 hover:text-cyan-600 font-medium transition-colors"
                onClick={() => setIsProductsOpen(!isProductsOpen)}
              >
                Productos
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isProductsOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <Link 
                    to="/quiz"
                    className="flex items-center px-4 py-3 hover:bg-cyan-50 transition-colors group"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    <div className="bg-cyan-100 p-2 rounded-lg mr-3 group-hover:bg-cyan-200 transition-colors">
                      <CreditCard className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Tarjetas de Crédito</p>
                      <p className="text-sm text-gray-500">Para uso personal</p>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/quiz"
                    className="flex items-center px-4 py-3 hover:bg-purple-50 transition-colors group"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    <div className="bg-purple-100 p-2 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Crédito</p>
                      <p className="text-sm text-gray-500">Para ti o tu negocio</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
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
          <div className="md:hidden flex items-center space-x-3">
            <Link 
              to="/quiz" 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm"
            >
              Quiz
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-cyan-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-2">
              <Link 
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 rounded-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              
              {/* Mobile Products Section */}
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Productos</p>
                <Link 
                  to="/quiz"
                  className="flex items-center py-2 text-gray-700 hover:text-cyan-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CreditCard className="w-5 h-5 mr-3 text-cyan-600" />
                  <span>Tarjetas de Crédito</span>
                </Link>
                <Link 
                  to="/quiz"
                  className="flex items-center py-2 text-gray-700 hover:text-purple-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Building2 className="w-5 h-5 mr-3 text-purple-600" />
                  <span>Crédito</span>
                </Link>
              </div>
              
              <a 
                href="#como-funciona"
                className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 rounded-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cómo Funciona
              </a>
              <a 
                href="#beneficios"
                className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 rounded-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Beneficios
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
