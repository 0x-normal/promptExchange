'use client';

import { useState } from 'react';
import type { RegistryEntry } from '../../../src/types/dataset';
import { useDatasetFilter } from '../../hooks/useDatasetFilter';
import { useDownload } from '../../hooks/useDownload';
import { useToast } from '../../hooks/useToast';
import { CategorySidebar } from '../dataset/CategorySidebar';
import { SearchBar } from '../dataset/SearchBar';
import { DatasetGrid } from '../dataset/DatasetGrid';
import { PreviewModal } from '../dataset/PreviewModal';
import { DownloadResult } from '../dataset/DownloadResult';
import { Toast } from '../ui/Toast';

interface BrowseTabProps {
  walletAddress: string | null;
  onConnectWallet: () => void;
}

export function BrowseTab({ walletAddress, onConnectWallet }: BrowseTabProps) {
  const [preview, setPreview] = useState<RegistryEntry | null>(null);
  const filter = useDatasetFilter();
  const dl = useDownload();
  const toast = useToast();

  async function handleDownload(entry: RegistryEntry) {
    await dl.download(entry, walletAddress, onConnectWallet);
    if (!dl.error) toast.show(`"${entry.metadata.name}" downloaded from Shelby!`);
  }

  return (
    <div className="flex gap-6">
      {/* Category sidebar */}
      <CategorySidebar active={filter.category} onChange={filter.setCategory} />

      {/* Main area */}
      <div className="flex-1 min-w-0 space-y-5">
        <SearchBar
          search={filter.search}
          sort={filter.sort}
          onSearchChange={filter.setSearch}
          onSortChange={filter.setSort}
        />

        <div className="text-[12px] font-mono" style={{ color: 'var(--hint)' }}>
          {filter.filtered.length} dataset{filter.filtered.length !== 1 ? 's' : ''}
          {filter.category !== 'All' ? ` in ${filter.category}` : ''}
          {filter.search ? ` matching "${filter.search}"` : ''}
        </div>

        <DatasetGrid
          datasets={filter.filtered}
          onPreview={setPreview}
          onDownload={handleDownload}
          walletAddress={walletAddress}
        />

        {dl.result && (
          <DownloadResult
            dataset={dl.result}
            onSave={dl.saveJson}
            onClose={dl.clear}
          />
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <PreviewModal
          entry={preview}
          walletAddress={walletAddress}
          onClose={() => setPreview(null)}
          onDownload={handleDownload}
        />
      )}

      {/* Downloading indicator */}
      {dl.downloading && (
        <div
          className="fixed bottom-6 left-6 z-50 text-sm font-mono px-4 py-3 rounded-xl flex items-center gap-2"
          style={{ background: 'var(--surface2)', color: 'var(--green)', border: '1px solid rgba(0,217,163,0.2)' }}
        >
          <span className="pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: 'var(--green)' }} />
          Fetching from Shelby...
        </div>
      )}

      {/* Toast */}
      {toast.message && <Toast message={toast.message} onDone={toast.clear} />}
    </div>
  );
}
