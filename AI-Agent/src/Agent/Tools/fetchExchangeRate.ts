import axios from "axios";

interface Rate {
  name: string;
  unit: string;
  value: number;
  type: string;
}

interface ExchangeRateResponse {
  rates: {
    [key: string]: Rate;
  };
}

export const fetchExchangeRate = async (tokenName: string): Promise<string> => {
  try {
    const url = "https://api.coingecko.com/api/v3/exchange_rates";
    const response = await axios.get<ExchangeRateResponse>(url, {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-mUmSQhQhZugEAYfKtz7UbTpW",
      },
    });

    const rates = response.data.rates;
    const tokenSymbol = tokenName.toLowerCase();

    if (rates[tokenSymbol]) {
      const rate = rates[tokenSymbol];
      return `1 BTC = ${rate.value} ${rate.unit} (${rate.name})`;
    } else {
      throw new Error(`Token ${tokenName} not found in exchange rates`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch exchange rate: ${error.message}`);
    }
    throw new Error("Failed to fetch exchange rate");
  }
};
