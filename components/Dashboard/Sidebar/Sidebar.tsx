import React from "react";
import {
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
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Sidebar({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 transform transition-all duration-300
      bg-gradient-to-b from-black via-purple-950/30 to-black
      border-r border-purple-500/20 shadow-[0_0_25px_rgba(168,85,247,0.15)]
      backdrop-blur-xl flex flex-col ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }
      md:translate-x-0 z-50`}
    >
      <div className="p-6 border-b border-purple-500/20 bg-black/20">
        <div className="flex items-center gap-3 hover:scale-105 transition-all duration-500 group">
          <Bot className="h-8 w-8 text-purple-400 group-hover:animate-pulse" />
          <span
            className="text-2xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600
            group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:via-pink-400 group-hover:to-purple-500"
          >
            Vault AI
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <button
          onClick={() => setActiveSection("home")}
          className={`w-full flex items-center gap-3 p-3 rounded-xl
            transition-all duration-300 hover:scale-[1.02] group
            ${
              activeSection === "home"
                ? "bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10"
                : "text-gray-400 hover:bg-purple-500/10 hover:text-purple-300"
            }`}
        >
          <MessagesSquare
            className={`h-5 w-5 transition-colors duration-300
            ${
              activeSection === "home"
                ? "text-purple-400"
                : "text-gray-400 group-hover:text-purple-400"
            }`}
          />
          <span className="font-medium">Chats</span>
        </button>
        <button
          onClick={() => setActiveSection("account")}
          className={`w-full flex items-center gap-3 p-3 rounded-xl
            transition-all duration-300 hover:scale-[1.02] group
            ${
              activeSection === "account"
                ? "bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10"
                : "text-gray-400 hover:bg-purple-500/10 hover:text-purple-300"
            }`}
        >
          <User
            className={`h-5 w-5 transition-colors duration-300
            ${
              activeSection === "account"
                ? "text-purple-400"
                : "text-gray-400 group-hover:text-purple-400"
            }`}
          />
          <span className="font-medium">Account</span>
        </button>
        <button
          onClick={() => setActiveSection("portfolio")}
          className={`w-full flex items-center gap-3 p-3 rounded-xl
            transition-all duration-300 hover:scale-[1.02] group
            ${
              activeSection === "portfolio"
                ? "bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10"
                : "text-gray-400 hover:bg-purple-500/10 hover:text-purple-300"
            }`}
        >
          <Briefcase
            className={`h-5 w-5 transition-colors duration-300
            ${
              activeSection === "portfolio"
                ? "text-purple-400"
                : "text-gray-400 group-hover:text-purple-400"
            }`}
          />
          <span className="font-medium">Portfolio</span>
        </button>
      </div>

      {/* Footer - positioned at bottom */}
      <div className="mt-auto border-t border-purple-500/20 bg-black/20">
        <div className="p-4 space-y-3">
          <DelegateActionButton />
          <a
            href="#"
            className="flex items-center gap-3 text-gray-400 hover:text-purple-400 p-2 
              rounded-lg transition-all duration-300 hover:bg-purple-500/10 group"
          >
            <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Follow Us</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-gray-400 hover:text-purple-400 p-2 
              rounded-lg transition-all duration-300 hover:bg-purple-500/10 group mb-2"
          >
            <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Join Discord</span>
          </a>
        </div>
      </div>
    </div>
  );
}
