"use client";

import type { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";
import { PrivyProvider } from "@privy-io/react-auth";

export function Providers(props: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId="cm6pywa2v008314lo3elu45uw"
      clientId="client-WY5gH6hjvE6LvgyVYrYhjWAWMJkNSwbSYfSZh2rmmMS3Z"
      config={{
        appearance: {
          accentColor: "#6A6FF5",
          theme: "#1f003d",
          showWalletLoginFirst: false,
          logo: "https://auth.privy.io/logos/privy-logo-dark.png",
          walletChainType: "ethereum-only",
          walletList: [
            "detected_wallets",
            "phantom",
            "solflare",
            "backpack",
            "okx_wallet",
          ],
        },
        loginMethods: ["wallet", "google", "github", "twitter", "email"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
          solana: {
            createOnLogin: "off",
          },
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
        externalWallets: {},
      }}
    >
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
      >
        {props.children}
      </OnchainKitProvider>
    </PrivyProvider>
  );
}
