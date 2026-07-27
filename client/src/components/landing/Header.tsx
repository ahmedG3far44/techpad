import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCategory } from "../../context/category/CategoryContext";

import Button from "../Button";
import User from "../User";
import Logo from "../Logo";
import Navigation from "../Navigation";

import useCart from "../../context/cart/CartContext";
import useAuth from "../../context/auth/AuthContext";
import ShoppingCart from "../ShoppingCart";

function Header() {
  const navigate = useNavigate();
  const { categories } = useCategory();
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [isScrolled, setScroll] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setSearchOpen] = useState(false);

  const totalItems = cartItems.reduce((curr, acc) => {
    return curr + acc.quantity;
  }, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY >= 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        role="banner"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-surface-200"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2 lg:py-3">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 flex-1 min-w-0">
              <Logo />
              <div className="hidden lg:block">
                <Navigation categories={categories} />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(!isSearchOpen)}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                aria-label="Search"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {isAuthenticated && <ShoppingCart itemsCartNumber={totalItems} />}

              <div className="hidden sm:flex items-center">
                {isAuthenticated ? (
                  <User />
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="sm" to="/login">
                      Login
                    </Button>
                    <Button variant="primary" size="sm" to="/signup">
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                aria-label="Menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="pb-2 sm:pb-3 animate-slideDown">
              <form
                onSubmit={handleSearch}
                className="relative max-w-2xl mx-auto"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-10 sm:pl-12 pr-10 py-2 sm:py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm bg-surface-50 text-sm sm:text-base"
                  autoFocus
                />
                <svg
                  className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-surface-400 w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5 text-surface-400 hover:text-surface-600"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Mobile menu"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-surface-200">
            <h2 className="text-lg font-semibold text-surface-900">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-10 h-10 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-4 border-b border-surface-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50"
              />
              <svg
                className="absolute left-3 top-3 text-surface-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.name.toLocaleLowerCase().split(" ").join("-").trim()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <div className="mt-6 pt-6 border-t border-surface-200">
                <button
                  onClick={() => {
                    navigate("/cart");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all font-medium"
                >
                  <span className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Shopping Cart
                  </span>
                  {totalItems > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-surface-200">
            {isAuthenticated ? (
              <div onClick={() => setMobileMenuOpen(false)}>
                <User />
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
