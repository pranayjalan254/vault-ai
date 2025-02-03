import React from 'react';
import { portfolioData } from '../../../data/portfolio';

export function PortfolioView() {
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
}