'use client';

import { useEffect } from 'react';
import type { RegistryEntry } from '../../../src/types/dataset';
import { CAT_ICONS } from '../../lib/datasets';
import { PriceTag } from '../ui/PriceTag';

interface PreviewModalProps {
  entry: RegistryEntry;
  walletAddress: string | null;
  onClose: () => void;
  onDownload: (entry: RegistryEntry) => void;
}

export function PreviewModal({ entry, walletAddress, onClose, onDownload }: PreviewModalProps) {
  const m = entry.metadata;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 flex flex-col gap-5"
        style={{ background: '#0f0f1a', border: '1px solid rgba(0,217,163,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'rgba(0,217,163,0.1)', border: '1px solid rgba(0,217,163,0.2)' }}
            >
              {CAT_ICONS[m.category]}
            </div>
            <div>
              <div className="font-display font-bold text-white text-lg">{m.name}</div>
              <div className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--muted)' }}>
                by {m.creatorAddress}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: 'var(--hint)' }}>×</button>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['Prompts',  m.promptCount.toLocaleString()],
            ['Category', m.category],
            ['Quality',  `${m.qualityScore}/5`],
            ['Price',    m.price === 0 ? 'Free' : `$${m.price} ShelbyUSD`],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-[10px] font-mono mb-1" style={{ color: 'var(--hint)' }}>{k}</div>
              <div className="text-sm font-semibold text-white">{v}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
          {m.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {m.tags.map(t => (
            <span key={t} className="tag-pill">{t}</span>
          ))}
        </div>

        {/* Sample prompts */}
        {m.preview && m.preview.length > 0 && (
          <div>
            <div className="text-[11px] font-mono mb-3 uppercase tracking-wider" style={{ color: 'var(--hint)' }}>
              Sample prompts
            </div>
            <div className="space-y-3">
              {m.preview.map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 space-y-2"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--green)' }}>
                    Instruction
                  </div>
                  <div className="text-[13px] text-white">{p.instruction}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--hint)' }}>
                    Output
                  </div>
                  <div className="text-[12px] font-mono whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>
                    {p.output}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blob path */}
        <div
          className="rounded-xl p-3 text-[11px] font-mono"
          style={{ background: 'rgba(0,217,163,0.05)', border: '1px solid rgba(0,217,163,0.15)' }}
        >
          <span style={{ color: 'var(--hint)' }}>Blob: </span>
          <span style={{ color: 'var(--green)' }}>{entry.blobName}</span>
        </div>

        {/* CTA */}
        <button
          className="btn-primary"
          onClick={() => { onDownload(entry); onClose(); }}
        >
          {m.price === 0
            ? '⬇ Download from Shelby'
            : walletAddress
              ? `⬇ Buy for $${m.price} ShelbyUSD`
              : '🔗 Connect Wallet to Buy'}
        </button>
      </div>
    </div>
  );
}
