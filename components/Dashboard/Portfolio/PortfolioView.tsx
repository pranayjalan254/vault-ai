import React, { useEffect, useState } from "react";
import { useWallets, usePrivy, useUser } from "@privy-io/react-auth";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ChainType, PortfolioResponse } from "../../../types/portfolio";
import {
  fetchPortfolio,
  fetchAllChainPortfolio,
  SUPPORTED_CHAINS,
} from "../../../lib/api/portfolio";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FundWallet } from "../FundWallet/FundWallet";
import { LogoutButton } from "../Buttons/LogoutButton";
import { NotificationButton } from "../Buttons/NotificationButton";
import { PortfolioLoadingSkeleton } from "./LoadingSkeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

interface GroupedToken {
  symbol: string;
  token: string;
  logoUrl: string;
  totalValue: string;
  totalTokens: string;
  instances: {
    chainName: string;
    balance: string;
    value: string;
    change24h: string;
  }[];
}

export function PortfolioView() {
  const { wallets } = useWallets();
  const { ready, authenticated } = usePrivy();
  const { user } = useUser();
  const [selectedChain, setSelectedChain] = useState<ChainType>("1");
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse | null>(
    null
  );
  const [allChainData, setAllChainData] = useState<PortfolioResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTokens, setExpandedTokens] = useState<{ [key: string]: boolean }>({});
  const [expandedTokens, setExpandedTokens] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  useEffect(() => {
    async function loadPortfolio() {
      if (!embeddedWallet?.address) return;

      setIsLoading(true);
      setError(null);
      try {
        const [chainData, allData] = await Promise.all([
          fetchPortfolio(
            "0xF977814e90dA44bFA03b6295A0616a897441aceC",
            "0xF977814e90dA44bFA03b6295A0616a897441aceC",
            selectedChain
          ),
          fetchAllChainPortfolio("0xF977814e90dA44bFA03b6295A0616a897441aceC"),
          fetchAllChainPortfolio("0xF977814e90dA44bFA03b6295A0616a897441aceC"),
        ]);

        if (!chainData.tokens.length && !allData.tokens.length) {
          setError("No assets found for this address");
        }

        setPortfolioData(chainData);
        setAllChainData(allData);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
        setError("Failed to load portfolio data");
      } finally {
        setIsLoading(false);
      }
    }

    loadPortfolio();
  }, [embeddedWallet?.address, selectedChain]);

  const pieChartData = portfolioData
    ? {
        labels: portfolioData.tokens.map((token) => token.symbol),
        datasets: [
          {
            data: portfolioData.tokens.map((token) =>
              parseFloat(token.value.replace("$", "").replace(",", ""))
            ),
            backgroundColor: [
              "rgba(147, 51, 234, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(245, 158, 11, 0.8)",
            ],
            borderWidth: 0,
          },
        ],
      }
    : null;

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "rgb(156, 163, 175)",
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
  };

  const groupTokensBySymbol = (tokens: any[]): GroupedToken[] => {
    const grouped = tokens.reduce((acc, token) => {
      const key = token.symbol;
      if (!acc[key]) {
        acc[key] = {
          symbol: token.symbol,
          token: token.token,
          logoUrl: token.logoUrl,
          totalValue: '$0',
          totalTokens: '0',
          instances: []
        };
      }
      
      // Add chain instance
      acc[key].instances.push({
        chainName: token.chainName,
        balance: token.balance,
        value: token.value,
        change24h: token.change24h
      });

      // Update totals
      const totalValue = acc[key].instances.reduce((sum: number, instance: { value: string; }) => 
        sum + parseFloat(instance.value.replace('$', '').replace(',', '')), 0);
      const totalTokens = acc[key].instances.reduce((sum: number, instance: { balance: string; }) => 
        sum + parseFloat(instance.balance.replace(',', '')), 0);
      
      acc[key].totalValue = `$${totalValue.toLocaleString()}`;
      acc[key].totalTokens = totalTokens.toLocaleString();

      return acc;
    }, {});

    return Object.values(grouped);
  };

  const toggleToken = (symbol: string) => {
    setExpandedTokens(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  if (!ready || !embeddedWallet) {
    return <PortfolioLoadingSkeleton />;
  }

  if (!authenticated || !user) {
    return (
      <div className="w-full max-w-4xl p-6">
        <p className="text-gray-400">Please connect your wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2">Portfolio</h2>
          <p className="text-gray-400">Track your assets across chains</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationButton />
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value as ChainType)}
            className="bg-white/5 text-white border border-purple-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-700 transition-colors"
          >
            {SUPPORTED_CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id} className="bg-gray-800">
                {chain.name}
              </option>
            ))}
          </select>
          <FundWallet />
          <LogoutButton />
        </div>
      </div>

      {isLoading ? (
        <PortfolioLoadingSkeleton />
      ) : error ? (
        <div className="glass-effect rounded-2xl p-8 text-center animate-fadeIn">
          <p className="text-xl font-medium mb-2">{error}</p>
          <p className="text-sm text-gray-400">
            Please check your connection and try again
          </p>
        </div>
      ) : portfolioData && allChainData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slideUp">
          {/* Chain-specific Portfolio Card */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6 card-hover">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-400">
                  Total Balance
                </h3>
                <p className="text-4xl font-bold gradient-text mt-1">
                  {portfolioData.totalValue}
                </p>
              </div>
            </div>

            <div className="h-[300px]">
              {pieChartData && (
                <Pie data={pieChartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Chain-specific Asset Distribution */}
          <div className="glass-effect rounded-2xl p-6 card-hover">
            <h3 className="text-lg font-medium mb-4">
              Asset Distribution on{" "}
              {SUPPORTED_CHAINS.find((c) => c.id === selectedChain)?.name}
            </h3>
            <div className="space-y-4">
              {portfolioData.tokens.slice(0, 5).map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {token.logoUrl && (
                      <img
                        src={token.logoUrl}
                        alt={token.symbol}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{token.symbol}</p>
                      <p className="text-sm text-gray-400">{token.token}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{token.value}</p>
                    <p
                      className={`text-sm flex items-center gap-1 ${
                        token.change24h.startsWith("+")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {token.change24h.startsWith("+") ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {token.change24h}
                    </p>
                  </div>
                </div>
              ))}
              {portfolioData.tokens.length > 5 && (
                <button className="w-full flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors mt-2">
                  View all assets
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* All Chain Assets */}
          <div className="lg:col-span-3 space-y-4 relative z-0"> {/* Added relative and z-0 */}
            <h3 className="text-lg font-medium">All Assets</h3>
            <div className="grid gap-4">
              {allChainData && groupTokensBySymbol(allChainData.tokens).map((token, index) => (
                <div
                  key={token.symbol}
                  className="bg-white/5 p-4 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-white/10 relative" // Added relative
                  style={{ zIndex: expandedTokens[token.symbol] ? 50 : 0 }} // Dynamic z-index
                >
                  {/* Modified Token Header with Right-aligned Token Count */}
                  <div className="flex items-center justify-between group cursor-pointer relative">
                    <div className="flex items-center gap-3">
                      {token.logoUrl && (
                        <img
                          src={token.logoUrl}
                          alt={token.symbol}
                          className="w-10 h-10 rounded-full ring-2 ring-purple-500/20"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold tracking-wide text-gray-100 uppercase">
                            {token.token}
                          </h3>
                          {token.instances.length > 1 && (
                            <button
                              onClick={() => toggleToken(token.symbol)}
                              className="flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-500/10 
                                text-purple-300 rounded-full font-medium hover:bg-purple-500/20 transition-colors"
                            >
                              {token.instances.length} Chains
                              <ChevronDown 
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                  expandedTokens[token.symbol] ? 'rotate-180' : ''
                                }`} 
                              />
                            </button>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-400">
                          {token.totalValue}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-300">
                        {token.totalTokens} <span className="text-gray-400">{token.symbol}</span>
                      </p>
                    </div>
                  </div>

                  {/* Modified Chain Dropdown - Repositioned to appear below chains button */}
                  {token.instances.length > 1 && (
                    <div 
                      className={`absolute transform transition-all duration-300 ease-out z-[999]
                        ${expandedTokens[token.symbol] ? 'opacity-100 translate-y-1' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
                      style={{
                        top: '3.5rem', // Position below the chains button
                        left: '7rem', // Align with the chains label
                        width: '200px', // Slightly narrower width
                      }}
                    >
                      <div className="bg-[#1a1b1e]/95 backdrop-blur-xl rounded-xl border border-purple-500/20 
                        shadow-2xl shadow-black/50 overflow-hidden">
                        <div className="p-2 bg-purple-500/10 border-b border-purple-500/20">
                          <h4 className="text-xs font-medium text-purple-300 text-center uppercase">
                            Chain Distribution
                          </h4>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {token.instances.map((instance, idx) => (
                            <div
                              key={idx}
                              className="p-2 hover:bg-white/5 transition-all duration-200"
                              style={{
                                transform: expandedTokens[token.symbol] ? 'translateX(0)' : 'translateX(-8px)',
                                opacity: expandedTokens[token.symbol] ? 1 : 0,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transitionDelay: `${idx * 50}ms`
                              }}
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div className="min-w-0 space-y-0.5">
                                  <p className="text-xs font-medium text-gray-200 truncate">
                                    {instance.chainName}
                                  </p>
                                  <div className={`text-[11px] font-medium flex items-center gap-1 ${
                                    parseFloat(instance.change24h) > 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}>
                                    {parseFloat(instance.change24h) > 0 ? (
                                      <TrendingUp className="w-2.5 h-2.5" />
                                    ) : (
                                      <TrendingDown className="w-2.5 h-2.5" />
                                    )}
                                    {instance.change24h}
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-xs font-medium text-gray-300 whitespace-nowrap">
                                    {instance.balance}
                                  </p>
                                  <p className="text-[11px] text-gray-400">
                                    {instance.value}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-effect rounded-2xl p-8 text-center animate-fadeIn">
          <p className="text-xl font-medium mb-2">No assets found</p>
          <p className="text-sm">
            Connect a wallet or switch networks to view your portfolio
          </p>
        </div>
      )}
    </div>
  );
}
