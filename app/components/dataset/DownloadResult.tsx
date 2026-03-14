import type { ShelbyDatasetBlob } from '../../../src/types/dataset';

interface DownloadResultProps {
  dataset: ShelbyDatasetBlob;
  onSave: () => void;
  onClose: () => void;
}

export function DownloadResult({ dataset, onSave, onClose }: DownloadResultProps) {
  const m = dataset.metadata;

  return (
    <div
      className="rounded-2xl p-5 space-y-4 animate-fade-up"
      style={{ background: 'rgba(0,217,163,0.05)', border: '1px solid rgba(0,217,163,0.2)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-display font-semibold text-white">✅ {m.name}</span>
          <span className="text-[12px] font-mono ml-2" style={{ color: 'var(--muted)' }}>
            {dataset.prompts.length} prompts from Shelby
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="text-[12px] font-mono px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--green)', color: '#000' }}
          >
            Save JSON
          </button>
          <button
            onClick={onClose}
            className="text-[12px] font-mono px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Prompt preview */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {dataset.prompts.slice(0, 5).map((p, i) => (
          <div
            key={i}
            className="rounded-xl p-3"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="text-[11px] font-mono" style={{ color: 'var(--green)' }}>
              → {p.instruction}
            </div>
            <div className="text-[11px] font-mono mt-1 whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>
              {p.output.slice(0, 200)}{p.output.length > 200 ? '...' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
