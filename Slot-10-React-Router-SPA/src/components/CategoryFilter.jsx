import { useSearchParams } from 'react-router-dom';
import { ORCHID_CATEGORIES } from '../data/orchids';

export default function CategoryFilter({ currentCategory, totalCount, filteredCount }) {
  const [, setSearchParams] = useSearchParams();

  const handleSelectCategory = (category) => {
    if (category === 'All') {
      // Clear query params for clean URL: /orchids
      setSearchParams({});
    } else {
      // Set query param: /orchids?category=CategoryName
      setSearchParams({ category });
    }
  };

  return (
    <div className="mb-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
        <label className="fw-semibold text-secondary small text-uppercase tracking-wider">
          Filter by Genus / Category:
        </label>
        <span className="text-muted small">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> orchids
        </span>
      </div>

      <div className="category-filter-bar" role="group" aria-label="Orchid category filter buttons">
        {ORCHID_CATEGORIES.map((cat) => {
          const isActive = (currentCategory?.toLowerCase() === cat.toLowerCase()) || 
                           (cat === 'All' && (!currentCategory || currentCategory.toLowerCase() === 'all'));

          return (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectCategory(cat)}
              aria-pressed={isActive}
            >
              {cat === 'All' ? '🌿 All Species' : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
