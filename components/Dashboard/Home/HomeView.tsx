import React from "react";
import {
  Beef as Bee,
  TrendingUp,
  Wallet2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { ActionCard } from "./ActionCard";

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
  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
      <Bee className="h-16 w-16 text-purple-400 mb-6" />
      <h1 className="text-4xl font-semibold mb-2 gradient-text text-center">
        Your AI-Powered DeFi Agent
      </h1>
      <p className="text-gray-400 mb-8 text-lg text-center">
        Manage your crypto portfolio, stake, swap and more with Vault AI
      </p>

      <div className="w-full max-w-xl mb-8 relative">
        <input
          type="text"
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
          />
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        <ActionCard
          icon={TrendingUp}
          title="Trending"
          description="Search the trending tokens"
        />
        <ActionCard icon={Wallet2} title="Stake" description="Stake Tokens" />
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
  );
}
