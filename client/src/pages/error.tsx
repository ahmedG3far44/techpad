import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { LuSearchX } from "react-icons/lu";
import SEO from "../components/SEO";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50 to-surface-100 flex items-center justify-center p-4">
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />
      <div className="w-full max-w-md motion-safe:animate-fadeIn motion-safe:[animation-fill-mode:backwards]">
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-6">
            <LuSearchX className="w-8 h-8 text-primary-600" />
          </div>

          <h1 className="text-6xl sm:text-7xl font-bold text-surface-900 leading-none mb-3">
            404
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-surface-800 mb-3">
            Page not found
          </h2>
          <p className="text-sm text-surface-500 leading-relaxed mb-8 max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved. Check the URL or head back home.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-surface-300 text-surface-700 rounded-xl text-sm font-medium hover:bg-surface-50 hover:border-surface-400 transition-all"
            >
              <HiArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-sm"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
