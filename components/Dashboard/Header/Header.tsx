"use client";

import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <div className="fixed top-0 right-0 pl-64 w-full">
      <div className="flex justify-end p-4 bg-black/20 border-gray-800/50">
        {children}
      </div>
    </div>
  );
}