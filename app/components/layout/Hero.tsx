import { DEMO_DATASETS } from '../../lib/datasets';

export function Hero() {
  const totalPrompts = DEMO_DATASETS.reduce((s, e) => s + e.metadata.promptCount, 0);
  const freeCount = DEMO_DATASETS.filter(e => e.metadata.price === 0).length;

  const stats = [
    { label: 'Datasets',      value: DEMO_DATASETS.length },
    { label: 'Total Prompts', value: totalPrompts.toLocaleString() },
    { label: 'Free Datasets', value: freeCount },
    { label: 'Storage',       value: 'Shelby Blobs' },
  ];

  return (
    <section className="px-6 pt-12 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,217,163,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl animate-fade-up">
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 text-[11px] font-mono px-3 py-1.5 rounded-full mb-5"
            style={{
              background: 'rgba(0,217,163,0.08)',
              border: '1px solid rgba(0,217,163,0.2)',
              color: 'var(--green)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--green)' }} />
            {DEMO_DATASETS.length} datasets live on Shelby Testnet
          </div>

          <h1 className="font-display font-bold text-5xl text-white leading-[1.05] mb-4 tracking-tight">
            The Marketplace for<br />
            <span style={{ color: 'var(--green)' }}>AI Prompt Datasets</span>
          </h1>

          <p className="text-base leading-relaxed max-w-lg animate-fade-up-2" style={{ color: 'var(--muted)' }}>
            Buy, sell, and discover high-quality prompt datasets for AI training.
            Every dataset stored as a blob on{' '}
            <a
              href="https://shelby.xyz"
              target="_blank"
              rel="noreferrer"
              className="underline"
              style={{ color: 'var(--green)' }}
            >
              Shelby Protocol
            </a>
            {' '}— decentralized, permanent, censorship-resistant.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 animate-fade-up-3">
          {stats.map(s => (
            <div
              key={s.label}
              className="rounded-xl p-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--hint)' }}>
                {s.label}
              </div>
              <div className="font-display font-bold text-xl text-white">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
