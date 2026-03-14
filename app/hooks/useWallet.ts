'use client';

import { useState, useCallback } from 'react';

export interface WalletState {
  address: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async () => {
    setConnecting(true);
    // Simulate connection delay
    // In production: replace with @aptos-labs/wallet-adapter-react
    // const { connect } = useWallet(); connect('Petra');
    await new Promise(r => setTimeout(r, 800));
    setAddress('0xfcba3a1c276e3e598938e00a51c');
    setConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return { address, connecting, connect, disconnect };
}
