"use client";

import React, { useState } from 'react';
import { Beef as Bee, TrendingUp, Wallet2, BookOpen, ArrowRight, SunMedium, MonitorDot, LogIn, Twitter, MessageSquare, ChevronDown, User, Briefcase, X } from 'lucide-react';

function Dashboard() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Open AI');
  const [activeSection, setActiveSection] = useState('home');

  const models = ['Open AI', 'Claude', 'Gemini', 'Llama 2'];

  const accountData = {
    userId: "vault_28947",
    name: "Alex Thompson",
    email: "alex@vaultai.io",
    walletAddress: "7X6jY9...3Kpq",
    twitter: "@alexvault",
    discord: "alex.vault#1234",
    joinDate: "March 2024",
    tier: "Pro"
  };

  const portfolioData = {
    totalValue: "$124,532.45",
    assets: [
      { name: "Solana", amount: "245.32 SOL", value: "$42,123.04", change: "+12.4%" },
      { name: "Jupiter", amount: "1,245 JUP", value: "$8,715.00", change: "-2.3%" },
      { name: "USDC", amount: "15,000 USDC", value: "$15,000.00", change: "0%" },
      { name: "Marinade", amount: "158.45 mSOL", value: "$28,521.00", change: "+8.7%" }
    ],
    recentTransactions: [
      { type: "Swap", from: "SOL", to: "USDC", amount: "12.5 SOL", date: "2h ago" },
      { type: "Stake", token: "SOL", amount: "50 SOL", date: "1d ago" },
      { type: "Unstake", token: "mSOL", amount: "25 mSOL", date: "3d ago" }
    ]
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6">Account Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">User ID</p>
                <p className="font-medium">{accountData.userId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Name</p>
                <p className="font-medium">{accountData.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium">{accountData.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Wallet</p>
                <p className="font-medium">{accountData.walletAddress}</p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 mt-6">
              <h3 className="text-xl font-medium mb-4">Social Connections</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Twitter</p>
                  <p className="font-medium">{accountData.twitter}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Discord</p>
                  <p className="font-medium">{accountData.discord}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 mt-6">
              <h3 className="text-xl font-medium mb-4">Membership</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Join Date</p>
                  <p className="font-medium">{accountData.joinDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Tier</p>
                  <p className="font-medium text-purple-400">{accountData.tier}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6">Portfolio Overview</h2>
            
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-gray-400 mb-1">Total Portfolio Value</p>
              <p className="text-3xl font-semibold gradient-text">{portfolioData.totalValue}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">Assets</h3>
              <div className="space-y-3">
                {portfolioData.assets.map((asset, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-xl backdrop-blur-sm flex items-center justify-between">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-gray-400">{asset.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{asset.value}</p>
                      <p className={`text-sm ${
                        asset.change.startsWith('+') 
                          ? 'text-green-400' 
                          : asset.change.startsWith('-') 
                            ? 'text-red-400' 
                            : 'text-gray-400'
                      }`}>
                        {asset.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {portfolioData.recentTransactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                    <div>
                      <p className="font-medium">
                        {tx.type === 'Swap' 
                          ? `${tx.from} → ${tx.to}`
                          : `${tx.type} ${tx.token}`
                        }
                      </p>
                      <p className="text-sm text-gray-400">{tx.amount}</p>
                    </div>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
            <Bee className="h-16 w-16 text-purple-400 mb-6" />
            <h1 className="text-4xl font-semibold mb-2 gradient-text">
              Your AI-Powered DeFi Agent
            </h1>
            <p className="text-gray-400 mb-8 text-lg">
              Manage your crypto portfolio, stake, swap and more with Vault AI
            </p>

            {/* Search Input */}
            <div className="w-full max-w-xl mb-8 relative">
              <input
                type="text"
                placeholder="Ask anything..."
                className="w-full bg-white/5 border border-gray-700 rounded-lg py-3 px-4 pr-32 focus:outline-none focus:border-purple-500 backdrop-blur-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setIsModelOpen(!isModelOpen)}
                    className="text-purple-400 flex items-center gap-1 hover:bg-white/5 py-1 px-2 rounded"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    {selectedModel}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {isModelOpen && (
                    <div className="absolute right-0 mt-1 w-36 bg-gray-800/90 border border-gray-700 rounded-lg shadow-lg py-1 backdrop-blur-sm z-10">
                      {models.map((model) => (
                        <button
                          key={model}
                          className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-gray-200"
                          onClick={() => {
                            setSelectedModel(model);
                            setIsModelOpen(false);
                          }}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              <button className="p-4 bg-white/5 border border-gray-700 rounded-lg hover:bg-white/10 text-left backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">Trending</span>
                </div>
                <p className="text-sm text-gray-400">Search the trending tokens</p>
              </button>

              <button className="p-4 bg-white/5 border border-gray-700 rounded-lg hover:bg-white/10 text-left backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet2 className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">Stake</span>
                </div>
                <p className="text-sm text-gray-400">Stake Sol</p>
              </button>

              <button className="p-4 bg-white/5 border border-gray-700 rounded-lg hover:bg-white/10 text-left backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">Trade</span>
                </div>
                <p className="text-sm text-gray-400">Swap on Jupiter</p>
              </button>

              <button className="p-4 bg-white/5 border border-gray-700 rounded-lg hover:bg-white/10 text-left backdrop-blur-sm transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">SIP</span>
                </div>
                <p className="text-sm text-gray-400">Get developer docs for protocols</p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-gray-200">
      {/* Sidebar */}
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
            <span>Chats</span>
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

      {/* Main Content */}
      <div className="pl-64">
        <div className="p-8">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;