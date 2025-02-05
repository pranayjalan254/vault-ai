'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useGasFees } from '../../../hooks/useGasFees';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
}

interface TokenPrice {
  token: string;
  buyingPrice: number;
  currentPrice: number;
}

export function NotificationButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const gasFees = useGasFees();
  const [lastAlertTime, setLastAlertTime] = useState(0);
  const [swappedTokens, setSwappedTokens] = useState<Set<string>>(new Set());

  const addLowGasAlert = useCallback(() => {
    const currentTime = Date.now();
    // Check if 5 minutes (300000 ms) have passed since last alert
    if (currentTime - lastAlertTime >= 300000) {
      const lowGasNotification = {
        id: currentTime,
        title: 'Low Gas Fees Alert! 🎉',
        description: 'Gas fees are currently low - good time for transactions!',
        time: 'Just now'
      };

      setNotifications(prev => [lowGasNotification, ...prev]);
      setLastAlertTime(currentTime);
    }
  }, [lastAlertTime]);

  const checkTokenPrices = useCallback((tokens: TokenPrice[]) => {
    tokens.forEach(token => {
      if (!swappedTokens.has(token.token)) {
        const priceDropPercentage = ((token.buyingPrice - token.currentPrice) / token.buyingPrice) * 100;
        
        if (priceDropPercentage >= 80) { // Price dropped by 80% or more (20% of buying price)
          const swapNotification = {
            id: Date.now(),
            title: 'Auto-Swap Executed',
            description: `${token.token} has dropped below 20% of buying price. Auto-swapped to stablecoin.`,
            time: 'Just now'
          };

          setNotifications(prev => [swapNotification, ...prev]);
          setSwappedTokens(prev => new Set(prev).add(token.token));
        }
      }
    });
  }, [swappedTokens]);

  useEffect(() => {
    if (gasFees?.estimatedBaseFee) {
      const gasNotification = {
        id: Date.now(),
        title: 'Current Gas Fees',
        description: `Estimated Base Fee: ${Number(gasFees.estimatedBaseFee).toFixed(2)} Gwei`,
        time: 'Just now'
      };

      setNotifications(prev => {
        const filtered = prev.filter(n => n.title !== 'Current Gas Fees');
        return [gasNotification, ...filtered];
      });

      // Check if gas fee is below 3 Gwei
      if (Number(gasFees.estimatedBaseFee) < 2) {
        addLowGasAlert();
      }
    }
  }, [gasFees, addLowGasAlert]);

  useEffect(() => {
    // Mock token data - replace with your actual token price monitoring logic
    const mockTokens: TokenPrice[] = [
      {
        token: 'ETH',
        buyingPrice: 2000,
        currentPrice: 300 // This would trigger the swap notification as it's below 20%
      },
      // Add more tokens as needed
    ];

    checkTokenPrices(mockTokens);
  }, [checkTokenPrices]); // Add appropriate dependencies based on your data source

  return (
    <Popover.Root>
      <Popover.Trigger className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
        <Bell className="h-5 w-5 z-50 text-gray-400" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">
            {notifications.length}
          </span>
        )}
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          className="bg-gray-900 border border-gray-800 rounded-lg p-2 shadow-xl w-80 mt-2 z-[100]" 
          sideOffset={5}
          align="end"
        >
          <div className="space-y-2">
            <div className="px-2 py-1 border-b border-gray-800">
              <h3 className="font-medium">Notifications</h3>
            </div>
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className="p-2 hover:bg-white/5 rounded-lg cursor-pointer"
              >
                <div className="text-sm font-medium">{notification.title}</div>
                <div className="text-xs text-gray-400">{notification.description}</div>
                <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
              </div>
            ))}
          </div>
          <Popover.Arrow className="fill-gray-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
