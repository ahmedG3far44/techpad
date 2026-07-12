import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initPriceFormatter, getStoreSettings } from "../../utils/handlers";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export interface StoreSettings {
  country: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
}

interface CurrencyContextType {
  settings: StoreSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>({
    country: "United States",
    currencyCode: "USD",
    currencySymbol: "$",
    exchangeRate: 1,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/settings`);
      if (!res.ok) return;
      const data = await res.json();
      const s: StoreSettings = {
        country: data.country || "United States",
        currencyCode: data.currencyCode || "USD",
        currencySymbol: data.currencySymbol || "$",
        exchangeRate: data.exchangeRate || 1,
      };
      setSettings(s);
      initPriceFormatter({
        currencySymbol: s.currencySymbol,
        exchangeRate: s.exchangeRate,
        currencyCode: s.currencyCode,
      });
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ settings, loading, refreshSettings: fetchSettings }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
