import { useEffect, useState } from "react";
import { BiPackage } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import { handlePrice } from "../utils/handlers";
import { BsArrowRight, BsTrash2 } from "react-icons/bs";
import SEO from "../components/SEO";

import useCart from "../context/cart/CartContext";
import useAuth from "../context/auth/AuthContext";
import ItemCart from "../components/ItemCart";

function CartPage() {
  const { token } = useAuth();
  const {
    cartItems,
    totalAmount,
    getUserCart,
    clearAllItemsFromCart,
    shippingCost,
    taxAmount,
    pending,
  } = useCart();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (!token) return;
    getUserCart({ token });
  }, [token]);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleClearCart = async () => {
    if (!token || isClearing) return;
    if (!window.confirm("Are you sure you want to remove all items from your cart?")) return;
    setIsClearing(true);
    try {
      await clearAllItemsFromCart({ token });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEO title="Shopping Cart" description="Review your items and proceed to checkout." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <CgShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {cartItems.length > 0
                    ? `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart`
                    : "Your cart is empty"}
                </p>
              </div>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <BsTrash2 className="w-4 h-4" />
                {isClearing ? "Clearing..." : "Clear all"}
              </button>
            )}
          </div>
        </div>

        {pending && cartItems.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Loading your cart...</p>
            </div>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div aria-live="polite" className="lg:col-span-2 space-y-4">
              {cartItems.map(({ product, productId, quantity, updatedAt }, i) => (
                <div
                  key={productId}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
                >
                  <ItemCart
                    productId={productId}
                    title={product.title}
                    description={product.description || ""}
                    categoryName={product.categoryName}
                    image={product.thumbnail || ""}
                    quantity={quantity}
                    stock={product.stock}
                    price={product.price}
                    updatedAt={updatedAt}
                    checkoutState={true}
                  />
                </div>
              ))}
            </div>

            <div aria-label="Cart summary" className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-gray-900">
                      {handlePrice(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-semibold ${shippingCost <= 0 ? "text-green-600" : "text-gray-900"}`}>
                      {shippingCost <= 0 ? "Free" : handlePrice(shippingCost)}
                    </span>
                  </div>
                  {taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold text-gray-900">
                        {handlePrice(taxAmount)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        {handlePrice(totalAmount + shippingCost + taxAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    Proceed to Checkout
                    <BsArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 sm:hidden"
                  >
                    <BsTrash2 className="w-4 h-4" />
                    {isClearing ? "Clearing..." : "Clear Cart"}
                  </button>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="flex items-start gap-3 text-sm text-gray-500">
                    <BiPackage className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p>Free shipping on all orders. Secure checkout with encrypted payment processing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center max-w-lg mx-auto animate-fadeIn">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CgShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              Looks like you haven't added anything yet. Start shopping to find amazing products!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 inline-flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Continue Shopping
              <BsArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
