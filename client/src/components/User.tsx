import { useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { LuHistory } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";

import guestImg from "../../public/guestImg.jpg";
import useAuth from "../context/auth/AuthContext";

function User() {
  const { user, logOut } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  const handelLogout = () => {
    logOut();
    navigate("/");
  };

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!isOpen)}
        role="button"
        className="w-fit p-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-surface-700 hidden sm:block">
            {user?.firstName} {user?.lastName}
          </span>
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-surface-200">
            {user?.profileImage ? (
              <img
                className="w-full h-full object-cover"
                src={user.profileImage}
                alt="profile"
              />
            ) : (
              <img
                className="w-full h-full object-cover"
                src={guestImg}
                alt="default avatar"
              />
            )}
          </div>
          <span className={isOpen ? "" : "rotate-180"}>
            <MdKeyboardArrowUp size={18} className="text-surface-400" />
          </span>
        </div>
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <ul className="absolute z-50 top-full right-0 mt-2 min-w-44 p-1.5 animate-scaleIn rounded-xl bg-white border border-surface-200 shadow-xl">
            {user?.isAdmin ? (
              <li>
                <a
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer w-full hover:bg-surface-50 transition-colors text-sm text-surface-700"
                  href="/dashboard/insights"
                >
                  <RxDashboard size={18} className="text-surface-400" />
                  Dashboard
                </a>
              </li>
            ) : (
              <>
                <li>
                  <a
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer w-full hover:bg-surface-50 transition-colors text-sm text-surface-700"
                    href="/profile"
                  >
                    <CgProfile size={18} className="text-surface-400" />
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer w-full hover:bg-surface-50 transition-colors text-sm text-surface-700"
                    href="/orders-history"
                  >
                    <LuHistory size={18} className="text-surface-400" />
                    Order History
                  </a>
                </li>
              </>
            )}
            <li className="px-3 py-2 text-xs text-surface-500 border-t border-surface-100 mt-1 pt-2">
              {user?.email}
            </li>
            <li className="px-3 py-2">
              <button
                className="w-full px-4 py-2 bg-primary-600 rounded-lg text-white text-sm font-medium cursor-pointer hover:bg-primary-700 transition-colors"
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
