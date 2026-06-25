import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../types';
import Button from '../components/ui/Button';

const ITEMS_PER_PAGE = 12;

function getStockBadge(stock: number): { label: string; className: string } {
  if (stock > 10) {
    return { label: 'In Stock', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (stock > 0) {
    return { label: 'Low Stock', className: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
  return { label: 'Out of Stock', className: 'bg-red-50 text-red-700 border-red-200' };
}

export default function ProductListPage() {
  const { data: products, isLoading, isError } = useProducts();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.store.name.toLowerCase().includes(search.toLowerCase());

      const matchesPriceRange =
        (!priceMin || Number(p.price) >= Number(priceMin)) &&
        (!priceMax || Number(p.price) <= Number(priceMax));

      const matchesStock = !inStockOnly || p.stock > 0;

      return matchesSearch && matchesPriceRange && matchesStock;
    });

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, sortBy, priceMin, priceMax, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalProducts = products?.length ?? 0;
  const availableProducts = products?.filter((p) => p.stock > 0).length ?? 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setPriceMin('');
    setPriceMax('');
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters = search || priceMin || priceMax || inStockOnly;

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center gap-1.5 mt-10">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {pages.map((page, idx) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-2 text-sm text-gray-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`min-w-[36px] h-9 text-sm font-medium rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Browse Marketplace</h1>
          <p className="text-base text-gray-500 mt-1">
            Discover professional maritime equipment and services.
          </p>
          {!isLoading && !isError && products && (
            <p className="text-sm text-gray-400 mt-2">
              {totalProducts} total products &middot; {availableProducts} in stock
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Search</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Price Range */}
              <details className="group" open>
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-700 list-none">
                  Price Range
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => { setPriceMin(e.target.value); setCurrentPage(1); }}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                  />
                  <span className="text-gray-400 text-sm">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => { setPriceMax(e.target.value); setCurrentPage(1); }}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                  />
                </div>
              </details>

              <hr className="border-gray-100" />

              {/* Availability */}
              <details className="group" open>
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-700 list-none">
                  Availability
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="availability"
                      checked={!inStockOnly}
                      onChange={() => { setInStockOnly(false); setCurrentPage(1); }}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">All Items</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="availability"
                      checked={inStockOnly}
                      onChange={() => { setInStockOnly(true); setCurrentPage(1); }}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">In Stock Only</span>
                  </label>
                </div>
              </details>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full text-sm font-medium text-primary-600 hover:text-primary-700 py-2.5 rounded-xl border border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{paginatedProducts.length}</span> of{' '}
                <span className="font-medium text-gray-700">{filteredProducts.length}</span> products
              </p>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="self-start sm:self-auto rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse shadow-sm">
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-5 bg-gray-100 rounded w-1/3" />
                      <div className="h-9 bg-gray-100 rounded w-full mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-600 mb-1">Failed to load products</p>
                <p className="text-sm text-gray-500">Please try again later.</p>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => {
                    const stockBadge = getStockBadge(product.stock);
                    return (
                      <div
                        key={product.id}
                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
                      >
                        {/* Image */}
                        <Link to={`/products/${product.id}`} className="block aspect-square bg-gray-50 overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </Link>

                        {/* Content */}
                        <div className="p-4">
                          {/* Stock Badge */}
                          <span className={`inline-flex self-start items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${stockBadge.className}`}>
                            {stockBadge.label}
                          </span>

                          {/* Product Name */}
                          <Link to={`/products/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 text-sm mt-2 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Store Name */}
                          <p className="text-xs text-gray-500 truncate mt-1 mb-1">
                            {product.store.name}
                          </p>

                          {/* Price */}
                          <p className="text-lg font-bold text-primary-600 mt-2">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {renderPagination()}
              </>
            ) : search || priceMin || priceMax || inStockOnly ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-600 mb-1">No products match your filters</p>
                <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-lg text-gray-600 mb-1">No products available yet.</p>
                <p className="text-sm text-gray-500">Check back later for new products.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
