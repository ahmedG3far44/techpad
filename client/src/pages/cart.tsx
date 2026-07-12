import { useEffect } from "react";
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
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    getUserCart({ token });
  }, [token]);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <SEO title="Shopping Cart" description="Review your items and proceed to checkout." />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CgShoppingCart className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <p className="text-gray-600">
            {cartItems.length > 0
              ? `You have ${itemCount} item${
                  itemCount !== 1 ? "s" : ""
                } in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div aria-live="polite" className="lg:col-span-2 space-y-4">
              {cartItems.map(({ product, productId, quantity, updatedAt }) => (
                <ItemCart
                  key={productId}
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
              ))}
            </div>

            <div aria-label="Cart summary" className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium">
                      {handlePrice(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">
                      {shippingCost <= 0 ? "Free" : handlePrice(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {handlePrice(totalAmount + shippingCost)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Proceed to Checkout
                    <BsArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      if (!token) return;
                      if (
                        window.confirm(
                          "Are you sure you want to clear your cart?"
                        )
                      ) {
                        clearAllItemsFromCart({ token });
                      }
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <BsTrash2 className="w-4 h-4" />
                    Clear Cart
                  </button>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <BiPackage className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p>
                      Free shipping on all orders. Secure checkout with
                      encrypted payment processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div role="status" className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <CgShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet. Start
              shopping to find amazing products!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 inline-flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Continue Shopping
              <BsArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
