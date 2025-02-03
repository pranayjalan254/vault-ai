import React from 'react';
import { accountData } from '../../../data/account';

export function AccountView() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6">Account Details</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-400">User ID</p>
          <p className="font-medium">{accountData.userId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Name</p>
          <p className="font-medium">{accountData.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Email</p>
          <p className="font-medium">{accountData.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Wallet</p>
          <p className="font-medium">{accountData.walletAddress}</p>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 mt-6">
        <h3 className="text-xl font-medium mb-4">Social Connections</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Twitter</p>
            <p className="font-medium">{accountData.twitter}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Discord</p>
            <p className="font-medium">{accountData.discord}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 mt-6">
        <h3 className="text-xl font-medium mb-4">Membership</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Join Date</p>
            <p className="font-medium">{accountData.joinDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Tier</p>
            <p className="font-medium text-purple-400">{accountData.tier}</p>
          </div>
        </div>
      </div>
    </div>
  );
}