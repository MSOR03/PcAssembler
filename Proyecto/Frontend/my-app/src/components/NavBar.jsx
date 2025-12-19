"use client";
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { token, logout } = useAuth();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Función para controlar la visibilidad del navbar según el scroll
  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up o cerca del top - mostrar navbar
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down y no está en el top - ocultar navbar
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // Cleanup
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  // Función para actualizar los colores del root
  const updateRootColors = (isDark) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--background', '#0a0a0a');
      root.style.setProperty('--foreground', '#ededed');
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
    }
  };

  // Inicializar el tema y la autenticación
  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode');
    // Si no hay tema guardado, establecer dark mode por defecto
    if (storedTheme === null) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      const isDark = storedTheme === 'true';
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
    updateRootColors(storedTheme === null ? true : storedTheme === 'true');
    setMounted(true);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Manejar el cambio de tema
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('darkMode', newDarkMode);
    }
    updateRootColors(newDarkMode);
  };

  // Componente para los botones de autenticación
  const AuthButtons = () => {
    if (!mounted) return null;

    if (token) {
      return (
        <div className="flex items-center space-x-4">
          <Link
            href="/perfil"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isHome 
                ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Mi Perfil
          </Link>
          <button
            onClick={handleLogout}
            className={`${
              darkMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
          >
            Cerrar Sesión
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className={`${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/register"
          className={`${
            darkMode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
        >
          Registrarse
        </Link>
      </div>
    );
  };

  // No renderizar nada hasta que el componente esté montado
  if (!mounted) {
    return null;
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isHome 
          ? 'bg-transparent backdrop-blur-sm border-b dark:border-b-0'
          : 'bg-white dark:bg-gray-900 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className={`text-xl font-bold ${
              isHome 
                ? 'text-black dark:text-white'
                : 'text-gray-900 dark:text-white'
            }`}>
              PC Assembler
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/productos" className={`px-3 py-2 rounded-md text-sm font-medium ${
              isHome 
                ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
              Productos
            </Link>
            <Link href="/armar-pc" className={`px-3 py-2 rounded-md text-sm font-medium ${
              isHome 
                ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
              Armar PC
            </Link>
            <Link href="/busqueda-avanzada" className={`px-3 py-2 rounded-md text-sm font-medium ${
              isHome 
                ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
              Búsqueda Avanzada
            </Link>
            <Link href="/contacto" className={`px-3 py-2 rounded-md text-sm font-medium ${
              isHome 
                ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
              Contacto
            </Link>
            
            <AuthButtons />
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md ${
                isHome 
                  ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                  : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Button (Mobile) */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md ${
                isHome 
                  ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                  : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isHome 
                  ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                  : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200`}
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden ${
          isHome 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
            : 'bg-white dark:bg-gray-900'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/productos" 
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
              isHome 
                ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
              Productos
            </Link>
            <Link 
              href="/armar-pc" 
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
              isHome 
                ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
              Armar PC
            </Link>
            <Link 
              href="/busqueda-avanzada" 
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
              isHome 
                ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
              Búsqueda Avanzada
            </Link>
            <Link 
              href="/contacto" 
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
              isHome 
                ? 'text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
              Contacto
            </Link>
            <div className="pt-4">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;