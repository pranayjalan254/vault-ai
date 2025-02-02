'use client';

import { useState, useEffect } from 'react';
import { Bot, Menu, X } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Vault AI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How it Works</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors">
              Launch App
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <NavLink href="#features" mobile>Features</NavLink>
            <NavLink href="#how-it-works" mobile>How it Works</NavLink>
            <NavLink href="#pricing" mobile>Pricing</NavLink>
            <button className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors">
              Launch App
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-gray-300 hover:text-white transition-colors ${
        mobile ? 'block' : ''
      }`}
    >
      {children}
    </Link>
  );
}