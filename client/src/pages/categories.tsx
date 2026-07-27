import { IProduct } from "../utils/types";
import { useState, useMemo, useEffect } from "react";
import { FiAlertCircle, FiFilter } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { BiChevronDown, BiPackage, BiX } from "react-icons/bi";
import { getAllProducts } from "../utils/handlers";
import SEO from "../components/SEO";

import Header from "../components/landing/Header";
import ProductCard from "../components/ProductCard";

interface FilterState {
  priceRange: [number, number];
  inStock: boolean | null;
  sortBy: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
}

function FilterSidebar({
  filters,
  onFilterChange,
  priceRange,
  totalProducts,
  filteredCount,
}: {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  priceRange: [number, number];
  totalProducts: number;
  filteredCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (index: 0 | 1, value: string) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = parseFloat(value) || 0;
    onFilterChange({ priceRange: newRange });
  };

  const resetFilters = () => {
    onFilterChange({
      priceRange: priceRange,
      inStock: null,
      sortBy: "newest",
    });
  };

  const activeFilterCount = [
    filters.inStock !== null ? 1 : 0,
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1]
      ? 1
      : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="lg:hidden mb-6 flex items-center justify-between gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white border-2 border-zinc-200 rounded-xl px-5 py-3 font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
        >
          <FiFilter className="w-5 h-5" />
          Filters{" "}
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        <div className="bg-white border-2 border-zinc-200 rounded-xl px-4 py-3 shadow-sm">
          <span className="text-sm font-semibold text-zinc-900">
            {filteredCount}
            <span className="text-zinc-500 font-normal">
              {" "}
              / {totalProducts}
            </span>
          </span>
        </div>
      </div>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        role="region"
        aria-label="Product filters"
        className={`
        lg:block bg-white rounded-2xl border-2 border-zinc-200 p-6 space-y-6 h-fit lg:sticky lg:top-4 shadow-lg
        ${
          isOpen
            ? "block fixed inset-y-0 left-0 right-16 z-50 overflow-y-auto"
            : "hidden"
        }
      `}
      >
        {isOpen && (
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900">Filter Products</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <BiX className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 hidden lg:block">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Reset All
            </button>
          )}
        </div>

        <div className="hidden lg:block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
          <div className="flex items-center gap-2 text-blue-900">
            <BiPackage className="w-5 h-5" />
            <p className="text-sm font-medium">
              <span className="font-bold text-lg">{filteredCount}</span> of{" "}
              <span className="font-bold text-lg">{totalProducts}</span>{" "}
              products
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-900">
            <BiChevronDown className="w-4 h-4" />
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as FilterState["sortBy"],
              })
            }
            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-white hover:border-zinc-300 transition-colors"
          >
            <option value="newest"> Newest First</option>
            <option value="price-asc">Low to High</option>
            <option value="price-desc"> High to Low</option>
            <option value="name-asc"> A to Z</option>
            <option value="name-desc">Z to A</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-zinc-900">
            Price Range
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                placeholder="Min"
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
              />
            </div>
            <div className="w-8 h-0.5 bg-zinc-300 flex-shrink-0" />
            <div className="flex-1">
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                placeholder="Max"
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold text-zinc-900">
              ${filters.priceRange[0]}
            </span>
            <span className="text-sm font-bold text-zinc-900">
              ${filters.priceRange[1]}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-zinc-900">
            Availability
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-zinc-50 transition-colors">
              <input
                type="radio"
                checked={filters.inStock === null}
                onChange={() => onFilterChange({ inStock: null })}
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                All Products
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-green-50 transition-colors">
              <input
                type="radio"
                checked={filters.inStock === true}
                onChange={() => onFilterChange({ inStock: true })}
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-zinc-700 group-hover:text-green-900">
                In Stock Only
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-red-50 transition-colors">
              <input
                type="radio"
                checked={filters.inStock === false}
                onChange={() => onFilterChange({ inStock: false })}
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-zinc-700 group-hover:text-red-900">
                Out of Stock
              </span>
            </label>
          </div>
        </div>

        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Apply Filters
          </button>
        )}
      </aside>
    </>
  );
}

function CategoryPage() {
  const { categoryName } = useParams();

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    inStock: null,
    sortBy: "newest",
  });

  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleGetProducts() {
      try {
        setIsLoading(true);

        const products = await getAllProducts();

        const filterCategoryProducts = products.filter(
          (product) =>
            product.categoryName ===
              categoryName?.split(" ").join("-").trim().toLocaleLowerCase() ||
            product.categoryName.toLocaleUpperCase() ===
              categoryName?.split("-").join(" ").toUpperCase()
        );

        setAllProducts(filterCategoryProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    handleGetProducts();
  }, [categoryName]);

  const absolutePriceRange = useMemo<[number, number]>(() => {
    if (allProducts.length === 0) return [0, 1000];
    const prices = allProducts.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [allProducts]);

  useEffect(() => {
    if (allProducts.length > 0) {
      setFilters((prev) => ({ ...prev, priceRange: absolutePriceRange }));
    }
  }, [allProducts.length]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.inStock === true) {
      filtered = filtered.filter((p) => p.stock > 0);
    } else if (filters.inStock === false) {
      filtered = filtered.filter((p) => p.stock === 0);
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <SEO title={categoryName ? `${categoryName} Products` : "Categories"} description={`Browse ${categoryName || "all"} products.`} />
      <Header />
      <header className=" border-b-2 border-zinc-200 sticky top-0 z-40 shadow-md backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-surface-900">
                {categoryName}
              </h1>
              <p className="text-sm text-zinc-600 mt-2 font-medium">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}{" "}
                available
              </p>
            </div>
            <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
              <a
                href="/"
                className="text-zinc-600 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <span className="text-zinc-400">/</span>
              <span className="text-zinc-600 hover:text-blue-600 transition-colors">
                Categories
              </span>
              <span className="text-zinc-400">/</span>
              <span className="text-blue-600 font-bold">{categoryName}</span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-72 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              priceRange={absolutePriceRange}
              totalProducts={allProducts.length}
              filteredCount={filteredProducts.length}
            />
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                  <BiPackage className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-4 text-zinc-600 font-medium">
                  Loading products...
                </p>
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-zinc-200 p-12 text-center shadow-lg">
                    <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiAlertCircle className="w-10 h-10 text-zinc-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-zinc-600 mb-6 max-w-md mx-auto">
                      We couldn't find any products matching your filters. Try
                      adjusting your criteria to see more results.
                    </p>
                    <button
                      onClick={() =>
                        handleFilterChange({
                          priceRange: absolutePriceRange,
                          inStock: null,
                        })
                      }
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div role="list" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id} {...product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;
