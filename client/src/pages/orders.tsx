import { Order } from "../utils/types";
import { useEffect, useState } from "react";
import { getAllUserOrders } from "../utils/handlers";
import { HiClock } from "react-icons/hi";
import { IoBagCheckOutline } from "react-icons/io5";
import SEO from "../components/SEO";

import useAuth from "../context/auth/AuthContext";
import ShowOrdersHistory from "../components/ShowOrdersHistory";

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border border-surface-200 rounded-xl p-4 animate-pulse motion-safe:animate-slideUp motion-safe:[animation-fill-mode:backwards]"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className="h-5 w-24 bg-surface-200 rounded-md" />
            <div className="h-5 w-20 bg-surface-200 rounded-full" />
            <div className="flex-1" />
            <div className="h-5 w-16 bg-surface-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersHistory() {
  const { token } = useAuth();
  const [ordersList, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAllUserOrders({ token })
      .then((ordersList) => {
        setOrders(ordersList || []);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.message || "Failed to load orders");
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="py-6 sm:py-10 w-full">
      <SEO title="Order History" description="View your order history." />
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <HiClock className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900">
            Orders History
          </h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {loading
              ? "Loading your orders..."
              : `${ordersList.length} order${ordersList.length !== 1 ? "s" : ""} placed`}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <IoBagCheckOutline className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : ordersList.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-surface-100 flex items-center justify-center mb-6">
            <IoBagCheckOutline className="w-10 h-10 text-surface-400" />
          </div>
          <h2 className="text-xl font-semibold text-surface-800 mb-2">
            No orders yet
          </h2>
          <p className="text-surface-500 text-sm max-w-md">
            Your order history is empty. Start shopping and your orders will
            appear here.
          </p>
        </div>
      ) : (
        <div aria-live="polite" className="motion-safe:animate-slideUp motion-safe:[animation-fill-mode:backwards]">
          <ShowOrdersHistory orders={ordersList} />
        </div>
      )}
    </div>
  );
}

export default OrdersHistory;
