import { useEffect, useState } from "react";

import { LuBox } from "react-icons/lu";
import { FiLogOut, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { PiUsersDuotone } from "react-icons/pi";
import { OrdersCountType } from "../utils/types";
import { AiOutlineProduct } from "react-icons/ai";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiBarChartSquare, BiHomeSmile } from "react-icons/bi";
import { TbShoppingCartCopy, TbSitemap } from "react-icons/tb";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../context/auth/AuthContext";
import SEO from "../components/SEO";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function Dashboard() {
  const { logOut, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrdersCountType>({
    pending: 0,
    delivered: 0,
    shipped: 0,
    totalOrders: 0,
  });
  const activeLink = location.pathname.split("/").pop();
  useEffect(() => {
    async function getOrdersCountStatus() {
      try {
        if (!token) throw new Error("your not authorized to do this action!!!");
        setPending(true);
        const response = await fetch(`${BASE_URL}/admin/orders-insights`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("can't get orders counts insights!!");
        const data = await response.json();
        setOrderStatus({ ...data });
        return;
      } catch (err) {
        console.error(err);
      } finally {
        setPending(false);
      }
    }
    getOrdersCountStatus();
  }, [token]);

  const dashboardList = [
    {
      id: 1,
      name: "Home",
      link: "home",
      path: "/",
      icon: <BiHomeSmile size={20} />,
    },
    {
      id: 2,
      name: "Insight",
      link: "insights",
      path: "/dashboard/insights",
      icon: <BiBarChartSquare size={20} />,
    },
    {
      id: 3,
      name: "Categories",
      link: "categories",
      path: "/dashboard/categories",
      icon: <TbSitemap size={20} />,
    },
    {
      id: 4,
      name: "Products",
      link: "products",
      path: "/dashboard/products",
      icon: <AiOutlineProduct size={20} />,
    },
    {
      id: 5,
      name: "Users",
      link: "users",
      path: "/dashboard/users",
      icon: <PiUsersDuotone size={20} />,
    },
    {
      id: 6,
      name: "All Orders",
      link: "all-orders",
      path: "/dashboard/all-orders",
      icon: <LuBox size={20} />,
    },
    {
      id: 7,
      name: "Delivered Orders",
      link: "delivered-orders",
      path: "/dashboard/delivered-orders",
      icon: <TbShoppingCartCopy size={20} />,
    },
    {
      id: 8,
      name: "Pending Orders",
      link: "pending-orders",
      path: "/dashboard/pending-orders",
      icon: <MdAccessTime size={20} />,
    },
    {
      id: 9,
      name: "Shipped Orders",
      link: "shipped-orders",
      path: "/dashboard/shipped-orders",
      icon: <LiaShippingFastSolid size={20} />,
    },
    {
      id: 10,
      name: "Settings",
      link: "settings",
      path: "/dashboard/settings",
      icon: <FiSettings size={20} />,
    },
  ];

  const handelLogout = () => {
    logOut();
    navigate("/");
  };
  return (
    <>
      <SEO title="Admin Dashboard" description="Manage your store." />
      <div className="w-full min-h-screen max-w-full flex justify-start bg-surface-100 items-start relative">
      <DashboardSidebar
        dashboardList={dashboardList}
        pending={pending}
        orderStatus={orderStatus}
        activeLink={activeLink as string}
        handelLogout={handelLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <main className="w-[80%] min-h-screen h-screen overflow-y-auto absolute right-0 top-0 p-4 max-sm:w-full max-md:w-full max-sm:relative max-md:relative bg-surface-50">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center w-10 h-10 text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl motion-safe:transition-all motion-safe:duration-150"
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">D</span>
            </div>
            <span className="text-sm font-semibold text-surface-700">Dashboard</span>
          </div>
          <button
            onClick={handelLogout}
            className="flex items-center justify-center w-10 h-10 text-surface-500 hover:text-red-600 hover:bg-red-50 rounded-xl motion-safe:transition-all motion-safe:duration-150"
            aria-label="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
        {<Outlet />}
      </main>
    </div>
    </>
  );
}

export default Dashboard;

interface DashboardSidebarProps {
  dashboardList: any[];
  activeLink: string;
  orderStatus: {
    pending: number;
    delivered: number;
    shipped: number;
    totalOrders: number;
  };
  pending: boolean;
  handelLogout: () => void;
  isMobileMenuOpen?: boolean;
  onCloseMobile?: () => void;
}

function SidebarContent({
  dashboardList, activeLink, orderStatus, pending, handelLogout, onCloseMobile,
}: DashboardSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900">Dashboard</h2>
            <p className="text-xs text-surface-500">Admin Panel</p>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="flex items-center justify-center w-9 h-9 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-xl motion-safe:transition-all motion-safe:duration-150"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {dashboardList.map((url: any) => {
            const isActive = url.link === activeLink;
            let notificationCount = 0;
            if (url.link === "pending-orders") notificationCount = orderStatus.pending;
            else if (url.link === "shipped-orders") notificationCount = orderStatus.shipped;
            else if (url.link === "all-orders") notificationCount = orderStatus.totalOrders;

            return (
              <li key={url.id} className="w-full">
                <a
                  href={url.path}
                  onClick={onCloseMobile}
                  className={`group relative w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl motion-safe:transition-all motion-safe:duration-150 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-200"
                      : "text-surface-600 hover:bg-surface-100"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`text-lg motion-safe:transition-transform motion-safe:duration-150 ${isActive ? "" : "group-hover:scale-110"}`}>
                      {url.icon}
                    </span>
                    <span className={`font-medium text-sm ${isActive ? "font-semibold" : ""}`}>
                      {url.name}
                    </span>
                  </div>
                  {pending ? (
                    <div className="w-5 h-5 bg-surface-200 rounded animate-pulse" />
                  ) : notificationCount > 0 ? (
                    url.link === "all-orders" ? (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-surface-200 text-surface-600"}`}>
                        {notificationCount}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 text-xs font-bold rounded-full shadow-sm bg-primary-600 text-white">
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </span>
                    )
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="pt-6 border-t border-surface-200 mb-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-900 truncate">Admin</p>
            <p className="text-xs text-surface-500 truncate">admin@techpad.com</p>
          </div>
        </div>
      </div>

      <button
        onClick={handelLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-50 text-surface-700 font-semibold border border-surface-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 motion-safe:transition-all motion-safe:duration-150 shadow-sm hover:shadow group cursor-pointer"
      >
        <FiLogOut className="text-lg motion-safe:transition-transform motion-safe:duration-150 group-hover:translate-x-0.5" />
        <span>Logout</span>
      </button>
    </div>
  );
}

export function DashboardSidebar(props: DashboardSidebarProps) {
  const { isMobileMenuOpen, onCloseMobile } = props;
  return (
    <>
      <aside className="min-h-screen h-full w-[280px] bg-white border-r border-surface-200 p-6 flex-col justify-between fixed left-0 top-0 shadow-sm max-md:hidden max-sm:hidden hidden md:flex">
        <SidebarContent {...props} onCloseMobile={undefined} />
      </aside>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-white shadow-2xl motion-safe:animate-slideRight motion-safe:[animation-fill-mode:backwards]">
            <div className="h-full p-6 overflow-y-auto">
              <SidebarContent {...props} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
