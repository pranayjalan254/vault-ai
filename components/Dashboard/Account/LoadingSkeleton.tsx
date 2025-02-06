import React from 'react';

export function AccountLoadingSkeleton() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-6 space-y-6">
        {/* Header Skeleton */}
        <div className="glass-effect p-5 rounded-xl animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="h-7 w-60 bg-gray-700/50 rounded"></div>
              <div className="h-4 w-40 bg-gray-700/50 rounded"></div>
            </div>
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-9 h-9 bg-gray-700/50 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Wallet Section Skeleton */}
        <div className="glass-effect p-5 rounded-xl">
          <div className="h-6 w-24 bg-gray-700/50 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-gray-700/20 border border-gray-700/50">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-72 bg-gray-700/50 rounded"></div>
                  <div className="h-3 w-32 bg-gray-700/50 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-purple-500/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Connections Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-effect p-4 rounded-xl animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700/50 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-700/50 rounded"></div>
                    <div className="h-3 w-28 bg-gray-700/50 rounded"></div>
                  </div>
                </div>
                <div className="h-8 w-24 bg-purple-500/20 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
