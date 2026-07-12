import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IProduct } from "../utils/types";
import SEO from "../components/SEO";

import toast from "react-hot-toast";
import Header from "../components/landing/Header";
import Container from "../components/Container";
import ProductInfo from "../components/ProductInfo";
import RelatedProducts from "../components/landing/RelatedProducts";

import { FaShippingFast } from "react-icons/fa";
import { MdPolicy, MdVerified } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { HiClock, HiTag } from "react-icons/hi";
import { BiCategory } from "react-icons/bi";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function RecentlyViewed() {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      try {
        const ids: string[] = JSON.parse(stored);
        setRecentIds(ids.slice(0, 6));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (recentIds.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchRecent() {
      try {
        const results = await Promise.all(
          recentIds.map((id) =>
            fetch(`${BASE_URL}/product/${id}`).then((r) => r.json())
          )
        );
        setProducts(
          results.filter((p): p is IProduct => p && p._id)
        );
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, [recentIds]);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-xl sm:text-2xl font-bold text-surface-900 mb-6 flex items-center gap-2">
        <HiClock className="text-primary-600" />
        Recently Viewed
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            className="group block bg-white rounded-xl border border-surface-200 overflow-hidden hover:border-primary-200 hover:shadow-md transition-all"
          >
            <div className="aspect-square bg-surface-100">
              <img
                src={p.images?.[0] || "/placeholder.svg"}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-2.5">
              <p className="text-xs sm:text-sm font-medium text-surface-800 line-clamp-1">
                {p.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const serviceItems = [
  {
    icon: FaShippingFast,
    title: "Free Shipping",
    desc: "Free shipping on your first order",
  },
  {
    icon: AiFillProduct,
    title: "Easy Returns",
    desc: "30-day hassle-free return policy",
  },
  {
    icon: IoShieldCheckmarkOutline,
    title: "Quality Guarantee",
    desc: "100% authentic products guaranteed",
  },
  {
    icon: MdPolicy,
    title: "Secure Checkout",
    desc: "Encrypted & secure payment processing",
  },
];

function ProductDetails() {
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function getProductById(productId: string) {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/product/${productId}`);
        if (!response.ok) {
          throw new Error("Can't get product details, check your connection!");
        }
        const productInfo = await response.json();
        setProductInfo({ ...productInfo });
      } catch (err: any) {
        toast.error(err?.message);
        console.error(err?.message);
      } finally {
        setLoading(false);
      }
    }

    getProductById(id);
  }, [id]);

  useEffect(() => {
    if (productInfo?._id && id) {
      try {
        const stored = localStorage.getItem("recentlyViewed");
        let ids: string[] = stored ? JSON.parse(stored) : [];
        ids = [id, ...ids.filter((i: string) => i !== id)].slice(0, 10);
        localStorage.setItem("recentlyViewed", JSON.stringify(ids));
      } catch {
        // ignore
      }
    }
  }, [productInfo?._id, id]);

  if (loading) {
    return (
      <Container>
        <Header />
        <div className="py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-surface-200 rounded w-48" />
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 h-80 lg:h-[500px] bg-surface-200 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-surface-200 rounded w-3/4" />
                <div className="h-4 bg-surface-200 rounded w-1/4" />
                <div className="h-20 bg-surface-200 rounded" />
                <div className="h-6 bg-surface-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!productInfo) {
    return (
      <Container>
        <Header />
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
          <p className="text-surface-500 text-lg">Product not found</p>
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to home
          </Link>
        </div>
      </Container>
    );
  }

  const { title, description, images, price, stock } = productInfo;
  const jsonLd = { "@context": "https://schema.org/", "@type": "Product", name: title, description, image: images?.[0], offers: { "@type": "Offer", price, priceCurrency: "USD", availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };

  return (
    <Container>
      <SEO title={title} description={description?.substring(0, 160)} jsonLd={jsonLd} />
      <Header />
      <nav className="flex items-center gap-2 text-sm text-surface-500 pt-6 pb-2">
        <Link to="/" className="hover:text-primary-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to={`/category/${productInfo.categoryName
            .toLocaleLowerCase()
            .split(" ")
            .join("-")}`}
          className="hover:text-primary-600 transition-colors"
        >
          {productInfo.categoryName}
        </Link>
        <span>/</span>
        <span className="text-surface-800 font-medium truncate max-w-[200px]">
          {productInfo.title}
        </span>
      </nav>

      <div className="py-6 space-y-14">
        <ProductInfo {...productInfo} />

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-surface-900 mb-6">
            Product Specifications
          </h2>
          <div role="list" aria-label="Product specifications" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div role="listitem" className="bg-white border border-surface-200 rounded-xl p-4 sm:p-5 flex flex-col gap-2">
              <BiCategory className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              <span className="text-xs text-surface-500 font-medium uppercase tracking-wider">
                Category
              </span>
              <span className="text-sm sm:text-base font-semibold text-surface-800">
                {productInfo.categoryName}
              </span>
            </div>
            <div role="listitem" className="bg-white border border-surface-200 rounded-xl p-4 sm:p-5 flex flex-col gap-2">
              <HiTag className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              <span className="text-xs text-surface-500 font-medium uppercase tracking-wider">
                Stock
              </span>
              <span className="text-sm sm:text-base font-semibold text-surface-800">
                {productInfo.stock > 0
                  ? `${productInfo.stock} units`
                  : "Out of stock"}
              </span>
            </div>
            <div role="listitem" className="bg-white border border-surface-200 rounded-xl p-4 sm:p-5 flex flex-col gap-2">
              <MdVerified className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              <span className="text-xs text-surface-500 font-medium uppercase tracking-wider">
                Status
              </span>
              <span className="text-sm sm:text-base font-semibold text-surface-800">
                {productInfo.stock > 0 ? "Available" : "Unavailable"}
              </span>
            </div>
            <div role="listitem" className="bg-white border border-surface-200 rounded-xl p-4 sm:p-5 flex flex-col gap-2">
              <HiClock className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              <span className="text-xs text-surface-500 font-medium uppercase tracking-wider">
                Listed
              </span>
              <span className="text-sm sm:text-base font-semibold text-surface-800">
                {productInfo.createdAt
                  ? new Date(productInfo.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-surface-900 mb-6">
            Why Shop With Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceItems.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-surface-200 rounded-xl p-5 sm:p-6 flex flex-col items-center text-center gap-3 hover:border-primary-200 hover:shadow-md transition-all"
              >
                <span className="text-primary-600 text-3xl sm:text-4xl">
                  <item.icon />
                </span>
                <h3 className="font-semibold text-surface-800 text-sm sm:text-base">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-surface-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <RecentlyViewed />

        {productInfo.categoryName && (
          <section>
            <RelatedProducts
              categoryName={productInfo.categoryName}
              currentProductId={id!}
            />
          </section>
        )}
      </div>
    </Container>
  );
}

export default ProductDetails;
