import { useEffect, useState } from "react";
import {
  FiShoppingCart,
  FiMapPin,
  FiLock,
  FiPlus,
  FiCheck,
  FiHome,
  FiBriefcase,
} from "react-icons/fi";
import { BiPackage } from "react-icons/bi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { handlePrice } from "../utils/handlers";
import { IAddress } from "../utils/types";
import SEO from "../components/SEO";

import useCart from "../context/cart/CartContext";
import useAuth from "../context/auth/AuthContext";
import ItemCart from "../components/ItemCart";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function formatAddr(a: IAddress): string {
  const parts = [
    a.building && `Building ${a.building}`,
    a.floor && `Floor ${a.floor}`,
    a.apartment && `Apt ${a.apartment}`,
    a.street,
    a.area,
    a.state,
    a.country,
  ].filter(Boolean);
  return parts.join(", ");
}

function CheckoutPage() {
  const { token } = useAuth();
  const {
    cartItems,
    totalAmount,
    getUserCart,
    createOrder,
    shippingCost,
    pending,
  } = useCart();
  const [pendingAddress, setPending] = useState(false);
  const [addresses, setAddressesList] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);

  const getAddressesList = async ({ token }: { token: string }) => {
    try {
      if (!token) return;
      setPending(true);
      const response = await fetch(`${BASE_URL}/user/address`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("connection error can't get addresses!!");
      }
      const addressesList: IAddress[] = await response.json();
      setAddressesList([...addressesList]);
      const defaultAddr = addressesList.find((a) => a.isDefault) || addressesList[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
      return addressesList;
    } catch (err: any) {
      console.error(err.message);
      return err.message;
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    getUserCart({ token });
    getAddressesList({ token });
  }, [token]);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const finalTotal = totalAmount + shippingCost;

  const navigate = useNavigate();

  return (
    <div role="form" aria-label="Checkout form" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <SEO title="Checkout" description="Complete your order." />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FiShoppingCart className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
          <p className="text-gray-600">
            Complete your order &bull; {itemCount} item{itemCount !== 1 ? "s" : ""}{" "}
            in cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <BiPackage className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Order Items ({itemCount})
                </h2>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {cartItems.length > 0 ? (
                  cartItems.map(
                    ({ product, productId, quantity, updatedAt }: any) => {
                      const {
                        title,
                        description,
                        categoryName,
                        thumbnail,
                        price,
                        stock,
                      } = product;
                      return (
                        <ItemCart
                          key={productId}
                          categoryName={categoryName}
                          image={thumbnail as string}
                          description={description as string}
                          price={price}
                          stock={stock}
                          title={title}
                          productId={productId}
                          quantity={quantity}
                          updatedAt={updatedAt}
                          checkoutState={false}
                        />
                      );
                    }
                  )
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Your cart is empty. Continue shopping to add items!
                  </p>
                )}
              </div>
            </div>
            {cartItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Shipping Address
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 text-blue-600 duration-300 font-medium transition-colors cursor-pointer hover:text-blue-400"
                  >
                    <FiPlus className="w-4 h-4" /> Manage Addresses
                  </button>
                </div>

                {pendingAddress ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : addresses.length > 0 ? (
                  <>
                    {cartItems.length > 0 && (
                      <div aria-required="true" className="space-y-3">
                        {addresses.map((addr, index) => (
                          <div
                            key={index}
                            onClick={() => setSelectedAddress(addr)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              selectedAddress === addr
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                                  selectedAddress === addr
                                    ? "border-blue-600 bg-blue-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedAddress === addr && (
                                  <FiCheck className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                      addr.label === "Home"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : addr.label === "Office"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {addr.label === "Home" ? (
                                      <FiHome className="w-3 h-3" />
                                    ) : addr.label === "Office" ? (
                                      <FiBriefcase className="w-3 h-3" />
                                    ) : null}
                                    {addr.label}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="text-xs text-amber-600 font-medium">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-900 text-sm leading-relaxed">
                                  {formatAddr(addr)}
                                </p>
                                {addr.phone && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Contact: {addr.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                    <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No addresses found</p>
                    <button
                      onClick={() => navigate("/profile")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors cursor-pointer"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div aria-live="polite" className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium">
                    {handlePrice(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">
                    {shippingCost <= 0
                      ? "Free"
                      : `${handlePrice(shippingCost)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">Included</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {handlePrice(finalTotal)}
                </span>
              </div>

              <button
                onClick={() => {
                  if (token && selectedAddress) {
                    createOrder({ token, address: selectedAddress });
                  }
                }}
                disabled={!selectedAddress || cartItems.length === 0 || pending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none mb-4 cursor-pointer"
              >
                <FiLock className="w-5 h-5" />
                {pending ? "Confirming Order..." : "Place Order"}
              </button>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FiLock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">
                      Secure Checkout
                    </p>
                    <p>
                      Your payment information is encrypted and secure. We never
                      store your card details.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MdOutlineLocalShipping className="w-5 h-5 text-blue-600" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <BiPackage className="w-5 h-5 text-blue-600" />
                  <span>Easy returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
