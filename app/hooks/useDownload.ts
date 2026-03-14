'use client';

import { useState, useCallback } from 'react';
import type { RegistryEntry, ShelbyDatasetBlob } from '../../src/types/dataset';

export interface DownloadState {
  downloading: string | null;
  result: ShelbyDatasetBlob | null;
  error: string;
  download: (entry: RegistryEntry, walletAddress: string | null, onNeedWallet: () => void) => Promise<void>;
  clear: () => void;
  saveJson: () => void;
}

export function useDownload(): DownloadState {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [result, setResult] = useState<ShelbyDatasetBlob | null>(null);
  const [error, setError] = useState('');

  const download = useCallback(async (
    entry: RegistryEntry,
    walletAddress: string | null,
    onNeedWallet: () => void
  ) => {
    if (entry.metadata.price > 0 && !walletAddress) {
      onNeedWallet();
      return;
    }
    setDownloading(entry.blobName);
    setError('');
    try {
      const res = await fetch(
        `/api/download?account=${encodeURIComponent(entry.accountAddress)}&blobName=${encodeURIComponent(entry.blobName)}`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch {
      // Shelby testnet unavailable — show demo data
      setResult({
        version: '1.0',
        metadata: entry.metadata,
        prompts: entry.metadata.preview ?? [],
      });
    } finally {
      setDownloading(null);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  const saveJson = useCallback(() => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.metadata.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  return { downloading, result, error, download, clear, saveJson };
}
