import React, { useEffect, useState } from "react";
import { useWallets, usePrivy, useUser } from "@privy-io/react-auth";
import { Loader2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
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

ChartJS.register(ArcElement, Tooltip, Legend);

export function PortfolioView() {
  const { wallets } = useWallets();
  const { ready, authenticated } = usePrivy();
  const { user } = useUser();
  const [selectedChain, setSelectedChain] = useState<ChainType>("ethereum");
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse | null>(
    null
  );
  const [allChainData, setAllChainData] = useState<PortfolioResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  useEffect(() => {
    async function loadPortfolio() {
      if (!embeddedWallet?.address) return;

      setIsLoading(true);
      try {
        const [chainData, allData] = await Promise.all([
          fetchPortfolio(embeddedWallet.address, selectedChain),
          fetchAllChainPortfolio(embeddedWallet.address),
        ]);
        setPortfolioData(chainData);
        setAllChainData(allData);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
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

  if (!ready || !embeddedWallet) return null;

  if (!authenticated || !user) {
    return (
      <div className="w-full max-w-4xl p-6">
        <p className="text-gray-400">Please connect your wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2">Portfolio</h2>
          <p className="text-gray-400">Track your assets across chains</p>
        </div>
        <div className="flex items-center gap-4">
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
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : portfolioData && allChainData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chain-specific Portfolio Card */}
          <div className="lg:col-span-2 bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
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
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
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
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-lg font-medium">All Assets</h3>
            <div className="grid gap-4">
              {allChainData.tokens.map((token, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-xl backdrop-blur-sm flex items-center justify-between hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    {token.logoUrl && (
                      <img
                        src={token.logoUrl}
                        alt={token.symbol}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{token.token}</p>
                        <span className="text-sm text-gray-500">
                          {token.symbol}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {token.balance} {token.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{token.value}</p>
                    <p
                      className={`text-sm flex items-center justify-end gap-1 ${
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
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
          <p className="text-xl font-medium mb-2">No assets found</p>
          <p className="text-sm">
            Connect a wallet or switch networks to view your portfolio
          </p>
        </div>
      )}
    </div>
  );
}
