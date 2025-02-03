import React from 'react';
import { Beef as Bee, SunMedium, MonitorDot, LogIn, Twitter, MessageSquare, User, Briefcase } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 border-r border-gray-800/50 p-4 flex flex-col backdrop-blur-sm bg-black/20">
      <div className="flex items-center gap-2 mb-8">
        <Bee className="h-6 w-6 text-purple-400" />
        <span className="text-xl font-semibold gradient-text">Vault AI</span>
        <div className="ml-auto flex gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <SunMedium className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <MonitorDot className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-purple-400 mb-2">
          <button 
            onClick={() => setActiveSection('home')}
            className="hover:text-purple-300 transition-colors"
          >
            Chats
          </button>
          <button className="p-1 hover:bg-white/5 rounded transition-colors">+</button>
        </div>
      </div>

      <div className="space-y-2">
        <button 
          onClick={() => setActiveSection('account')}
          className={`w-full flex items-center gap-2 text-gray-300 hover:bg-white/5 p-2 rounded-lg transition-colors ${activeSection === 'account' ? 'bg-white/10' : ''}`}
        >
          <User className="h-5 w-5" />
          <span>Account</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('portfolio')}
          className={`w-full flex items-center gap-2 text-gray-300 hover:bg-white/5 p-2 rounded-lg transition-colors ${activeSection === 'portfolio' ? 'bg-white/10' : ''}`}
        >
          <Briefcase className="h-5 w-5" />
          <span>Portfolio</span>
        </button>
      </div>

      <div className="mt-auto">
        <button className="w-full py-2 px-4 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500/10 flex items-center justify-center gap-2 transition-colors">
          <LogIn className="h-5 w-5" />
          Log in
        </button>

        <div className="mt-4 space-y-2">
          <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-gray-300 py-2 transition-colors">
            <Twitter className="h-5 w-5" />
            Follow Us
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-gray-300 py-2 transition-colors">
            <MessageSquare className="h-5 w-5" />
            Join Discord
          </a>
        </div>
      </div>
    </div>
  );
}