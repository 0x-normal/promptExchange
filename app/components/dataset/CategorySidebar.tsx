import { DEMO_DATASETS, CATEGORIES, CAT_ICONS, type Category } from '../../lib/datasets';

interface CategorySidebarProps {
  active: Category;
  onChange: (cat: Category) => void;
}

export function CategorySidebar({ active, onChange }: CategorySidebarProps) {
  return (
    <aside className="w-48 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-1">
        <div
          className="text-[10px] font-mono uppercase tracking-widest mb-3 px-3"
          style={{ color: 'var(--hint)' }}
        >
          Categories
        </div>

        {CATEGORIES.map(cat => {
          const count =
            cat === 'All'
              ? DEMO_DATASETS.length
              : DEMO_DATASETS.filter(e => e.metadata.category === cat).length;

          return (
            <button
              key={cat}
              className={`cat-btn ${active === cat ? 'active' : ''}`}
              onClick={() => onChange(cat)}
            >
              <span>{CAT_ICONS[cat]} {cat}</span>
              <span className="text-[10px]">{count}</span>
            </button>
          );
        })}

        {/* Summary stats */}
        <div className="pt-4 space-y-2">
          <div
            className="text-[10px] font-mono uppercase tracking-widest px-3 mb-2"
            style={{ color: 'var(--hint)' }}
          >
            Stats
          </div>
          {[
            ['Datasets',      DEMO_DATASETS.length],
            ['Total Prompts', DEMO_DATASETS.reduce((s, e) => s + e.metadata.promptCount, 0).toLocaleString()],
            ['Free',          DEMO_DATASETS.filter(e => e.metadata.price === 0).length],
          ].map(([k, v]) => (
            <div
              key={k as string}
              className="px-3 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="text-[10px] font-mono" style={{ color: 'var(--hint)' }}>{k}</div>
              <div className="text-sm font-display font-semibold text-white">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
