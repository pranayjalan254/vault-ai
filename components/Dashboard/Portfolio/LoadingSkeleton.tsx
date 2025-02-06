import React from 'react';

export function PortfolioLoadingSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start glass-effect p-6 rounded-xl">
        <div className="space-y-3">
          <div className="h-8 w-36 bg-gray-700/50 rounded"></div>
          <div className="h-4 w-48 bg-gray-700/50 rounded"></div>
        </div>
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-10 h-10 bg-gray-700/50 rounded-lg"></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card Skeleton */}
        <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-700/50 rounded"></div>
              <div className="h-8 w-48 bg-gray-700/50 rounded"></div>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] rounded-full">
              <div className="absolute inset-0 border-4 border-gray-700/50 rounded-full animate-pulse"></div>
              <div className="absolute inset-[25%] border-4 border-gray-700/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Asset Distribution Skeleton */}
        <div className="glass-effect rounded-2xl p-6">
          <div className="h-6 w-48 bg-gray-700/50 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-700/20 rounded-xl animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600/50 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-600/50 rounded"></div>
                    <div className="h-3 w-24 bg-gray-600/50 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-20 bg-gray-600/50 rounded ml-auto"></div>
                  <div className="h-3 w-16 bg-gray-600/50 rounded ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Chain Assets Skeleton */}
        <div className="lg:col-span-3 space-y-4">
          <div className="h-6 w-32 bg-gray-700/50 rounded"></div>
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-effect p-4 rounded-xl animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-600/50 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-24 bg-gray-600/50 rounded"></div>
                        <div className="h-4 w-16 bg-purple-500/20 rounded-full"></div>
                      </div>
                      <div className="h-3 w-32 bg-gray-600/50 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-24 bg-gray-600/50 rounded ml-auto"></div>
                    <div className="h-3 w-16 bg-gray-600/50 rounded ml-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
