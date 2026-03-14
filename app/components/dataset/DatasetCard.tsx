import type { RegistryEntry } from '../../../src/types/dataset';
import { CAT_ICONS } from '../../lib/datasets';
import { Stars } from '../ui/Stars';
import { PriceTag } from '../ui/PriceTag';

interface DatasetCardProps {
  entry: RegistryEntry;
  index: number;
  onPreview: (entry: RegistryEntry) => void;
  onDownload: (entry: RegistryEntry) => void;
  walletAddress: string | null;
}

export function DatasetCard({
  entry, index, onPreview, onDownload, walletAddress,
}: DatasetCardProps) {
  const m = entry.metadata;

  return (
    <div
      className="ds-card bg-[#0f0f1a] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 flex flex-col gap-4 cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onPreview(entry)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: 'rgba(0,217,163,0.1)', border: '1px solid rgba(0,217,163,0.2)' }}
          >
            {CAT_ICONS[m.category] ?? '📦'}
          </div>
          <div>
            <div className="font-display font-semibold text-white text-[14px] leading-tight">
              {m.name}
            </div>
            <div className="text-[10px] font-mono mt-0.5 truncate max-w-[140px]"
              style={{ color: 'var(--hint)' }}>
              {m.creatorAddress}
            </div>
          </div>
        </div>
        <PriceTag price={m.price} />
      </div>

      {/* Description */}
      <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
        {m.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {m.tags.slice(0, 4).map(t => (
          <span key={t} className="tag-pill">{t}</span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
        <span>{m.promptCount.toLocaleString()} prompts</span>
        <span style={{ color: 'var(--hint)' }}>·</span>
        <Stars score={m.qualityScore} />
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'var(--hint)' }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot inline-block"
            style={{ background: 'var(--green)' }} />
          Shelby Testnet
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDownload(entry); }}
          className="text-[11px] font-display font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
          style={{ background: 'var(--green)', color: '#000' }}
        >
          {m.price === 0 ? 'Download' : walletAddress ? 'Buy' : 'Connect to Buy'}
        </button>
      </div>
    </div>
  );
}
