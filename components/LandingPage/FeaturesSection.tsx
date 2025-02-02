import React from 'react';
import { Bot, Wallet, LineChart, Zap, Shield, Compass } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="space-y-4 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Everything you need to manage your DeFi portfolio with confidence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Wallet />}
          title="Smart Portfolio"
          description="Track your token holdings and volatility with real-time analytics"
        />
        <FeatureCard 
          icon={<LineChart />}
          title="DeFi Credit Score"
          description="Get rated based on your on-chain DeFi activity and history"
        />
        <FeatureCard 
          icon={<Zap />}
          title="Natural Language Trading"
          description="Swap and stake tokens through simple conversation"
        />
        <FeatureCard 
          icon={<Shield />}
          title="Automated Protection"
          description="Set smart stop-loss orders to protect your investments"
        />
        <FeatureCard 
          icon={<Compass />}
          title="Gas Optimization"
          description="Real-time notifications for optimal gas prices"
        />
        <FeatureCard 
          icon={<Bot />}
          title="AI-Powered"
          description="Advanced algorithms for optimal trading strategies"
        />
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:scale-105">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative space-y-4">
        <div className="inline-block p-3 rounded-lg bg-purple-500/10">
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}