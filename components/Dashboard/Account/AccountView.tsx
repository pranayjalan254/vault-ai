import React, { useState } from "react";
import { usePrivy, useWallets, useUser } from "@privy-io/react-auth";
import {
  Twitter,
  Github,
  RefreshCw,
  Plus,
  Unlink,
  Copy,
  Check,
  Wallet,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FaDiscord, FaGoogle, FaApple } from "react-icons/fa";
import { LogoutButton } from "../Buttons/LogoutButton";
import { ExternalWalletMenu } from './ExternalWalletMenu';
import { NotificationButton } from '../Buttons/NotificationButton';
import { AccountLoadingSkeleton } from './LoadingSkeleton';

export function AccountView() {
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});
  const [showExternalWallets, setShowExternalWallets] = useState(false);
  const { wallets } = useWallets();

  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  const {
    ready,
    authenticated,
    linkApple,
    linkWallet,
    linkTwitter,
    linkDiscord,
    linkGoogle,
    linkGithub,

    unlinkTwitter,
    unlinkApple,
    unlinkDiscord,
    unlinkGoogle,
    unlinkWallet,
    unlinkGithub,
  } = usePrivy();
  const { user, refreshUser } = useUser();
  const smartWallet = user?.linkedAccounts.find(
    (account) => account.type === "smart_wallet"
  );
  const smartWalletAddress = smartWallet?.address;
  if (!ready || !authenticated || !user) {
    return <AccountLoadingSkeleton />;
  }

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopyStates((prev) => ({ ...prev, [address]: true }));
    setTimeout(() => {
      setCopyStates((prev) => ({ ...prev, [address]: false }));
    }, 2000);
  };

  const formatWalletType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + " Wallet";
  };

  const connections = [
    {
      type: "google",
      icon: FaGoogle,
      title: "Google",
      value: user.google?.email,
      onLink: linkGoogle,
      onUnlink: () => unlinkGoogle(user.google?.email!),
      isLinked: !!user.google,
    },
    {
      type: "apple",
      icon: FaApple,
      title: "Apple",
      value: user.google?.email,
      onLink: linkApple,
      onUnlink: () => unlinkApple(user.apple?.subject!),
      isLinked: !!user.apple,
    },
    {
      type: "wallet",
      icon: Wallet,
      title: "Wallet",
      value: user.wallet?.address,
      onLink: linkWallet,
    },
    {
      type: "twitter",
      icon: Twitter,
      title: "Twitter",
      value: user.twitter?.username,
      onLink: linkTwitter,
      onUnlink: () => unlinkTwitter(user.twitter?.username!),
      isLinked: !!user.twitter,
    },
    {
      type: "github",
      icon: Github,
      title: "GitHub",
      value: user.github?.username,
      onLink: linkGithub,
      onUnlink: () => unlinkGithub(user.github?.subject!),
      isLinked: !!user.github,
    },
    {
      type: "discord",
      icon: FaDiscord,
      title: "Discord",
      value: user.discord?.username,
      onLink: linkDiscord,
      onUnlink: () => unlinkDiscord(user.discord?.subject!),
      isLinked: !!user.discord,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-6 space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center glass-effect p-5 rounded-xl">
          <div>
            <h2 className="text-2xl font-bold mb-1 gradient-text">Connected Accounts</h2>
            <p className="text-sm text-gray-400">
              Manage your connected accounts and services
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationButton />
            <button
              onClick={() => refreshUser()}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Refresh connections"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Wallets Section */}
        <div className="glass-effect p-5 rounded-xl backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 gradient-text">Wallet</h3>
          <div className="space-y-3">
            {/* Embedded Wallet */}
            {embeddedWallet && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{embeddedWallet.address}</p>
                    <button
                      onClick={() => handleCopy(embeddedWallet.address)}
                      className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors relative group"
                      title="Copy address"
                    >
                      {copyStates[embeddedWallet.address] ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">Embedded Wallet</p>
                </div>
                <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  Primary
                </div>
              </div>
            )}

            {/* External Wallets */}
            {wallets.filter((w) => w.walletClientType !== "privy").length > 0 && (
              <div className="mt-4">
                <ExternalWalletMenu
                  wallets={wallets.filter((w) => w.walletClientType !== "privy")}
                  onCopy={handleCopy}
                  copyStates={copyStates}
                />
              </div>
            )}
          </div>
        </div>

        {/* Connected Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map((connection) => (
            <div
              key={connection.type}
              className="glass-effect p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <connection.icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{connection.title}</h3>
                    {connection.isLinked ? (
                      <p className="text-xs text-gray-400">{connection.value}</p>
                    ) : (
                      <p className="text-xs text-gray-400">Not connected</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={connection.isLinked ? connection.onUnlink : connection.onLink}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                    connection.isLinked
                      ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      : "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                  }`}
                >
                  {connection.isLinked ? (
                    <>
                      <Unlink className="w-3.5 h-3.5" />
                      Disconnect
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}