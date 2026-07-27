import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initPriceFormatter } from "../../utils/handlers";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export interface StoreSettings {
  country: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  shippingPrice: number;
  taxPercentage: number;
  supportEmail: string;
  supportPhone: string;
  location: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  aboutContent: string;
  privacyContent: string;
  termsContent: string;
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
    shippingPrice: 0,
    taxPercentage: 0,
    supportEmail: "",
    supportPhone: "",
    location: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    aboutContent: "",
    privacyContent: "",
    termsContent: "",
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
        shippingPrice: data.shippingPrice ?? 0,
        taxPercentage: data.taxPercentage ?? 0,
        supportEmail: data.supportEmail ?? "",
        supportPhone: data.supportPhone ?? "",
        location: data.location ?? "",
        facebookUrl: data.facebookUrl ?? "",
        instagramUrl: data.instagramUrl ?? "",
        tiktokUrl: data.tiktokUrl ?? "",
        aboutContent: data.aboutContent ?? "",
        privacyContent: data.privacyContent ?? "",
        termsContent: data.termsContent ?? "",
      };
      setSettings(s);
      initPriceFormatter(s);
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
