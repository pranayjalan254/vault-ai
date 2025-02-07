import React from "react";
import {
  Beef as Bee,
  SunMedium,
  MonitorDot,
  Twitter,
  MessageSquare,
  User,
  Briefcase,
  MessagesSquare,
  Bot,
} from "lucide-react";
import { DelegateActionButton } from "../Buttons/DelegateButton";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 sidebar-gradient backdrop-blur-xl border-r border-gray-800/50 p-4 flex flex-col animate-fadeIn">
      <div className="flex items-center gap-2 mb-8 hover:scale-105 transition-transform">
        <Bot className="w-10 h-10 text-purple-500" />
        <span className="text-xl font-semibold gradient-text">Vault AI</span>
        <div className="ml-auto flex gap-2"></div>
      </div>

      <div className="space-y-2 mt-4">
        <button
          onClick={() => setActiveSection("home")}
          className={`w-full flex items-center gap-2 text-gray-300 hover:bg-white/5 p-2 rounded-lg transition-colors ${
            activeSection === "account" ? "bg-white/10" : ""
          }`}
        >
          <MessagesSquare className="h-5 w-5" />
          <span>Chats</span>
        </button>
        <button
          onClick={() => setActiveSection("account")}
          className={`w-full flex items-center gap-2 text-gray-300 hover:bg-white/5 p-2 rounded-lg transition-colors ${
            activeSection === "account" ? "bg-white/10" : ""
          }`}
        >
          <User className="h-5 w-5" />
          <span>Account</span>
        </button>

        <button
          onClick={() => setActiveSection("portfolio")}
          className={`w-full flex items-center gap-2 text-gray-300 hover:bg-white/5 p-2 rounded-lg transition-colors ${
            activeSection === "portfolio" ? "bg-white/10" : ""
          }`}
        >
          <Briefcase className="h-5 w-5" />
          <span>Portfolio</span>
        </button>
      </div>
      {/* Footer Section */}
      <div className="mt-auto">
        <DelegateActionButton />

        <div className="mt-4 space-y-2">
          <a
            href="#"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 py-2 transition-colors"
          >
            <Twitter className="h-5 w-5" />
            Follow Us
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 py-2 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            Join Discord
          </a>
        </div>
      </div>
    </div>
  );
}
