import React, { useState } from "react";
import {
  Beef as Bee,
  TrendingUp,
  Wallet2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { ActionCard } from "./ActionCard";
import { LogoutButton } from "../Buttons/LogoutButton";
import { ChatInterface } from "./ChatInterface"; // New component to be created
import { NotificationButton } from '../Buttons/NotificationButton';

interface HomeViewProps {
  selectedModel: string;
  isModelOpen: boolean;
  setIsModelOpen: (isOpen: boolean) => void;
  setSelectedModel: (model: string) => void;
  models: string[];
}

export function HomeView({
  selectedModel,
  isModelOpen,
  setIsModelOpen,
  setSelectedModel,
  models,
}: HomeViewProps) {
  const [inputValue, setInputValue] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isModelOpen) {
      // Only trigger if model selector is not open
      setShowChat(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="justify-center h-full relative gradient-bg">
      <div
        className={`flex-1 transition-all duration-500 ${
          showChat ? "opacity-0 scale-95 h-0" : "opacity-100 scale-100"
        }`}
      >
        <div className="absolute top-6 right-6 flex items-center gap-4 animate-fadeIn">
          <NotificationButton />
          <LogoutButton />
        </div>
        <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto pt-16 pb-8 animate-slideUp">
          <Bee className="h-16 w-16 text-purple-400 mb-6 animate-pulse-slow" />
          <h1 className="text-4xl font-semibold mb-2 gradient-text text-center">
            Your AI-Powered DeFi Agent
          </h1>
          <p className="text-gray-400 mb-8 text-lg text-center">
            Manage your crypto portfolio, stake, swap and more with Vault AI
          </p>
          <div className="w-full max-w-xl mb-8 relative">
            <form onSubmit={handleSubmit} className="glass-effect rounded-lg p-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="w-full bg-white/5 border border-gray-700 rounded-lg py-3 px-4 pr-32 focus:outline-none focus:border-purple-500 backdrop-blur-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-50">
                <ModelSelector
                  selectedModel={selectedModel}
                  isModelOpen={isModelOpen}
                  setIsModelOpen={setIsModelOpen}
                  setSelectedModel={setSelectedModel}
                  models={models}
                  direction="down" // Optional since it's the default
                />
                <button type="submit">
                  <ArrowRight className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors" />
                </button>
              </div>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
            <ActionCard
              icon={TrendingUp}
              title="Trending"
              description="Search the trending tokens"
            />
            <ActionCard
              icon={Wallet2}
              title="Stake"
              description="Stake Tokens"
            />
            <ActionCard
              icon={TrendingUp}
              title="Trade"
              description="Swap on Base"
            />
            <ActionCard
              icon={BookOpen}
              title="SIP"
              description="Get high yield generating protocols"
            />
          </div>
        </div>
      </div>
      {showChat && (
        <div className="animate-fadeIn">
          <ChatInterface
            initialMessage={inputValue}
            selectedModel={selectedModel}
            onClose={() => setShowChat(false)}
            models={models}
            setSelectedModel={setSelectedModel}
          />
        </div>
      )}
    </div>
  );
}
