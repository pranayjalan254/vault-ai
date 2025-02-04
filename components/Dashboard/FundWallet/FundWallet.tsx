import { useFundWallet } from "@privy-io/react-auth";
import { useSolanaFundingPlugin } from "@privy-io/react-auth/solana";
import { Wallet } from "lucide-react";
import { useWallets } from "@privy-io/react-auth";

export const FundWallet = () => {
  const { fundWallet } = useFundWallet();
  const { wallets } = useWallets();

  useSolanaFundingPlugin();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const walletAddress = embeddedWallet?.address || "";

  const handleFundWallet = async () => {
    try {
      await fundWallet(walletAddress);
    } catch (error) {
      console.error("Failed to fund wallet:", error);
    }
  };

  return (
    <button
      onClick={handleFundWallet}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-purple-500/25"
    >
      <Wallet className="w-4 h-4" />
      Fund Wallet
    </button>
  );
};
