'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <div className={`space-y-8 max-w-3xl transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Your AI-Powered DeFi Assistant
        </h1>
        <p className="text-xl md:text-2xl text-gray-400">
          Manage your crypto portfolio, optimize trades, and maximize returns with advanced AI technology
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all hover:scale-105 flex items-center justify-center gap-2">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 rounded-lg border border-purple-600/50 hover:bg-purple-600/10 transition-all">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
}