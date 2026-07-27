import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IProduct } from "../utils/types";
import { HiShoppingCart, HiCheck } from "react-icons/hi";
import { handlePrice } from "../utils/handlers";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";

import useAuth from "../context/auth/AuthContext";
import useCart from "../context/cart/CartContext";

function ImageSlider({ images, thumbnail, title }: { images: string[]; thumbnail?: string; title?: string }) {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = () => {
    setActive((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActive((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActive(0);
  };

  const mainImage = thumbnail && images.includes(thumbnail) ? thumbnail : images[0];

  return (
    <div
      className="relative w-full aspect-square rounded-t-xl overflow-hidden bg-surface-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={mainImage || "/placeholder.svg"}
        alt={title ? `${title} - image 1 of ${images.length}` : `Product image 1 of ${images.length}`}
        loading="lazy"
        className={`w-full h-full object-contain p-4 motion-safe:transition-all motion-safe:duration-500 ${
          isHovered ? "scale-100" : "motion-safe:group-hover/card:scale-110"
        }`}
      />

      {isHovered && images.length > 1 && (
        <>
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          <img
            src={images[active] || "/placeholder.svg"}
            alt={title ? `${title} - image ${active + 1} of ${images.length}` : `Product image ${active + 1} of ${images.length}`}
            className="absolute inset-0 w-full h-full object-contain p-4 motion-safe:transition-opacity motion-safe:duration-300"
          />

          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center motion-safe:animate-fadeIn shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
            aria-label="Previous image"
          >
            <BiLeftArrowAlt size={14} className="text-surface-700" aria-hidden="true" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center motion-safe:animate-fadeIn shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
            aria-label="Next image"
          >
            <BiRightArrowAlt size={14} className="text-surface-700" aria-hidden="true" />
          </button>

          <div aria-live="polite" aria-atomic="true" className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full motion-safe:transition-all motion-safe:duration-300 ${
                  i === active
                    ? "bg-white w-3 sm:w-4 shadow-sm"
                    : "bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProductCard(product: IProduct) {
  const { _id, title, images, thumbnail, price, stock } = product;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 10;

  const { isAuthenticated, user, token } = useAuth();
  const { cartItems, addItemToCart } = useCart();
  const navigate = useNavigate();

  const isInCart = cartItems.some((item) => item.productId === _id);

  const handleAddToCart = () => {
    if (!token) {
      navigate("/login");
    } else {
      addItemToCart({ productId: _id, quantity: 1, token });
    }
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  return (
    <article role="group" aria-label={title} className="group/card relative flex flex-col h-full bg-white rounded-xl border border-surface-200 motion-safe:transition-all motion-safe:duration-300 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5">
      <div className="relative">
        <ImageSlider images={images} thumbnail={thumbnail} title={title} />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-t-xl">
            <span className="bg-surface-900 text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 left-2">
            <span className="bg-accent-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide shadow-sm">
              Only {stock} left
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3 sm:p-4 pt-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-lg sm:text-xl font-bold text-primary-600 leading-none block">
              {handlePrice(price)}
            </span>
            {!isOutOfStock && (
              <span className="text-[11px] sm:text-xs text-surface-400 mt-0.5 block">
                {stock > 10 ? "In Stock" : `${stock} remaining`}
              </span>
            )}
          </div>

          {!isOutOfStock && isAuthenticated && !user?.isAdmin && (
            isInCart ? (
              <button
                onClick={handleViewCart}
                className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 min-w-[44px] min-h-[44px] rounded-lg text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 motion-safe:transition-all motion-safe:duration-200 shadow-sm hover:shadow-md motion-safe:active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                aria-label={isInCart ? "View Cart" : `Add ${title} to cart`}
              >
                <HiCheck className="w-4 h-4" />
                <span className="hidden sm:inline">View Cart</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 min-w-[44px] min-h-[44px] rounded-lg text-xs sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 motion-safe:transition-all motion-safe:duration-200 shadow-sm hover:shadow-md motion-safe:active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
                aria-label={`Add ${title} to cart`}
              >
                <HiShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            )
          )}
        </div>

        <Link
          to={`/product/${_id}`}
          aria-label="View product details"
          className="text-sm sm:text-base font-semibold text-surface-800 leading-snug line-clamp-2 hover:text-primary-600 motion-safe:transition-colors motion-safe:duration-200 focus:outline-none focus:text-primary-600"
        >
          {title}
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
