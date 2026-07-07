'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock data - Será reemplazado por datos del CMS (SiteSettings global)
  const siteName = "Rocío Domínguez";
  const navLinks = [
    { label: "Sobre Mí", href: "#about" },
    { label: "Servicios", href: "#services" },
    { label: "Logros", href: "#achievements" },
    { label: "Testimonios", href: "#testimonials" },
    { label: "Contacto", href: "#contact" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-slate-900/95 dark:bg-black/95 backdrop-blur-md border-b border-primary-400/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white hover:text-primary-400 transition-colors">
              {siteName}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-primary-400 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/register"
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
            >
              Agenda Consulta
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-primary-400 transition-colors"
          >
            <svg
              className={`w-6 h-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800/95 border-t border-primary-400/20">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-primary-400 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-primary-400/20">
              <Link
                href="/register"
                className="block bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-2 px-4 rounded-lg text-center transition-all duration-300"
              >
                Agenda Consulta
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
