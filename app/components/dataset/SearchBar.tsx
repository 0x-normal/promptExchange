import type { SortOption } from '../../hooks/useDatasetFilter';

interface SearchBarProps {
  search: string;
  sort: SortOption;
  onSearchChange: (v: string) => void;
  onSortChange: (v: SortOption) => void;
}

export function SearchBar({ search, sort, onSearchChange, onSortChange }: SearchBarProps) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
          style={{ color: 'var(--hint)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search datasets, tags, descriptions..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-[var(--hint)]"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        />
      </div>

      <select
        value={sort}
        onChange={e => onSortChange(e.target.value as SortOption)}
        className="px-4 py-2.5 rounded-xl text-sm font-mono"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
      >
        <option value="featured">Featured</option>
        <option value="quality">Top Rated</option>
        <option value="size">Largest</option>
        <option value="price-asc">Cheapest</option>
        <option value="price-desc">Most Expensive</option>
      </select>
    </div>
  );
}
