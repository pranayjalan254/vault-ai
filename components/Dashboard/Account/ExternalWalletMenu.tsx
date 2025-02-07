import React, { useRef, useEffect } from "react";

function formatWalletType(walletClientType: string): string {
  // Add your formatting logic here
  return walletClientType;
}
import { createPortal } from "react-dom";
import { ChevronDown, Copy, Check } from "lucide-react";
import styled from "@emotion/styled";

const MenuButton = styled("button")`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: rgb(156 163 175);
  font-size: 0.875rem;
  border-radius: 0.5rem;
  transition: all 150ms ease;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgb(55 65 81);
    color: white;
  }
`;

const MenuList = styled("div")`
  position: fixed; // Change to fixed
  z-index: 9999; // Increased z-index significantly
  background: rgba(31, 32, 35, 0.98); // Slightly more opaque
  left: 0;
  right: 0; // Make it full width on mobile
  min-width: 200px;
  margin-top: 0.5rem;
  backdrop-filter: blur(8px);
  border: 1px solid rgb(55 65 81);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 200ms ease;

  @media (min-width: 640px) {
    right: auto; // Reset right property on larger screens
    width: 300px; // Specific width on larger screens
  }

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const MenuItem = styled("div")`
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgb(55 65 81);
  transition: background-color 150ms ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

interface ExternalWalletMenuProps {
  wallets: any[];
  onCopy: (address: string) => void;
  copyStates: { [key: string]: boolean };
}

export function ExternalWalletMenu({
  wallets,
  onCopy,
  copyStates,
}: ExternalWalletMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      menuRef.current.style.top = `${rect.bottom + window.scrollY + 8}px`;
      menuRef.current.style.left = `${rect.left + window.scrollX}px`;
      
      // Adjust position if near right edge of screen
      const menuWidth = 300; // same as width in styled component
      if (rect.left + menuWidth > window.innerWidth) {
        menuRef.current.style.left = `${window.innerWidth - menuWidth - 16}px`;
      }
    }
  }, [isOpen]);

  return (
    <div ref={buttonRef} className="relative w-full sm:w-auto">
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        <ChevronDown className="w-4 h-4" />
        <span>External Wallets ({wallets.length})</span>
      </MenuButton>

      {typeof window !== 'undefined' && createPortal(
        <MenuList ref={menuRef} className={isOpen ? "open" : ""}>
          {wallets.map((wallet) => (
            <MenuItem key={wallet.address}>
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-300 ">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </p>
                  <p className="text-xs text-gray-400 ">
                    {formatWalletType(wallet.walletClientType)}
                  </p>
                </div>
                <button
                  onClick={() => onCopy(wallet.address)}
                  className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors flex-shrink-0"
                >
                  {copyStates[wallet.address] ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
              </div>
            </MenuItem>
          ))}
        </MenuList>,
        document.body
      )}
    </div>
  );
}
