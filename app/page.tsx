'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated background gradient */}
        <div 
          className="fixed inset-0 bg-gradient-to-br from-purple-900/20 to-black"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_50%,#3b0764,transparent)]" />
        </div>

        {/* Grid pattern */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_70%,transparent_100%)]" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <HeroSection />
          <FeaturesSection />
          <HowItWorks />
        </div>

        {/* Cursor gradient follow effect - reduced brightness */}
        <div
          className="pointer-events-none fixed inset-0 z-30 transition-transform duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,102,241,0.08), transparent 80%)`,
          }}
        />
      </main>
      <Footer />
    </>
  );
}