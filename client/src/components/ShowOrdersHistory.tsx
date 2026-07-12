import { useState, useMemo, useCallback } from "react";
import { Customer, Order, ProductInITemsList } from "../utils/types";

import { handlePrice } from "../utils/handlers";
import { MdKeyboardArrowUp } from "react-icons/md";
import { IoSearchOutline, IoBagCheckOutline } from "react-icons/io5";
import { HiTruck, HiXCircle } from "react-icons/hi";
import { BiPackage, BiCube } from "react-icons/bi";

import useAuth from "../context/auth/AuthContext";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

const statusConfig = {
  PENDING: {
    bg: "bg-accent-100",
    text: "text-accent-800",
    dot: "bg-accent-500",
    label: "Pending",
  },
  SHIPPED: {
    bg: "bg-primary-100",
    text: "text-primary-800",
    dot: "bg-primary-500",
    label: "Shipped",
  },
  DELIVERED: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    label: "Delivered",
  },
  CANCELED: {
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
    label: "Canceled",
  },
} as const;

function Status({ statusText }: { statusText: string }) {
  const config = statusConfig[statusText.toUpperCase() as keyof typeof statusConfig] || {
    bg: "bg-surface-100",
    text: "text-surface-700",
    dot: "bg-surface-400",
    label: statusText,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function OrderCustomerInfo({
  customer,
}: {
  customer: Customer;
}) {
  return (
    <div className="bg-white border border-surface-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-surface-800 mb-3 flex items-center gap-2">
        <BiCube className="w-4 h-4 text-primary-600" />
        Customer Information
      </h3>
      <div className="space-y-1.5 text-sm text-surface-600">
        <p className="flex gap-2">
          <span className="font-medium text-surface-700 min-w-[60px]">Name:</span>
          <span>{customer.name}</span>
        </p>
        {customer.email && (
          <p className="flex gap-2">
            <span className="font-medium text-surface-700 min-w-[60px]">Email:</span>
            <span>{customer.email}</span>
          </p>
        )}
        <p className="flex gap-2">
          <span className="font-medium text-surface-700 min-w-[60px]">Address:</span>
          <span className="flex-1">{customer.address}</span>
        </p>
        {customer.phone && (
          <p className="flex gap-2">
            <span className="font-medium text-surface-700 min-w-[60px]">Phone:</span>
            <span>{customer.phone}</span>
          </p>
        )}
        {customer.area && (
          <p className="flex gap-2">
            <span className="font-medium text-surface-700 min-w-[60px]">Area:</span>
            <span>{customer.area}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function OrderTracker({ orderStatus }: { orderStatus: string }) {
  const statuses = ["PENDING", "SHIPPED", "DELIVERED"];
  const currentIdx = statuses.indexOf(orderStatus.toUpperCase());

  if (currentIdx === -1) return null;

  const iconMap = [
    <BiPackage key="package" className="w-4 h-4" />,
    <HiTruck key="truck" className="w-4 h-4" />,
    <IoBagCheckOutline key="bag" className="w-4 h-4" />,
  ];

  return (
    <div className="bg-white border border-surface-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
        <HiTruck className="w-4 h-4 text-primary-600" />
        Order Progress
      </h3>
      <div className="flex items-center gap-0 sm:gap-2">
        {statuses.map((s, i) => {
          const isCompleted = i <= currentIdx;
          const isCurrent = i === currentIdx && orderStatus.toUpperCase() !== "DELIVERED";
          return (
            <div key={s} className="flex items-center flex-1 sm:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold motion-safe:transition-all motion-safe:duration-300 ${
                    isCompleted
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-200"
                      : "bg-surface-100 text-surface-400"
                  } ${isCurrent ? "motion-safe:animate-pulse-slow" : ""}`}
                >
                  {iconMap[i]}
                </div>
                <span
                  className={`text-[11px] font-medium hidden sm:block ${
                    isCompleted ? "text-primary-700" : "text-surface-400"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < statuses.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 sm:mx-3 mt-[-1.5rem] motion-safe:transition-all motion-safe:duration-500 ${
                    i < currentIdx ? "bg-primary-400" : "bg-surface-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Items({ itemsList }: { itemsList: ProductInITemsList[] }) {
  return (
    <div className="divide-y divide-surface-100">
      {itemsList.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 sm:gap-4 py-3 first:pt-0 last:pb-0"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-surface-100 border border-surface-200 flex-shrink-0 overflow-hidden">
            <img
              src={item.productImages}
              alt={item.productTitle}
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-surface-800 truncate">
              {item.productTitle}
            </h4>
            {item.productDescription && (
              <p className="text-xs text-surface-500 truncate mt-0.5">
                {item.productDescription}
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-sm text-surface-800">
              {handlePrice(item.productPrice)}
            </p>
            <p className="text-xs text-surface-400">Qty: {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderItem({
  order,
  onStatusUpdate,
  index,
}: {
  order: Order;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
  index: number;
}) {
  const [isOpen, setOpen] = useState(false);
  const [shippPending, setShippPending] = useState(false);
  const [cancelPending, setCancelPending] = useState(false);
  const [completePending, setCompletePending] = useState(false);

  const { user, token } = useAuth();

  const date = new Date(order.createdAt);

  const updateStatus = useCallback(
    async (status: string) => {
      if (!token || !user?.isAdmin) {
        toast.error("Unauthorized");
        return;
      }
      try {
        const setter =
          status === "DELIVERED"
            ? setCompletePending
            : status === "SHIPPED"
            ? setShippPending
            : setCancelPending;
        setter(true);

        const response = await fetch(`${BASE_URL}/admin/orders`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId: order._id, status }),
        });
        if (!response.ok) throw new Error("Failed to update order status");

        if (onStatusUpdate) onStatusUpdate(order._id, status);
        toast.success(`Order ${status.toLowerCase()} successfully`);
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
      } finally {
        setCompletePending(false);
        setShippPending(false);
        setCancelPending(false);
      }
    },
    [token, user, order._id, onStatusUpdate]
  );

  return (
    <div
      className="border border-surface-200 rounded-xl bg-white overflow-hidden motion-safe:animate-slideUp motion-safe:[animation-fill-mode:backwards]"
      style={{ animationDelay: `${index * 60}ms` }}
      role="listitem"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 text-left hover:bg-surface-50 motion-safe:transition-colors motion-safe:duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 flex-wrap">
          <span className="text-xs sm:text-sm font-mono font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md whitespace-nowrap">
            #{order._id.slice(-8).toUpperCase()}
          </span>
          <span className="text-xs text-surface-400 hidden sm:inline whitespace-nowrap">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-xs text-surface-400 sm:hidden whitespace-nowrap">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <Status statusText={order.status.toString()} />
        </div>
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <span className="text-sm sm:text-base font-bold text-surface-800">
            {handlePrice(order.totalOrderPrice)}
          </span>
          <div
            className={`motion-safe:transition-transform motion-safe:duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <MdKeyboardArrowUp size={20} className="text-surface-400" />
          </div>
        </div>
      </button>

      <div
        className={`motion-safe:transition-all motion-safe:duration-300 motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        } grid`}
      >
        <div className="overflow-hidden" role="region" aria-label={`Order #${order._id.slice(-8).toUpperCase()}`}>
          <div className="border-t border-surface-200 p-3 sm:p-4 space-y-4">
            {order.customer && <OrderCustomerInfo customer={order.customer} />}
            <OrderTracker orderStatus={order.status.toString()} />
            <div className="bg-white border border-surface-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-surface-800 mb-3 flex items-center gap-2">
                <BiPackage className="w-4 h-4 text-primary-600" />
                Items ({order.orderItems.length})
              </h3>
              <Items itemsList={order.orderItems.map((item) => ({
                ...item,
                productImages: item.productImages || "",
              }))} />
            </div>
            {user?.isAdmin &&
              (order.status.toString() === "PENDING" ||
                order.status.toString() === "SHIPPED") && (
                <div className="flex items-center gap-2 pt-1" aria-live="polite">
                  <button
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-surface-300 disabled:cursor-not-allowed motion-safe:transition-all motion-safe:duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                    disabled={order.status.toString() !== "SHIPPED" || completePending}
                    onClick={() => updateStatus("DELIVERED")}
                  >
                    {completePending ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <IoBagCheckOutline className="w-4 h-4" /> Complete
                      </>
                    )}
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:bg-surface-300 disabled:cursor-not-allowed motion-safe:transition-all motion-safe:duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
                    disabled={order.status.toString() !== "PENDING" || shippPending}
                    onClick={() => updateStatus("SHIPPED")}
                  >
                    {shippPending ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <HiTruck className="w-4 h-4" /> Ship
                      </>
                    )}
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-surface-300 disabled:cursor-not-allowed motion-safe:transition-all motion-safe:duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                    disabled={cancelPending}
                    onClick={() => updateStatus("CANCELED")}
                  >
                    {cancelPending ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <HiXCircle className="w-4 h-4" /> Cancel
                      </>
                    )}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowOrdersHistory({
  orders,
  onStatusUpdate,
}: {
  orders: Order[];
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase().trim();
    return orders.filter((order) => {
      const matchesId = order._id.toLowerCase().includes(term);
      const matchesName = order.customer?.name?.toLowerCase().includes(term);
      const matchesEmail = order.customer?.email?.toLowerCase().includes(term);
      return matchesId || matchesName || matchesEmail;
    });
  }, [orders, searchTerm]);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name, or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-300 rounded-xl text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150"
        />
      </div>

      {searchTerm && (
        <p className="text-sm text-surface-500" role="status">
          Found {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
        </p>
      )}

      {filteredOrders.length > 0 ? (
        <div className="space-y-3" role="list" aria-label="Order list">
          {filteredOrders.map((order, i) => (
            <OrderItem
              key={order._id}
              order={order}
              onStatusUpdate={onStatusUpdate}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <IoBagCheckOutline className="w-16 h-16 text-surface-300 mb-4" />
          <p className="text-lg font-semibold text-surface-600">
            {searchTerm
              ? "No orders match your search"
              : "No orders yet"}
          </p>
          <p className="text-sm text-surface-400 mt-1.5 max-w-sm">
            {searchTerm
              ? "Try a different search term or check your spelling"
              : "Your order history will appear here once you make your first purchase"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ShowOrdersHistory;
