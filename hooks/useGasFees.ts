'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface GasFeeData {
  estimatedBaseFee: string;
}

export function useGasFees() {
  const [gasFees, setGasFees] = useState<GasFeeData | null>(null);

  useEffect(() => {
    const fetchGasFees = async () => {
      try {
        const Auth = "NjRlMDAyZTg4N2Y1NDhjMWFlNWM1OGI4MTk5NDQwZjg6cTNQTjFTUXgvTzQrckxYQ3MvL00yRHphYjVLMitwb3E1ZFp2U2dHcUxqZHh2UTRJMy9HcFlR"
          ;

        const { data } = await axios.get(
          `https://gas.api.infura.io/networks/1/suggestedGasFees`,
          {
            headers: { Authorization: `Basic ${Auth}` },
          }
        );

        setGasFees({
          estimatedBaseFee: data.estimatedBaseFee
        });
        console.log("Fetched gas fees:", data.estimatedBaseFee);
      } catch (error) {
        console.error("Failed to fetch gas fees:", error);
      }
    };

    fetchGasFees();
    const interval = setInterval(fetchGasFees, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return gasFees;
}
