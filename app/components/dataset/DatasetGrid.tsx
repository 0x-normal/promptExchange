import type { RegistryEntry } from '../../../src/types/dataset';
import { DatasetCard } from './DatasetCard';

interface DatasetGridProps {
  datasets: RegistryEntry[];
  onPreview: (entry: RegistryEntry) => void;
  onDownload: (entry: RegistryEntry) => void;
  walletAddress: string | null;
}

export function DatasetGrid({ datasets, onPreview, onDownload, walletAddress }: DatasetGridProps) {
  if (datasets.length === 0) {
    return (
      <div className="py-20 text-center font-mono text-sm" style={{ color: 'var(--hint)' }}>
        No datasets found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {datasets.map((entry, i) => (
        <DatasetCard
          key={entry.blobName}
          entry={entry}
          index={i}
          onPreview={onPreview}
          onDownload={onDownload}
          walletAddress={walletAddress}
        />
      ))}
    </div>
  );
}
