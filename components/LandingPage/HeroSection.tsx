"use client";

import { useEffect, useState } from "react";

import { LoginButton } from "./LoginButton";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className={`space-y-8 max-w-3xl text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Your AI-Powered DeFi Agent
        </h1>
        <p className="text-xl md:text-2xl text-gray-400">
          Manage your crypto portfolio, stake, swap and more with Vault AI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LoginButton />
        </div>
      </div>
    </section>
  );
}
