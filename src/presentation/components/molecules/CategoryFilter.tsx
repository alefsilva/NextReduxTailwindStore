'use client';

import { useGetCategoriesQuery } from '@/infra/api/productsApi';
import { Spinner } from '@/presentation/components/atoms/Spinner';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelect }: CategoryFilterProps) {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  const all = [null, ...(categories ?? [])];

  return (
    <nav aria-label="Filter by category">
      <ul className="flex flex-wrap gap-2">
        {all.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <li key={category ?? 'all'}>
              <button
                onClick={() => onSelect(category)}
                aria-pressed={isActive}
                className={`
                  rounded-full px-4 py-1.5 text-body-sm font-medium capitalize
                  transition-colors duration-normal
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
                  ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }
                `}
              >
                {category ?? 'All'}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
