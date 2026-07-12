
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPlus, FaExclamationCircle } from "react-icons/fa";
import SEO from "../components/SEO";

import useAuth from "../context/auth/AuthContext";

import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

function AddAddress() {
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const { token } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handelAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) return;
      const newAddress = addressRef?.current?.value;
      if (!newAddress) throw new Error("Address field is required!");
      setPending(true);
      const response = await fetch(`${BASE_URL}/user/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: newAddress }),
      });
      if (!response.ok) {
        throw new Error("Can't add new address!");
      }
      const data = await response.json();
      toast.success("A new address was added!");
      navigate("/checkout");
      if (addressRef?.current) {
        addressRef.current.value = "";
      }
      return data;
    } catch (err: any) {
      setError(err?.message);
      toast.error(err?.message);
      return err;
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Add Address" description="Add a new shipping address." />
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Address
          </h1>
          <p className="text-gray-600 text-sm">
            Please enter your delivery address details
          </p>
        </div>
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm animate-fadeIn">
            <div className="flex items-start">
              <FaExclamationCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form aria-label="Add address form" onSubmit={handelAddNewAddress} className="space-y-6">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  ref={addressRef}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 shadow-sm hover:border-gray-400"
                  placeholder="Enter your full delivery address including street, city, state, and postal code"
                  disabled={pending}
                />
                <div className="absolute bottom-3 right-3">
                  <FaMapMarkerAlt className="text-gray-300 text-lg" />
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Make sure to include all relevant details for accurate delivery
              </p>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center space-x-2 group"
            >
              {pending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Adding Address...</span>
                </>
              ) : (
                <>
                  <FaPlus className="text-lg group-hover:scale-110 transition-transform" />
                  <span>Add Address</span>
                </>
              )}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your address information is secure and will only be used for
            delivery purposes
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddAddress;
