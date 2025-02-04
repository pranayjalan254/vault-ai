import {
  usePrivy,
  useDelegatedActions,
  type WalletWithMetadata,
  useWallets,
} from "@privy-io/react-auth";
import { Check } from "lucide-react";

export function DelegateActionButton() {
  const { user } = usePrivy();
  const { ready, wallets } = useWallets();
  const { delegateWallet } = useDelegatedActions();

  const walletToDelegate = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  const isAlreadyDelegated = !!user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === "wallet" && account.delegated
  );

  const onDelegate = async () => {
    if (!walletToDelegate || !ready) return;
    await delegateWallet({
      address: walletToDelegate.address,
      chainType: "ethereum",
    });
  };

  return (
    <button
      className={`w-full mt-4 py-2 px-4 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
        isAlreadyDelegated
          ? "border-green-500 text-green-400 hover:bg-green-500/10"
          : "border-purple-500 text-purple-400 hover:bg-purple-500/10"
      }`}
      disabled={!ready || !walletToDelegate || isAlreadyDelegated}
      onClick={onDelegate}
    >
      {isAlreadyDelegated ? (
        <>
          Delegated Access <Check className="w-4 h-4" />
        </>
      ) : (
        "Delegate Access"
      )}
    </button>
  );
}
