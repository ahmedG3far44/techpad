import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategory } from "../../context/category/CategoryContext";
import { handlePrice } from "../../utils/handlers";
import Button from "../Button";

import {
  FaShippingFast,
  FaMoneyBillWave,
  FaShieldAlt,
  FaCertificate,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface CountdownProps {
  targetHours: number;
  targetMinutes: number;
  targetSeconds: number;
}

const Countdown: React.FC<CountdownProps> = ({
  targetHours,
  targetMinutes,
  targetSeconds,
}) => {
  const [time, setTime] = useState({
    hours: targetHours,
    minutes: targetMinutes,
    seconds: targetSeconds,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2">
      <TimeUnit value={time.hours} label="Hours" />
      <span className="text-white/60 text-xl font-bold">:</span>
      <TimeUnit value={time.minutes} label="Mins" />
      <span className="text-white/60 text-xl font-bold">:</span>
      <TimeUnit value={time.seconds} label="Secs" />
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] border border-white/10">
    <span className="text-2xl font-bold text-white">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] text-white/70 uppercase tracking-wider">{label}</span>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl p-5 flex items-start gap-4 border border-surface-200 hover:border-primary-200 hover:shadow-md hover:shadow-primary-500/5 transition-all duration-300 group">
    <div className="text-primary-600 text-xl mt-1 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <div>
      <h3 className="font-semibold text-surface-900 mb-0.5">{title}</h3>
      <p className="text-sm text-surface-500">{description}</p>
    </div>
  </div>
);

const Hero: React.FC = () => {
  const [categoryPage, setCategoryPage] = useState(0);
  const { categories } = useCategory();

  const getItemsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 2;
      if (window.innerWidth < 1024) return 4;
      return 5;
    }
    return 5;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
      setCategoryPage(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = categoryPage * itemsPerPage;
  const visibleCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevCategory = () => {
    setCategoryPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextCategory = () => {
    setCategoryPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {/* Main Banner */}
        <div role="region" aria-label="Hero banner" className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center p-6 sm:p-8 lg:p-12 min-h-[320px] lg:min-h-[400px]">
            <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4 sm:mb-6">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-slow" />
                <span className="text-xs font-medium text-white/90">New Arrivals Weekly</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                The Best Place To
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-300 to-primary-300">
                  Find & Buy Tech
                </span>
              </h1>
              <p className="text-surface-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                Premium PC accessories and peripherals curated for performance and style.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button variant="primary" size="lg" to="/category/keyboards">
                  Shop Now
                </Button>
                <Button variant="ghost" size="lg" to="/category/mice" className="text-white hover:text-white hover:bg-white/10">
                  Explore Products
                </Button>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-surface-400 text-xs sm:text-sm">
                  <strong className="text-white font-semibold">5000+</strong> happy customers
                </span>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/30 to-accent-500/30 rounded-full blur-2xl animate-pulse-slow" />
                <img
                  src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&h=500&fit=crop"
                  alt="Wireless headset and keyboard on desk"
                  role="img"
                  aria-label="Tech products showcase"
                  className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] object-contain drop-shadow-2xl animate-float"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Side Cards */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Flash Deal */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-600 via-accent-500 to-orange-500 p-5 sm:p-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow" />
                <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Limited Deal</span>
              </div>
              <p className="text-sm text-white/80 mb-3">Offer ends in:</p>
              <Countdown targetHours={7} targetMinutes={23} targetSeconds={53} />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Wireless Headset</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-bold text-white">{handlePrice(199)}</span>
                    <span className="text-sm text-white/60 line-through">{handlePrice(299)}</span>
                  </div>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center text-white text-lg font-bold border-2 border-white/20">
                  -33%
                </div>
              </div>
            </div>
          </div>

          {/* Save Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-900 via-surface-800 to-accent-900 p-5 sm:p-6">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-accent-300 font-medium mb-1">FLASH SALE</p>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    Save Big on
                    <br />
                    Premium Gear
                  </h3>
                </div>
                <div className="bg-accent-500 rounded-lg px-3 py-2 text-center">
                  <p className="text-[10px] text-white/80 uppercase">Save</p>
                  <p className="text-2xl font-black text-white">40%</p>
                </div>
              </div>
              <div className="mt-3">
                <Link
                  to="/category/monitors"
                  className="inline-flex items-center gap-1.5 text-xs text-accent-300 hover:text-accent-200 font-medium transition-colors"
                >
                  Shop Monitors
                  <FaChevronRight size={10} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-14">
        <FeatureCard icon={<FaShippingFast />} title="Free Shipping" description="Orders above ₹1000" />
        <FeatureCard icon={<FaMoneyBillWave />} title="Cash On Delivery" description="Available for most areas" />
        <FeatureCard icon={<FaShieldAlt />} title="Secure Payment" description="Safe shopping guaranteed" />
        <FeatureCard icon={<FaCertificate />} title="Warranty Policy" description="30 days money back" />
      </div>

      {/* Category Section */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-surface-900">
              Shop by Category
            </h2>
            <p className="text-sm text-surface-500 mt-1">Browse our curated collections</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevCategory}
              disabled={totalPages <= 1}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-surface-100 hover:bg-surface-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-surface-600"
              aria-label="Previous"
            >
              <FaChevronLeft className="text-xs sm:text-sm" />
            </button>
            <button
              onClick={handleNextCategory}
              disabled={totalPages <= 1}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white"
              aria-label="Next"
            >
              <FaChevronRight className="text-xs sm:text-sm" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {visibleCategories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.name.toLocaleLowerCase().split(" ").join("-").trim()}`}
                className="group relative bg-white rounded-xl border border-surface-200 p-3 sm:p-4 lg:p-5 flex flex-col items-center justify-center hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
              >
                <div className="w-full aspect-square mb-3 overflow-hidden rounded-lg bg-surface-50">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-surface-700 text-center group-hover:text-primary-600 transition-colors line-clamp-2">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div role="tablist" aria-label="Category pages" className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === categoryPage}
                onClick={() => setCategoryPage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === categoryPage
                    ? "bg-primary-600 w-6"
                    : "bg-surface-300 hover:bg-surface-400 w-2"
                }`}
                aria-label={`Page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
