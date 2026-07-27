import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { LuHistory } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";

import useAuth from "../context/auth/AuthContext";

function User() {
  const { user, logOut } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const handelLogout = () => {
    logOut();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <div
        onClick={() => setOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen(!isOpen)}
        className="w-fit p-1.5 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-surface-700 hidden sm:block">
            {user?.firstName}
          </span>
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary-200">
            {user?.profileImage ? (
              <img
                className="w-full h-full object-cover"
                src={user.profileImage}
                alt="profile"
              />
            ) : (
              <img
                className="w-full h-full object-cover"
                src="/guestImg.jpg"
                alt="default avatar"
              />
            )}
          </div>
          <span
            className={`transition-transform duration-200 ${isOpen ? "rotate-0" : "rotate-180"}`}
          >
            <MdKeyboardArrowUp size={16} className="text-surface-400" />
          </span>
        </div>
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <ul
            className="absolute z-50 top-full right-0 mt-2 min-w-40 p-1 rounded-xl bg-white border border-surface-200 shadow-lg shadow-black/5 animate-scaleIn origin-top-right"
          >
            {user?.isAdmin ? (
              <li>
                <a
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer w-full hover:bg-primary-50 transition-colors text-sm text-surface-700"
                  href="/dashboard/insights"
                >
                  <RxDashboard size={16} className="text-primary-500" />
                  Dashboard
                </a>
              </li>
            ) : (
              <>
                <li>
                  <a
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer w-full hover:bg-primary-50 transition-colors text-sm text-surface-700"
                    href="/profile"
                  >
                    <CgProfile size={16} className="text-primary-500" />
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer w-full hover:bg-primary-50 transition-colors text-sm text-surface-700"
                    href="/orders-history"
                  >
                    <LuHistory size={16} className="text-primary-500" />
                    Order History
                  </a>
                </li>
              </>
            )}
            <li className="px-3 py-1.5 text-xs text-surface-500 border-t border-surface-100 mt-0.5 pt-1.5 truncate">
              {user?.email}
            </li>
            <li className="px-1 py-1">
              <button
                className="w-full px-3 py-1.5 bg-primary-600 rounded-lg text-white text-xs font-medium cursor-pointer hover:bg-primary-700 transition-colors"
                onClick={handelLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

export default User;
