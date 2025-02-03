export const portfolioData = {
  totalValue: "$124,532.45",
  assets: [
    { name: "Solana", amount: "245.32 SOL", value: "$42,123.04", change: "+12.4%" },
    { name: "Jupiter", amount: "1,245 JUP", value: "$8,715.00", change: "-2.3%" },
    { name: "USDC", amount: "15,000 USDC", value: "$15,000.00", change: "0%" },
    { name: "Marinade", amount: "158.45 mSOL", value: "$28,521.00", change: "+8.7%" }
  ],
  recentTransactions: [
    { type: "Swap", from: "SOL", to: "USDC", amount: "12.5 SOL", date: "2h ago" },
    { type: "Stake", token: "SOL", amount: "50 SOL", date: "1d ago" },
    { type: "Unstake", token: "mSOL", amount: "25 mSOL", date: "3d ago" }
  ]
};