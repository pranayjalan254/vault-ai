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
            selectedChain
          ),
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

  const groupedTokens = React.useMemo(() => {
    if (!allChainData?.tokens) return {};

    return allChainData.tokens.reduce((acc: any, token) => {
      const key = token.token.toLowerCase();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(token);
      return acc;
    }, {});
  }, [allChainData?.tokens]);

  const toggleTokenExpansion = (tokenName: string) => {
    setExpandedTokens((prev) => {
      const next = new Set(prev);
      if (next.has(tokenName)) {
        next.delete(tokenName);
      } else {
        next.add(tokenName);
      }
      return next;
    });
  };

  const renderAllAssets = () => (
    <div className="lg:col-span-3 space-y-4">
      <h3 className="text-lg font-medium">All Assets</h3>
      <div className="grid gap-4">
        {Object.entries(groupedTokens as Record<string, any[]>).map(
          ([tokenKey, tokens]) => {
            const isExpanded = expandedTokens.has(tokenKey);
            const totalValue = tokens.reduce(
              (sum, t) =>
                sum + parseFloat(t.value.replace("$", "").replace(",", "")),
              0
            );
            const primaryToken = tokens[0];

            return (
              <div key={tokenKey} className="space-y-2">
                <div
                  className="bg-white/5 p-4 rounded-xl backdrop-blur-sm flex items-center justify-between hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
                  onClick={() =>
                    tokens.length > 1 && toggleTokenExpansion(tokenKey)
                  }
                >
                  <div className="flex items-center gap-4">
                    {primaryToken.logoUrl && (
                      <img
                        src={primaryToken.logoUrl}
                        alt={primaryToken.symbol}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{primaryToken.token}</p>
                        {tokens.length > 1 && (
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                            {tokens.length} chains
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        Total: ${totalValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {tokens.length > 1 && (
                    <button className="text-gray-400">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="ml-14 space-y-2">
                    {tokens.map((token, idx) => (
                      <div
                        key={`${tokenKey}-${idx}`}
                        className="bg-white/5 p-3 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                            {token.chainName}
                          </span>
                          <span className="text-sm text-gray-400">
                            {token.balance} {token.symbol}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{token.value}</p>
                          <p
                            className={`text-sm flex items-center justify-end gap-1 ${
                              parseFloat(token.change24h) > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {parseFloat(token.change24h) > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {token.change24h}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );

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
          {renderAllAssets()}
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
