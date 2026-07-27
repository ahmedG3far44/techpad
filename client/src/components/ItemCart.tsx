import { useState } from "react";
import { BiLoader } from "react-icons/bi";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { handlePrice } from "../utils/handlers";

import useAuth from "../context/auth/AuthContext";
import useCart from "../context/cart/CartContext";

import handelDates from "../utils/handelDates";

interface ItemCart {
  productId: string;
  title: string;
  description: string;
  categoryName: string | null;
  image: string;
  quantity: number;
  stock: number;
  price: number;
  updatedAt: Date;
  checkoutState?: boolean;
}

function ItemCart({
  productId,
  title,
  categoryName,
  description,
  image,
  quantity,
  stock,
  price,
  updatedAt,
  checkoutState,
}: ItemCart) {
  const { token } = useAuth();
  const { updateItemInCart, deleteOneItemFromCart, pending } = useCart();
  const [newQuantity, setNewQuantity] = useState(quantity);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const date = new Date(updatedAt);

  if (!token) return null;
  const handleIncrement = () => {
    setNewQuantity((prev) => {
      const updated = prev + 1;
      if (updated <= stock) {
        updateItemInCart({ productId, quantity: updated, token });
        return updated;
      }
      return prev;
    });
  };

  const handleDecrement = () => {
    setNewQuantity((prev) => {
      const updated = prev - 1;
      if (updated > 0) {
        updateItemInCart({ productId, quantity: updated, token });
        return updated;
      }
      return prev;
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteOneItemFromCart({ token, productId });
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const isOutOfStock = newQuantity > stock;
  const isAtMaxStock = newQuantity >= stock;
  const isAtMinQuantity = newQuantity <= 1;

  return (
    <div
      className={`w-full flex flex-col rounded-xl border bg-white transition-all duration-200 ${
        isOutOfStock
          ? "border-red-200 bg-red-50/50"
          : "border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex flex-col sm:flex-row p-3 sm:p-4 gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-full sm:w-28 h-28 sm:h-28 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
          <img
            className="w-full h-full object-contain p-2"
            src={imgError ? "/placeholder.png" : (image || "/placeholder.png")}
            alt={title}
            onError={() => setImgError(true)}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-snug" title={title}>
                {title}
              </h2>

              {checkoutState && description && (
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1 leading-relaxed" title={description}>
                  {description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {categoryName && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                    {categoryName}
                  </span>
                )}
                <span className="text-[11px] text-gray-400">{handelDates(date)}</span>
              </div>

              {isOutOfStock && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 border border-red-200 text-xs font-medium text-red-600">
                  Only {stock} available
                </div>
              )}
            </div>

            <div className="hidden sm:block text-right flex-shrink-0">
              <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                {handlePrice(String(price * newQuantity))}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5 whitespace-nowrap">
                ${price.toFixed(2)} × {newQuantity}
              </div>
            </div>
          </div>

          {checkoutState && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDecrement}
                  disabled={pending || isAtMinQuantity}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  {pending ? (
                    <BiLoader size={13} className="animate-spin" />
                  ) : (
                    <FiMinus size={13} />
                  )}
                </button>

                <span className="w-9 text-center text-sm font-semibold text-gray-900 tabular-nums">
                  {newQuantity}
                </span>

                <button
                  onClick={handleIncrement}
                  disabled={pending || isAtMaxStock}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Increase quantity"
                >
                  {pending ? (
                    <BiLoader size={13} className="animate-spin" />
                  ) : (
                    <FiPlus size={13} />
                  )}
                </button>

                {stock > 0 && newQuantity < stock && (
                  <span className="text-[11px] text-gray-400 ml-1.5 hidden sm:inline">
                    {stock - newQuantity} left
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="sm:hidden text-sm font-semibold text-gray-900">
                  {handlePrice(String(price * newQuantity))}
                </span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || pending}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Remove from cart"
                >
                  {isDeleting ? (
                    <>
                      <BiLoader size={13} className="animate-spin" />
                      <span>Removing</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 size={13} />
                      <span className="hidden xs:inline">Remove</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCart;
