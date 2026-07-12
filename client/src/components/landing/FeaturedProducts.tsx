import { IProduct } from "../../utils/types";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../utils/handlers";
import ProductCard from "../ProductCard";
import Button from "../Button";

function FeaturedProducts() {
  const [displayProducts, setDisplayProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleGetProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const products = await getAllProducts();
        setDisplayProducts(products as IProduct[]);
      } catch (err: unknown) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    handleGetProducts();
  }, []);

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-surface-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900">
              Featured Products
            </h2>
            <p className="text-surface-500 mt-2 text-sm sm:text-base">
              Handpicked favorites for your setup
            </p>
          </div>
          <Button variant="outline" size="md" to="/category/keyboards">
            View All
          </Button>
        </div>

        {isLoading && (
          <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-surface-200 border-t-primary-600" />
            <p className="text-surface-500 text-sm">Loading products...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
              <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && displayProducts.length === 0 && (
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <div className="text-center max-w-md">
              <svg className="mx-auto h-16 w-16 text-surface-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">No Products Available</h3>
              <p className="text-sm text-surface-500">Check back soon for new products!</p>
            </div>
          </div>
        )}

        {!isLoading && !error && displayProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {displayProducts.slice(0, 8).map((product) => (
              <div key={product._id} className="bg-white rounded-xl border border-surface-200 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
