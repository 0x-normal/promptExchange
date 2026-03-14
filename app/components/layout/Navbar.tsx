'use client';

import type { WalletState } from '../../hooks/useWallet';
import { WalletButton } from '../wallet/WalletButton';

type Tab = 'browse' | 'publish';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  wallet: WalletState;
}

export function Navbar({ activeTab, onTabChange, wallet }: NavbarProps) {
  return (
    <header
      className="sticky top-0 z-40 px-6 py-4"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,8,16,0.9)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-white text-xl tracking-tight">
            PromptExchange
          </span>
          <span
            className="text-[10px] font-mono px-2 py-1 rounded-full"
            style={{
              color: 'var(--green)',
              background: 'rgba(0,217,163,0.1)',
              border: '1px solid rgba(0,217,163,0.2)',
            }}
          >
            on Shelby
          </span>
        </div>

        {/* Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {(['browse', 'publish'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="px-4 py-2 rounded-xl text-[13px] font-display font-semibold capitalize transition-all"
              style={{
                color: activeTab === tab ? 'var(--green)' : 'var(--muted)',
                background: activeTab === tab ? 'rgba(0,217,163,0.08)' : 'transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Wallet */}
        <WalletButton wallet={wallet} />
      </div>
    </header>
  );
}
