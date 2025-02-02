import React from 'react';
import { Terminal, MessageSquare, BarChart3, Sparkles } from 'lucide-react';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="space-y-4 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Simple steps to optimize your DeFi experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Step
          icon={<Terminal />}
          number={1}
          title="Connect Wallet"
          description="Securely connect your wallet to get started"
        />
        <Step
          icon={<MessageSquare />}
          number={2}
          title="Chat with AI"
          description="Tell Vault AI what you want to achieve"
        />
        <Step
          icon={<BarChart3 />}
          number={3}
          title="Get Analysis"
          description="Receive detailed analysis and recommendations"
        />
        <Step
          icon={<Sparkles />}
          number={4}
          title="Execute Actions"
          description="Automatically execute optimized trades"
        />
      </div>
    </section>
  );
}

function Step({ icon, number, title, description }: { 
  icon: React.ReactNode; 
  number: number; 
  title: string; 
  description: string;
}) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-75 group-hover:opacity-100 transition-opacity blur" />
      <div className="relative p-6 space-y-4 bg-black rounded-lg border border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-500/10">
            {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
          </div>
          <span className="text-2xl font-bold text-purple-400">0{number}</span>
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}