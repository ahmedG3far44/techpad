import { Order } from "../../utils/types";
import { useEffect, useState } from "react";
import ShowOrdersHistory from "../ShowOrdersHistory";
import useAuth from "../../context/auth/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function AdminOrders({ OrderStatus }: { OrderStatus: string }) {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAllPendingOrders(OrderStatus: string) {
      const url = `${BASE_URL}/admin/orders/${
        OrderStatus === "shipped"
          ? "shipped"
          : OrderStatus === "pending"
          ? "pending"
          : OrderStatus === "delivered"
          ? "delivered"
          : OrderStatus === "canceled"
          ? "canceled"
          : "all"
      }`;
      try {
        setLoading(true);
        setError(null);
        if (!token) return;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const ordersList = await response.json();
        const { orders } = ordersList;
        setOrdersList([...orders]);
      } catch (err: any) {
        console.error(err?.message);
        setError(err?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    getAllPendingOrders(OrderStatus);
  }, [token, OrderStatus]);

  const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
    setOrdersList((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="motion-safe:animate-fadeIn motion-safe:[animation-fill-mode:backwards]">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">Orders</h1>
        <p className="text-surface-500 text-sm mt-1">
          {ordersList.length > 0
            ? `Showing ${ordersList.length} order${ordersList.length > 1 ? "s" : ""}`
            : "Manage customer orders"}
        </p>
      </div>

      {loading ? (
        <div className="w-full h-64 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2.5">
          <span className="text-sm font-medium text-red-800">{error}</span>
        </div>
      ) : ordersList.length > 0 ? (
        <div className="w-full bg-white border border-surface-200 rounded-xl p-4 sm:p-6" aria-live="polite">
          <ShowOrdersHistory
            orders={ordersList}
            onStatusUpdate={handleOrderStatusUpdate}
          />
        </div>
      ) : (
        <div className="w-full h-80 flex flex-col justify-center items-center gap-3">
          <svg className="w-16 h-16 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg text-surface-400 font-medium">
            No orders available yet
          </p>
          <p className="text-sm text-surface-400">
            Orders will appear here once customers place them
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
