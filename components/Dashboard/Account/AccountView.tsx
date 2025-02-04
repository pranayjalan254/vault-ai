import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUser } from "@privy-io/react-auth";

export function AccountView() {
  const { ready, authenticated } = usePrivy();
  const { user, refreshUser } = useUser();

  if (!ready) {
    return (
      <div className="w-full max-w-4xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="w-full max-w-4xl p-6">
        <p className="text-gray-400">
          Please connect your wallet to view account details.
        </p>
      </div>
    );
  }

  const hasSocialConnections =
    user.twitter || user.discord || user.github || user.farcaster;
  const hasAdditionalConnections = user.google || user.linkedin;

  return (
    <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Account Details</h2>
        <button
          onClick={() => refreshUser()}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          title="Refresh user data"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-400">User ID</p>
          <p className="font-medium">{user.id}</p>
        </div>
        {user.email?.address && (
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium">{user.email.address}</p>
          </div>
        )}
        {user.wallet?.address && (
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Wallet</p>
            <p className="font-medium">{user.wallet.address}</p>
          </div>
        )}
      </div>

      {hasSocialConnections && (
        <div className="border-t border-gray-800 pt-6 mt-6">
          <h3 className="text-xl font-medium mb-4">Social Connections</h3>
          <div className="grid grid-cols-2 gap-6">
            {user.twitter && (
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Twitter</p>
                <p className="font-medium">{user.twitter.username}</p>
              </div>
            )}
            {user.discord && (
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Discord</p>
                <p className="font-medium">{user.discord.username}</p>
              </div>
            )}
            {user.github && (
              <div className="space-y-1">
                <p className="text-sm text-gray-400">GitHub</p>
                <p className="font-medium">{user.github.username}</p>
              </div>
            )}
            {user.farcaster && (
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Farcaster</p>
                <p className="font-medium">{user.farcaster.username}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {hasAdditionalConnections && (
        <div className="border-t border-gray-800 pt-6 mt-6">
          <h3 className="text-xl font-medium mb-4">Additional Connections</h3>
          <div className="grid grid-cols-2 gap-6">
            {user.google && (
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Google</p>
                <p className="font-medium">{user.google.email}</p>
              </div>
            )}
            {user.linkedin && (
              <div className="space-y-1">
                <p className="text-sm text-gray-400">LinkedIn</p>
                <p className="font-medium">{user.linkedin.email}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
