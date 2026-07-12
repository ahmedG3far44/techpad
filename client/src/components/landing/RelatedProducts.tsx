import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import ProductCard from "../ProductCard";
import { IProduct } from "../../utils/types";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

interface RelatedProductsProps {
  categoryName: string;
  currentProductId: string;
}

function RelatedProducts({ categoryName, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/product/category/${encodeURIComponent(categoryName)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch related products");
        }

        const data = await response.json();
        const filtered = data.filter(
          (product: IProduct) =>
            product.categoryName === categoryName && product._id !== currentProductId
        );
        setProducts(filtered);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load related products");
        console.error(err?.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [categoryName, currentProductId]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-surface-900 mb-6">
          Related Products
        </h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-100 rounded-xl h-72 min-w-[200px] sm:min-w-[240px] flex-shrink-0 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-xl sm:text-2xl font-bold text-surface-900 mb-6">
        Related Products in{" "}
        <span className="text-primary-600">{categoryName}</span>
      </h2>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2.5 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -ml-3 sm:-ml-4"
          aria-label="Scroll left"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-surface-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="flex-shrink-0 w-[220px] sm:w-[260px] snap-start"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2.5 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mr-3 sm:-mr-4"
          aria-label="Scroll right"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-surface-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default RelatedProducts;
