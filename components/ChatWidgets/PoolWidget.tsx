"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
} from "lucide-react";

interface PoolData {
  name: string;
  base_token_price_usd: number;
  address: string;
  pool_created_at: string;
  market_cap_usd: number;
  price_change_percentage: {
    h24: number;
  };
}

interface TopPoolsWidgetProps {
  pools: PoolData[];
}

export function TopPoolsWidget({ pools }: TopPoolsWidgetProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-purple-500/20 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Top 5 Trending Pools
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-purple-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-purple-400" />
        )}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid gap-4">
            {pools.map((pool, index) => (
              <div
                key={pool.address}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 font-medium">
                        #{index + 1}
                      </span>
                      <h4 className="text-white font-semibold">{pool.name}</h4>
                    </div>
                    <p className="text-gray-400 text-sm font-mono">
                      {pool.address.slice(0, 6)}...{pool.address.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">
                      {formatNumber(pool.base_token_price_usd)}
                    </div>
                    <div
                      className={`flex items-center gap-1 justify-end ${
                        pool.price_change_percentage.h24 >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {pool.price_change_percentage.h24 >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">
                        {Math.abs(pool.price_change_percentage.h24).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-gray-400 text-sm">Market Cap</p>
                    <p className="text-white font-medium">
                      {formatNumber(pool.market_cap_usd)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Created</p>
                    <p className="text-white font-medium">
                      {formatDate(pool.pool_created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
