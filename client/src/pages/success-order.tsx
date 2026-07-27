import { useNavigate } from "react-router-dom";
import { IoCheckmarkDoneCircle, IoBagHandle } from "react-icons/io5";
import { HiArrowRight } from "react-icons/hi";
import { FiPackage } from "react-icons/fi";
import SEO from "../components/SEO";

function SuccessOrder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50 to-emerald-50 flex items-center justify-center p-4">
      <SEO
        title="Order Successful"
        description="Your order has been placed successfully."
      />
      <div className="w-full max-w-lg motion-safe:animate-slideUp motion-safe:[animation-fill-mode:backwards]">
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <IoCheckmarkDoneCircle className="w-9 h-9 text-emerald-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">
            Order Placed!
          </h1>
          <p className="text-surface-500 text-sm sm:text-base mb-8 leading-relaxed max-w-sm mx-auto">
            Thank you for your purchase. Your order has been received and is
            being processed. You'll receive a confirmation email shortly.
          </p>

          <div className="bg-surface-50 rounded-xl p-5 mb-8 text-left space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <FiPackage className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-surface-800">Order Confirmed</p>
                <p className="text-xs text-surface-500 mt-0.5">
                  Your order number has been generated
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <IoBagHandle className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-surface-800">Ready to Ship</p>
                <p className="text-xs text-surface-500 mt-0.5">
                  We'll notify you when it ships
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/orders-history")}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-surface-300 text-surface-700 rounded-xl text-sm font-medium hover:bg-surface-50 hover:border-surface-400 transition-all"
            >
              View Orders
              <HiArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-all shadow-sm"
            >
              Continue Shopping
              <HiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-surface-400 text-center mt-6">
          A confirmation email with your order details has been sent to your
          email address.
        </p>
      </div>
    </div>
  );
}

export default SuccessOrder;
