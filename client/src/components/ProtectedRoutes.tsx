import Header from "./landing/Header";
import useAuth from "../context/auth/AuthContext";

import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={"/login"} replace></Navigate>;
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        <Outlet />
      </main>
    </>
  );
}

export default ProtectedRoutes;
