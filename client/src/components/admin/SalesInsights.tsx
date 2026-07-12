import { useEffect, useState } from "react";

import { SalesInsightsType } from "./Insights";

import { FaRegUserCircle } from "react-icons/fa";
import { LuWallet } from "react-icons/lu";
import { MdDoneAll } from "react-icons/md";
import { PiChartLineUp } from "react-icons/pi";

import useAuth from "../../context/auth/AuthContext";

import InsightsCard from "./InsightsCard";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function SalesInsights() {
  const { token } = useAuth();
  const [pending, setPending] = useState(false);
  const [duration] = useState("day");
  const [salesInsights, setSalesInsights] = useState<SalesInsightsType>({
    totalSales: 0,
    totalOrders: 0,
    mostSpent: 0,
    activeCustomers: 0,
  });

  useEffect(() => {
    const handleChangeInsights = async () => {
      try {
        if (!token)
          throw new Error("Your aren't authorized to do this action!!");
        setPending(true);
        const response = await fetch(`${BASE_URL}/admin/sales`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("can't get admin insights!!");
        const insights = await response.json();
        setSalesInsights({ ...insights });
        return;
      } catch (err) {
        console.error(err);
        return;
      } finally {
        setPending(false);
      }
    };
    handleChangeInsights();
  }, [token]);
  const info = [
    {
      id: "0",
      name: "Total Sales",
      icon: <PiChartLineUp color="#2563eb" size={22} />,
      money: salesInsights.totalSales,
      prefix: "USD",
    },
    {
      id: "1",
      name: "Confirmed Orders",
      icon: <MdDoneAll color="#059669" size={22} />,
      money: salesInsights.totalOrders,
      prefix: salesInsights.totalOrders <= 1 ? "order" : "orders",
    },
    {
      id: "2",
      name: "Most Spent",
      icon: <LuWallet color="#64748b" size={22} />,
      money: salesInsights.mostSpent,
      prefix: "USD",
    },
    {
      id: "3",
      name: "Active Customers",
      icon: <FaRegUserCircle color="#64748b" size={22} />,
      money: salesInsights.activeCustomers,
      prefix: salesInsights.activeCustomers <= 1 ? "customer" : "customers",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {info.map((card) => (
        <div key={card.id} className="flex-1 min-w-[200px]">
          {pending ? (
            <InsightsCardSkeleton />
          ) : (
            <InsightsCard
              name={card.name}
              icon={card.icon}
              money={card.money}
              info={`The ${card.name} of ${duration}`}
              prefix={card.prefix}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function InsightsCardSkeleton() {
  return (
    <div className="p-5 border border-surface-200 rounded-xl flex flex-col gap-3 bg-surface-50 animate-pulse">
      <div className="w-full flex justify-between items-center">
        <div className="h-4 w-24 bg-surface-200 rounded" />
        <div className="h-6 w-6 bg-surface-200 rounded" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-7 w-20 bg-surface-300 rounded" />
        <div className="h-3 w-32 bg-surface-200 rounded" />
      </div>
    </div>
  );
}

export default SalesInsights;
