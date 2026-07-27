import { useCurrency } from "../context/currency/CurrencyContext";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";
import SEO from "../components/SEO";

function PrivacyPage() {
  const { settings, loading } = useCurrency();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO title="Privacy Policy" description="TechPad privacy policy and data protection practices." />
      <Header />
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full">
        <h1 className="text-3xl font-bold text-surface-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-surface max-w-none text-surface-700">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-surface-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-surface-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-surface-200 rounded animate-pulse w-5/6" />
            </div>
          ) : settings.privacyContent ? (
            settings.privacyContent.split("\n").map((p, i) => <p key={i} className="mb-4 leading-relaxed">{p}</p>)
          ) : (
            <p className="text-surface-500">No content available yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PrivacyPage;
