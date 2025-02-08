import React from "react";

export function AccountLoadingSkeleton() {
  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 animate-gradientMove"></div>

      <div className="max-w-5xl mx-auto px-6 space-y-6 relative">
        {/* Header Skeleton */}
        <div className="glass-effect p-5 rounded-xl overflow-hidden relative">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="h-8 w-60 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/20 animate-shimmer"></div>
              <div className="h-4 w-40 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/20 animate-shimmer"></div>
            </div>
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/20 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Wallet Section Skeleton with floating animation */}
        <div className="glass-effect p-6 rounded-xl overflow-hidden relative animate-float">
          <div className="h-7 w-28 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/20 animate-shimmer mb-6"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-white/5 border border-purple-500/20 backdrop-blur-sm"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-72 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/20 animate-shimmer"></div>
                    <div className="h-3 w-32 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/20 animate-shimmer"></div>
                  </div>
                  <div className="h-8 w-24 rounded-full bg-purple-500/20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connections Grid Skeleton with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="glass-effect p-4 rounded-xl overflow-hidden relative"
              style={{
                animationDelay: `${i * 100}ms`,
                animation: "fadeIn 0.5s ease-out forwards",
                opacity: 0,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/20 animate-shimmer"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/20 animate-shimmer"></div>
                    <div className="h-3 w-32 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-purple-500/20 animate-shimmer"></div>
                  </div>
                </div>
                <div className="h-8 w-24 rounded-lg bg-purple-500/20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
