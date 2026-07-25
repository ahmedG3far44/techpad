import SEO from "../../components/SEO";
import { useState, useEffect } from "react";
import { FiSave, FiAlertCircle, FiCheck } from "react-icons/fi";
import useAuth from "../../context/auth/AuthContext";
import { useCurrency } from "../../context/currency/CurrencyContext";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;
const COUNTRIES = [
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "EU", name: "European Union", currency: "EUR", symbol: "€" },
  { code: "JP", name: "Japan", currency: "JPY", symbol: "¥" },
  { code: "EG", name: "Egypt", currency: "EGP", symbol: "£" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", symbol: "د.إ" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", symbol: "﷼" },
  { code: "QA", name: "Qatar", currency: "QAR", symbol: "﷼" },
  { code: "KW", name: "Kuwait", currency: "KWD", symbol: "د.ك" },
  { code: "BH", name: "Bahrain", currency: "BHD", symbol: ".د.ب" },
  { code: "OM", name: "Oman", currency: "OMR", symbol: "﷼" },
  { code: "TR", name: "Turkey", currency: "TRY", symbol: "₺" },
  { code: "CN", name: "China", currency: "CNY", symbol: "¥" },
  { code: "IN", name: "India", currency: "INR", symbol: "₹" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "$" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "$" },
  { code: "BR", name: "Brazil", currency: "BRL", symbol: "R$" },
  { code: "MX", name: "Mexico", currency: "MXN", symbol: "$" },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "$" },
  { code: "MY", name: "Malaysia", currency: "MYR", symbol: "RM" },
  { code: "KR", name: "South Korea", currency: "KRW", symbol: "₩" },
  { code: "HK", name: "Hong Kong", currency: "HKD", symbol: "$" },
  { code: "CH", name: "Switzerland", currency: "CHF", symbol: "Fr" },
  { code: "SE", name: "Sweden", currency: "SEK", symbol: "kr" },
  { code: "NO", name: "Norway", currency: "NOK", symbol: "kr" },
  { code: "DK", name: "Denmark", currency: "DKK", symbol: "kr" },
  { code: "PL", name: "Poland", currency: "PLN", symbol: "zł" },
  { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R" },
];

function AdminSettings() {
  const { token } = useAuth();
  const { settings, refreshSettings } = useCurrency();
  const [country, setCountry] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [exchangeRate, setExchangeRate] = useState("1");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setCountry(settings.country);
    setCurrencyCode(settings.currencyCode);
    setCurrencySymbol(settings.currencySymbol);
    setExchangeRate(settings.exchangeRate.toString());
  }, [settings]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COUNTRIES.find((c) => c.name === e.target.value);
    if (selected) {
      setCountry(selected.name);
      setCurrencyCode(selected.currency);
      setCurrencySymbol(selected.symbol);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);
      if (!token) {
        setMessage({ type: "error", text: "Authentication required" });
        return;
      }
      const rate = parseFloat(exchangeRate);
      if (isNaN(rate) || rate <= 0) {
        setMessage({ type: "error", text: "Exchange rate must be a positive number" });
        return;
      }
      const res = await fetch(`${BASE_URL}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ country, currencyCode, currencySymbol, exchangeRate: rate }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save settings");
      }
      setMessage({ type: "success", text: "Store settings updated successfully!" });
      await refreshSettings();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save settings" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-6 sm:py-8 motion-safe:animate-fadeIn motion-safe:[animation-fill-mode:backwards]">
      <SEO title="Store Settings" description="Configure store currency and region." />
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">Store Settings</h1>
        <p className="text-surface-500 text-sm mt-1">Configure your store's country and currency</p>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        <div className="border-b border-surface-200 px-5 py-4">
          <h2 className="text-base font-semibold text-surface-900">Currency & Region</h2>
          <p className="text-sm text-surface-500 mt-0.5">Set the local currency and exchange rate. Prices are stored in USD and converted for customers.</p>
        </div>

        <div className="p-5 space-y-5">
          {message && (
            <div
              className={`p-4 rounded-lg border flex items-center gap-2.5 motion-safe:animate-slideDown ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
              role="alert"
            >
              {message.type === "success" ? (
                <FiCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <span
                className={`text-sm font-medium ${
                  message.type === "success" ? "text-emerald-800" : "text-red-800"
                }`}
              >
                {message.text}
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Country / Region</label>
            <select
              value={country}
              onChange={handleCountryChange}
              disabled={loading}
              aria-label="Country selector"
              className="w-full px-3.5 py-2.5 border border-surface-300 rounded-lg text-sm text-surface-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 disabled:bg-surface-50 disabled:text-surface-400"
            >
              <option value="">Select a country...</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.currency} - {c.symbol})
                </option>
              ))}
            </select>
            <p className="text-xs text-surface-400 mt-1">Selecting a country automatically fills the currency fields below</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Currency Code</label>
              <input
                type="text"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
                disabled={loading}
                placeholder="e.g., USD"
                aria-label="Currency code"
                className="w-full px-3.5 py-2.5 border border-surface-300 rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 disabled:bg-surface-50 disabled:text-surface-400 uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Currency Symbol</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                disabled={loading}
                placeholder="e.g., $"
                aria-label="Currency symbol"
                className="w-full px-3.5 py-2.5 border border-surface-300 rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 disabled:bg-surface-50 disabled:text-surface-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Exchange Rate (1 USD = ?)</label>
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                disabled={loading}
                min="0.01"
                step="0.01"
                placeholder="1.00"
                aria-label="Exchange rate"
                className="w-full px-3.5 py-2.5 border border-surface-300 rounded-lg text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent motion-safe:transition-shadow motion-safe:duration-150 disabled:bg-surface-50 disabled:text-surface-400"
              />
            </div>
          </div>

          {country && (
            <div className="p-4 bg-surface-50 rounded-lg border border-surface-200" aria-live="polite">
              <h3 className="text-sm font-medium text-surface-800 mb-2">Price Preview</h3>
              <div className="flex flex-wrap gap-4">
                {[19.99, 49.99, 129.99].map((usd, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-xs text-surface-400 mb-0.5">USD {usd}</span>
                    <span className="text-sm font-semibold text-surface-900">&rarr;</span>
                    <span className="text-sm font-bold text-primary-600">{currencySymbol}{(usd * (parseFloat(exchangeRate) || 1)).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-surface-400 mt-2">Shows how prices will appear to customers. Update the exchange rate to match current market rates.</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-surface-200">
            <button
              onClick={handleSave}
              disabled={loading || !country}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 active:bg-primary-800 disabled:bg-surface-300 disabled:cursor-not-allowed motion-safe:transition-all motion-safe:duration-150 shadow-sm hover:shadow disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FiSave className="w-4 h-4" />
                  Save Settings
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
