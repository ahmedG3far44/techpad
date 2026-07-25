import { useEffect, useState } from "react";

import { FaCrown } from "react-icons/fa";

import useAuth from "../../context/auth/AuthContext";

import { TopCustomer } from "../../utils/types";
import { handlePrice } from "../../utils/handlers";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function TopRatedCustomers() {
  const [pending, setPending] = useState(false);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    async function getTopRatedCustomers() {
      try {
        setPending(true);
        const response = await fetch(`${BASE_URL}/admin/customers/top`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok)
          throw new Error("can't get top rated customer's list!!!");
        const data = await response.json();
        setTopCustomers(data);
        return data;
      } catch (err) {
        console.log(err);
      } finally {
        setPending(false);
      }
    }
    getTopRatedCustomers();
  }, [token]);

  return (
    <div>
      <h2 className="text-base font-semibold text-surface-800 mb-4 flex items-center gap-2">
        <FaCrown className="w-4 h-4 text-accent-500" />
        Top Spending Customers
      </h2>
      {pending ? (
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <TopCustomerSkeleton key={i} />
          ))}
        </div>
      ) : topCustomers.length === 0 ? (
        <p className="text-sm text-surface-400 text-center py-8">No customer data yet</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {topCustomers.map((customer) => (
            <TopCustomerCard
              key={customer.userId}
              email={customer.email}
              orderCount={customer.orderCount}
              totalSpent={customer.totalSpent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TopRatedCustomers;

function TopCustomerCard({
  email,
  totalSpent,
  orderCount,
}: TopCustomer) {
  const initials = email
    ? email.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-surface-200 bg-white motion-safe:transition-all motion-safe:duration-150 hover:border-surface-300 hover:shadow-sm">
      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary-700">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-surface-700 truncate">{email}</p>
      </div>
      <div className="flex items-center gap-4 text-sm flex-shrink-0">
        <span className="text-surface-400 whitespace-nowrap">
          {orderCount} {orderCount <= 1 ? "order" : "orders"}
        </span>
        <span className="font-semibold text-surface-800 whitespace-nowrap">
          {handlePrice(totalSpent)}
        </span>
      </div>
    </div>
  );
}

function TopCustomerSkeleton() {
  return (
    <div className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-surface-50 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-surface-200" />
      <div className="flex-1 h-4 bg-surface-200 rounded" />
      <div className="w-28 h-4 bg-surface-200 rounded" />
    </div>
  );
}
