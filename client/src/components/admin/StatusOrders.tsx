import { useEffect, useState } from "react";
import { LuTimer } from "react-icons/lu";
import { HiOutlineCash } from "react-icons/hi";
import { HiOutlineTruck } from "react-icons/hi2";
import { MdDoneAll } from "react-icons/md";
import { InsightsCardSkeleton } from "./SalesInsights";

import InsightsCard from "./InsightsCard";

import useAuth from "../../context/auth/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function StatusOrders() {
  const [pending, setPending] = useState(false);
  const [statusOrders, setOrderStatus] = useState({
    pending: 0,
    shipped: 0,
    delivered: 0,
    totalOrders: 0,
  });
  const { token } = useAuth();
  useEffect(() => {
    if (!token) return;
    async function getStatusOrders() {
      try {
        setPending(true);
        const response = await fetch(`${BASE_URL}/admin/orders-insights`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("can't get admin orders insights");
        const data = await response.json();
        setOrderStatus({ ...data });
        return;
      } catch (error) {
        console.error(error);
      } finally {
        setPending(false);
      }
    }
    getStatusOrders();
  }, [token]);

  const ordersInfo = [
    {
      id: "0",
      name: "Pending Orders",
      icon: <LuTimer color="#f59e0b" size={22} />,
      money: statusOrders.pending,
      prefix: statusOrders.pending <= 1 ? "order" : "orders",
    },
    {
      id: "1",
      name: "Shipped Orders",
      icon: <HiOutlineTruck color="#2563eb" size={22} />,
      money: statusOrders.shipped,
      prefix: statusOrders.shipped <= 1 ? "order" : "orders",
    },
    {
      id: "2",
      name: "Delivered Orders",
      icon: <MdDoneAll color="#059669" size={22} />,
      money: statusOrders.delivered,
      prefix: statusOrders.delivered <= 1 ? "order" : "orders",
    },
    {
      id: "3",
      name: "Total Orders",
      icon: <HiOutlineCash color="#64748b" size={22} />,
      money: statusOrders.totalOrders,
      prefix: statusOrders.totalOrders <= 1 ? "order" : "orders",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {ordersInfo.map((card) => (
        <div key={card.id} className="flex-1 min-w-[200px]">
          {pending ? (
            <InsightsCardSkeleton />
          ) : (
            <InsightsCard
              name={card.name}
              icon={card.icon}
              money={card.money}
              info={`The number of ${card.name}`}
              prefix={card.prefix}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default StatusOrders;
