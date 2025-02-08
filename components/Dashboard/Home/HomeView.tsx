"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Wallet2,
  BookOpen,
  ArrowRight,
  Mic,
  Loader2,
  Bot,
} from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { ActionCard } from "./ActionCard";
import { LogoutButton } from "../Buttons/LogoutButton";
import { ChatInterface } from "./ChatInterface";
import { NotificationButton } from "../Buttons/NotificationButton";
import { useSpeechToText } from "../../../hooks/useSpeechToText";
import style from "styled-jsx/style";
import { FundWallet } from "../FundWallet/FundWallet";

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
  const [chatKey, setChatKey] = useState(0);
  const { isListening, startListening } = useSpeechToText();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isModelOpen) {
      setShowChat(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSpeechInput = (text: string) => {
    setInputValue(text);
  };

  const handleNewChat = () => {
    setChatKey((prev) => prev + 1);
    setInputValue("");
  };

  return (
    <div className="flex flex-col justify-center h-full relative bg-gradient-to-b from-black via-purple-950/20 to-black min-h-screen">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern"></div>
      <div
        className={`flex-1 transition-all duration-500 relative z-10 ${
          showChat ? "opacity-0 scale-95 h-0" : "opacity-100 scale-100"
        }`}
      >
        <div className="absolute top-6 right-6 flex items-center gap-4 animate-fadeIn">
          <FundWallet />
          <LogoutButton />
          <NotificationButton />
        </div>
        <div
          className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto pt-16 pb-8 animate-slideUp"
          style={{ paddingTop: "15px" }}
        >
          <Bot className="w-10 h-10 text-purple-400 animate-pulse" />
          <h1 className="text-4xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center">
            Your AI-Powered DeFi Agent
          </h1>
          <p className="text-gray-400 mb-8 text-lg z-0 text-center">
            Manage your crypto portfolio, stake, swap and more with Vault AI
          </p>
          <div className="w-full max-w-xl mb-8 relative z-50">
            <form
              onSubmit={handleSubmit}
              className="glass-effect rounded-lg p-1"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Ask anything..."}
                className="w-full bg-white/5 border border-gray-700 rounded-lg py-3 px-4 pr-40 focus:outline-none focus:border-purple-500 backdrop-blur-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-50">
                <button
                  type="button"
                  onClick={() => startListening(handleSpeechInput)}
                  className={`p-2 rounded-lg transition-all ${
                    isListening
                      ? "bg-purple-500/20 text-purple-400 animate-pulse"
                      : "text-gray-400 hover:text-purple-400"
                  }`}
                >
                  {isListening ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
                <ModelSelector
                  selectedModel={selectedModel}
                  isModelOpen={isModelOpen}
                  setIsModelOpen={setIsModelOpen}
                  setSelectedModel={setSelectedModel}
                  models={models}
                  direction="down"
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
        <div className="animate-fadeIn relative z-10">
          <ChatInterface
            key={chatKey}
            initialMessage={inputValue}
            selectedModel={selectedModel}
            onClose={() => setShowChat(false)}
            models={models}
            setSelectedModel={setSelectedModel}
            onNewChat={handleNewChat}
          />
        </div>
      )}
    </div>
  );
}
