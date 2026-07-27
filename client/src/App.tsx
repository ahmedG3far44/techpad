
import Home from "./pages/Home";
import SEO from "./components/SEO";
import CartPage from "./pages/cart";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import NotFoundPage from "./pages/error";
import ProfilePage from "./pages/profile";
import Dashboard from "./pages/dashboard";
import OrdersHistory from "./pages/orders";
import CheckoutPage from "./pages/checkout";
import AddAddress from "./pages/add-address";
import CategoryPage from "./pages/categories";
import SuccessOrder from "./pages/success-order";
import SearchResults from "./pages/search";
import AboutPage from "./pages/about";
import PrivacyPage from "./pages/privacy";
import TermsPage from "./pages/terms";
import Insights from "./components/admin/Insights";
import AdminRoutes from "./components/AdminRoutes";
import ProductDetails from "./pages/product-details";
import AuthProvider from "./context/auth/AuthProvider";
import CartProvider from "./context/cart/CartProvider";
import AdminUsers from "./components/admin/AdminUsers";
import AdminOrders from "./components/admin/AdminOrders";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AdminProducts from "./components/admin/AdminProducts";
import AdminCategory from "./components/admin/AdminCategory";
import CategoryProvider from "./context/category/CategoryProvider";
import AdminSettings from "./components/admin/AdminSettings";

import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "./context/currency/CurrencyContext";

function App() {
  return (
    <HelmetProvider>
    <Analytics />
    <SpeedInsights />
    <AuthProvider>
      <CurrencyProvider>
      <CartProvider>
        <CategoryProvider>
          <SEO title="Home" description="Premium PC accessories and tech peripherals curated for performance and style." />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none">
            Skip to main content
          </a>
          <Toaster position="bottom-center" reverseOrder={false} />
          <BrowserRouter>
            <Routes>
              <Route index path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/search" element={<SearchResults />} />
              <Route
                path="/category/:categoryName"
                element={<CategoryPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/add-address" element={<AddAddress />} />
                <Route path="/orders-history" element={<OrdersHistory />} />
                <Route path="/success" element={<SuccessOrder />} />
              </Route>
              <Route element={<AdminRoutes />}>
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route path="categories" element={<AdminCategory />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route
                    path="all-orders"
                    element={<AdminOrders OrderStatus="all" />}
                  />
                  <Route
                    path="delivered-orders"
                    element={<AdminOrders OrderStatus="delivered" />}
                  />
                  <Route path="insights" element={<Insights />} />
                  <Route
                    path="pending-orders"
                    element={<AdminOrders OrderStatus="pending" />}
                  />
                  <Route
                    path="shipped-orders"
                    element={<AdminOrders OrderStatus="shipped" />}
                  />
                  <Route
                    path="settings"
                    element={<AdminSettings />}
                  />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </CategoryProvider>
      </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
