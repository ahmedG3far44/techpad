import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { IProduct } from "../utils/types";
import { searchProducts } from "../utils/handlers";
import { BiPackage, BiSearch } from "react-icons/bi";
import SEO from "../components/SEO";
import Header from "../components/landing/Header";
import ProductCard from "../components/ProductCard";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    async function fetchResults() {
      setIsLoading(true);
      const results = await searchProducts(query);
      setProducts(results);
      setIsLoading(false);
    }

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <SEO title={`Search: ${query || "All Products"}`} description={`Search results for "${query}"`} />
      <Header />

      <header className="border-b-2 border-zinc-200 sticky top-0 z-40 shadow-md backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-3">
                <BiSearch className="text-blue-600" />
                {query ? `"${query}"` : "All Products"}
              </h1>
              <p className="text-sm text-zinc-600 mt-2 font-medium">
                {isLoading ? "Searching..." : `${products.length} ${products.length === 1 ? "result" : "results"} found`}
              </p>
            </div>
            <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
              <Link to="/" className="text-zinc-600 hover:text-blue-600 transition-colors">Home</Link>
              <span className="text-zinc-400">/</span>
              <span className="text-blue-600 font-bold">Search</span>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <BiPackage className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-zinc-600 font-medium">Searching products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-zinc-200 p-12 text-center shadow-lg">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiSearch className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">No results found</h3>
            <p className="text-zinc-600 mb-6 max-w-md mx-auto">
              {query ? `We couldn't find anything matching "${query}". Try a different search term.` : "Enter a search term to find products."}
            </p>
            <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl inline-block">
              Browse all products
            </Link>
          </div>
        ) : (
          <div role="list" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchResults;
