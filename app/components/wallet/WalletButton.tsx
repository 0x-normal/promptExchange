'use client';

import type { WalletState } from '../../hooks/useWallet';

export function WalletButton({ wallet }: { wallet: WalletState }) {
  const { address, connecting, connect, disconnect } = wallet;

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(0,217,163,0.08)', border: '1px solid rgba(0,217,163,0.2)' }}
        >
          <span
            className="w-2 h-2 rounded-full pulse-dot"
            style={{ background: 'var(--green)' }}
          />
          <span className="text-[12px] font-mono" style={{ color: 'var(--green)' }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="text-[11px] font-mono px-2 py-1 rounded-lg transition-all"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <button onClick={connect} disabled={connecting} className="wallet-btn">
      {connecting ? 'Connecting...' : '🔗 Connect Wallet'}
    </button>
  );
}
