import React, { useState } from "react";
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
  isSidebarOpen: boolean; // New prop to track sidebar visibility
  setIsSidebarOpen: (isOpen: boolean) => void; // New prop to control sidebar visibility
}

export function Sidebar({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-purple-500/10 rounded-lg md:hidden"
      >
        <Menu className="h-6 w-6 text-purple-400" />
      </button>
      <div
        className={`fixed left-0 top-0 h-full w-64 sidebar-gradient backdrop-blur-xl border-r border-gray-800/50 p-4 flex flex-col animate-fadeIn transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-2 mb-8 hover:scale-105 transition-transform">
          <Bee className="h-6 w-6 text-purple-400" />
          <span className="text-xl font-semibold gradient-text">Vault AI</span>
          <div className="ml-auto flex gap-2"></div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setActiveSection("home")}
            className="w-full flex items-center justify-between text-purple-400 hover:text-purple-300 p-2 rounded-lg transition-all duration-300 hover:bg-purple-500/10 card-hover"
          >
            <span>Chats</span>
          </button>
        </div>

        <div className="space-y-2">
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
    </>
  );
}