'use client';

import { useState, useMemo } from 'react';
import { DEMO_DATASETS, type Category } from '../lib/datasets';
import type { RegistryEntry } from '../../src/types/dataset';

export type SortOption = 'featured' | 'quality' | 'size' | 'price-asc' | 'price-desc';

export interface DatasetFilterState {
  search: string;
  category: Category;
  sort: SortOption;
  setSearch: (v: string) => void;
  setCategory: (v: Category) => void;
  setSort: (v: SortOption) => void;
  filtered: RegistryEntry[];
  total: number;
}

export function useDatasetFilter(): DatasetFilterState {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [sort, setSort] = useState<SortOption>('featured');

  const filtered = useMemo(() => {
    let result = DEMO_DATASETS.filter(e => {
      const matchesCat = category === 'All' || e.metadata.category === category;
      const matchesSearch =
        !search ||
        e.metadata.name.toLowerCase().includes(search.toLowerCase()) ||
        e.metadata.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        e.metadata.description.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });

    switch (sort) {
      case 'quality':   return [...result].sort((a, b) => b.metadata.qualityScore - a.metadata.qualityScore);
      case 'size':      return [...result].sort((a, b) => b.metadata.promptCount - a.metadata.promptCount);
      case 'price-asc': return [...result].sort((a, b) => a.metadata.price - b.metadata.price);
      case 'price-desc':return [...result].sort((a, b) => b.metadata.price - a.metadata.price);
      default:          return result;
    }
  }, [search, category, sort]);

  return {
    search, category, sort,
    setSearch, setCategory, setSort,
    filtered,
    total: DEMO_DATASETS.length,
  };
}
