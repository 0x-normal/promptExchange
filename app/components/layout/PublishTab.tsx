'use client';

import { useState } from 'react';
import type { PromptSample } from '../../../src/types/dataset';
import { CAT_ICONS } from '../../lib/datasets';

interface PublishTabProps {
  walletAddress: string | null;
  onConnect: () => void;
}

interface PublishResult {
  blobName: string;
  accountAddress: string;
  explorerUrl: string;
}

export function PublishTab({ walletAddress, onConnect }: PublishTabProps) {
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [result, setResult]       = useState<PublishResult | null>(null);

  // Form fields
  const [privateKey, setPrivateKey] = useState('');
  const [name, setName]             = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory]     = useState('reasoning');
  const [tags, setTags]             = useState('');
  const [price, setPrice]           = useState('0');
  const [quality, setQuality]       = useState('4');
  const [promptsRaw, setPromptsRaw] = useState(
`[
  {
    "instruction": "What is the difference between supervised and unsupervised learning?",
    "output": "Supervised learning uses labeled data to train models. Unsupervised learning finds patterns in unlabeled data."
  },
  {
    "instruction": "Explain gradient descent in simple terms.",
    "output": "Gradient descent is like walking downhill with your eyes closed — you feel the slope and take small steps downward until you reach the lowest point."
  }
]`
  );

  function promptCount(): string {
    try { return JSON.parse(promptsRaw).length + ' prompts'; }
    catch { return 'invalid JSON'; }
  }

  async function handlePublish() {
    if (!walletAddress) { onConnect(); return; }
    setLoading(true);
    setError('');
    try {
      let prompts: PromptSample[];
      try { prompts = JSON.parse(promptsRaw); }
      catch { throw new Error('Invalid JSON. Check your prompts format.'); }

      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privateKey,
          metadata: {
            name, description, category,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            promptCount: prompts.length,
            qualityScore: parseInt(quality),
            price: parseFloat(price) || 0,
            creatorAddress: walletAddress,
            createdAt: '', expiresAt: '',
          },
          prompts,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (result) return (
    <div className="max-w-lg mx-auto space-y-5 animate-fade-up">
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: 'rgba(0,217,163,0.06)', border: '1px solid rgba(0,217,163,0.25)' }}
      >
        <div className="font-display font-bold text-white text-2xl">🎉 Live on Shelby!</div>
        <div className="space-y-3 font-mono text-sm">
          {[['Blob', result.blobName], ['Account', result.accountAddress]].map(([k, v]) => (
            <div key={k}>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--hint)' }}>{k}</div>
              <div className="break-all" style={{ color: 'var(--green)' }}>{v}</div>
            </div>
          ))}
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--hint)' }}>Explorer</div>
            <a href={result.explorerUrl} target="_blank" rel="noreferrer"
              className="break-all underline" style={{ color: 'var(--green)' }}>
              {result.explorerUrl}
            </a>
          </div>
        </div>
      </div>
      <button
        onClick={() => { setResult(null); setName(''); setDescription(''); }}
        className="w-full py-3 rounded-xl font-display font-semibold text-sm transition-all"
        style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}
      >
        Publish Another
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Wallet warning */}
      {!walletAddress && (
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)' }}
        >
          <div>
            <div className="font-display font-semibold text-white text-sm">Connect your wallet to publish</div>
            <div className="text-[12px] font-mono mt-0.5" style={{ color: 'var(--muted)' }}>
              You need APT + ShelbyUSD to pay for storage
            </div>
          </div>
          <button onClick={onConnect} className="wallet-btn">Connect Wallet</button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="rounded-xl p-4 text-sm font-mono"
          style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)', color: 'var(--red)' }}
        >
          ✗ {error}
        </div>
      )}

      {/* Form fields */}
      <Field label="Aptos Private Key">
        <input value={privateKey} onChange={e => setPrivateKey(e.target.value)} type="password"
          placeholder="ed25519-priv-0x... (from shelby account list)" className="field-input" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Dataset Name">
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. ArabicInstruct-50K" className="field-input" />
        </Field>
        <Field label="Category">
          <select value={category} onChange={e => setCategory(e.target.value)} className="field-input">
            {['reasoning','coding','instruction','roleplay','multilingual','math'].map(c => (
              <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
          placeholder="What makes this dataset unique?" className="field-input resize-none" />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Tags (comma separated)">
          <input value={tags} onChange={e => setTags(e.target.value)}
            placeholder="arabic, instruction" className="field-input" />
        </Field>
        <Field label="Price (ShelbyUSD)">
          <input value={price} onChange={e => setPrice(e.target.value)} type="number" min="0"
            placeholder="0 = free" className="field-input" />
        </Field>
        <Field label="Quality (1–5)">
          <input value={quality} onChange={e => setQuality(e.target.value)} type="number" min="1" max="5"
            className="field-input" />
        </Field>
      </div>

      <Field label={`Prompts JSON — ${promptCount()}`}>
        <textarea value={promptsRaw} onChange={e => setPromptsRaw(e.target.value)} rows={10}
          className="field-input font-mono text-[12px] resize-none"
          style={{ background: '#06060f' }} />
      </Field>

      <button onClick={handlePublish} disabled={loading || !name || !promptsRaw} className="btn-primary">
        {loading ? '⏳ Uploading to Shelby...' : '🚀 Publish Dataset to Shelby'}
      </button>

      <p className="text-center text-[11px] font-mono" style={{ color: 'var(--hint)' }}>
        Stored as a blob on Shelby Testnet · Registry updated on-chain · Expires in 30 days
      </p>
    </div>
  );
}

// Small helper for consistent form field layout
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-mono uppercase tracking-wider mb-1.5"
        style={{ color: 'var(--hint)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
