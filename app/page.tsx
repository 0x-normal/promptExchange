'use client';

import { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { BrowseTab } from './components/layout/BrowseTab';
import { PublishTab } from './components/layout/PublishTab';

type Tab = 'browse' | 'publish';

export default function Home() {
  const [tab, setTab] = useState<Tab>('browse');
  const wallet = useWallet();

  return (
    <div className="min-h-screen relative z-10">
      <Navbar activeTab={tab} onTabChange={setTab} wallet={wallet} />
      <Hero />

      {/* Mobile tab switcher */}
      <div className="md:hidden px-6 mb-4">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
          {(['browse', 'publish'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg text-sm font-display font-semibold capitalize transition-all"
              style={{
                color: tab === t ? 'var(--green)' : 'var(--muted)',
                background: tab === t ? 'rgba(0,217,163,0.1)' : 'transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <main className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {tab === 'browse' && (
            <BrowseTab
              walletAddress={wallet.address}
              onConnectWallet={wallet.connect}
            />
          )}
          {tab === 'publish' && (
            <PublishTab
              walletAddress={wallet.address}
              onConnect={wallet.connect}
            />
          )}
        </div>
      </main>

      <footer className="px-6 py-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono"
          style={{ color: 'var(--hint)' }}>
          <span>
            PromptExchange — built on Shelby Protocol by{' '}
            <a href="https://twitter.com/isanoxel" target="_blank" rel="noreferrer"
              className="underline" style={{ color: 'var(--green)' }}>
              @isanoxel
            </a>
          </span>
          <a href="https://explorer.shelby.xyz/testnet" target="_blank" rel="noreferrer"
            className="underline" style={{ color: 'var(--green)' }}>
            Shelby Explorer →
          </a>
        </div>
      </footer>
    </div>
  );
}
