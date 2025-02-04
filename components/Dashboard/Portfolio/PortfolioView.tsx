import React, { useEffect, useState } from "react";
import { useWallets, usePrivy, useUser } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";
import { ChainType, PortfolioResponse } from "../../../types/portfolio";
import { fetchPortfolio, SUPPORTED_CHAINS } from "../../../lib/api/portfolio";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FundWallet } from "../FundWallet/FundWallet";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PortfolioView() {
  const { wallets } = useWallets();
  const { ready, authenticated } = usePrivy();
  const { user, refreshUser } = useUser();
  const [selectedChain, setSelectedChain] = useState<ChainType>("ethereum");
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse | null>(
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
        const data = await fetchPortfolio(
          embeddedWallet.address,
          selectedChain
        );
        setPortfolioData(data);
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
        position: "right" as const,
        labels: {
          color: "rgb(156, 163, 175)",
          usePointStyle: true,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  if (!ready || !embeddedWallet) return null;

  if (!authenticated || !user) {
    return (
      <div className="w-full max-w-4xl p-6">
        <p className="text-gray-400">Please connect your wallet to continue.</p>
      </div>
    );
  }

  const hasSocialConnections =
    user.twitter || user.discord || user.github || user.farcaster;

  return (
    <div className="w-full max-w-4xl space-y-4">
      {/* Portfolio Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Portfolio Overview</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value as ChainType)}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {SUPPORTED_CHAINS.map((chain) => (
                <option key={chain.id} value={chain.id} className="bg-gray-800">
                  {chain.name}
                </option>
              ))}
            </select>
            <FundWallet />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : portfolioData ? (
          <>
            {/* Portfolio Chart Section */}
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Total Portfolio Value
                  </p>
                  <p className="text-3xl font-semibold gradient-text">
                    {portfolioData.totalValue}
                  </p>
                </div>
                <div className="w-[200px] h-[200px]">
                  {pieChartData && (
                    <Pie data={pieChartData} options={chartOptions} />
                  )}
                </div>
              </div>
            </div>

            {/* Assets List Section */}
            <div>
              <h3 className="text-xl font-medium mb-4">Assets</h3>
              <div className="space-y-3">
                {portfolioData.tokens.map((token, index) => (
                  <div
                    key={index}
                    className="bg-white/5 p-4 rounded-xl backdrop-blur-sm flex items-center justify-between"
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
                        <p className="font-medium">{token.token}</p>
                        <p className="text-sm text-gray-400">
                          {token.balance} {token.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{token.value}</p>
                      <p
                        className={`text-sm ${
                          token.change24h.startsWith("+")
                            ? "text-green-400"
                            : token.change24h.startsWith("-")
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {token.change24h}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-400">
            Failed to load portfolio data
          </div>
        )}
      </div>
    </div>
  );
}
