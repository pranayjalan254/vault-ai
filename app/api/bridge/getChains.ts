import { NextApiRequest, NextApiResponse } from "next";
import { fetchChains } from "../../../Agentic_Backend/src/Bridge/Tokens";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const chains = await fetchChains();
    res.status(200).json(chains);
  } catch (error) {
    console.error("Error fetching chains:", error);
    res.status(500).json({ error: "Failed to fetch chains" });
  }
}
