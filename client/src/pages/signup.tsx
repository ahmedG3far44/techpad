import {
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuCircleUserRound,
  LuUserRoundCheck,
  LuShoppingBag,
  LuSparkles,
} from "react-icons/lu";
import { useState } from "react";
import { register } from "../utils/handlers";
import { Navigate } from "react-router-dom";
import SEO from "../components/SEO";

import useAuth from "../context/auth/AuthContext";

interface UserRegisterInputsType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function SignUpPage() {
  const { isAuthenticated, logUser } = useAuth();

  const [userRegister, setUserRegister] = useState<UserRegisterInputsType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [pending, setPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPending(true);

    try {
      const data = await register(userRegister);
      const { user, token } = data;
      logUser({ user, token });
    } catch (err: any) {
      setError(err?.message || "An error occurred during registration");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      <SEO title="Sign Up" description="Create your TechPad account." />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/50">
        <div className="w-full p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-8">
            <div className="inline-flex md:hidden items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl mb-4">
              <LuShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-500">
              Join us and start your shopping journey
            </p>
          </div>

          <form aria-label="Sign up form" onSubmit={handleRegister} className="w-full space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                First Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                  <LuCircleUserRound size={20} />
                </div>
                <input
                  type="text"
                  autoComplete="given-name"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Enter your first name"
                  value={userRegister.firstName}
                  onChange={(e) =>
                    setUserRegister({
                      ...userRegister,
                      firstName: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Last Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                  <LuUserRoundCheck size={20} />
                </div>
                <input
                  type="text"
                  autoComplete="family-name"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Enter your last name"
                  value={userRegister.lastName}
                  onChange={(e) =>
                    setUserRegister({
                      ...userRegister,
                      lastName: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                  <LuMail size={20} />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                  value={userRegister.email}
                  onChange={(e) =>
                    setUserRegister({ ...userRegister, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                  <LuLock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Create a strong password"
                  value={userRegister.password}
                  onChange={(e) =>
                    setUserRegister({
                      ...userRegister,
                      password: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-start gap-3 animate-shake">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex items-start text-sm pt-1">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2.5 h-4 w-4 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                required
              />
              <label
                htmlFor="terms"
                className="text-gray-700 cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-4 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={pending}
            >
              {pending ? (
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
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Sign in to your existing account{" "}
              <a
                href="/login"
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors inline-flex items-center gap-1"
              >
                Log In
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </p>
          </div>
        </div>
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden order-1 md:order-2">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
              <LuShoppingBag className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Join Our Community!
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-xs mx-auto">
              Create your account and unlock exclusive shopping benefits
            </p>

            <div className="space-y-4 mt-12">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <LuSparkles className="w-4 h-4" />
                </div>
                <span className="text-left">
                  Get 10% off on your first order
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <LuSparkles className="w-4 h-4" />
                </div>
                <span className="text-left">
                  Free shipping on orders over $50
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <LuSparkles className="w-4 h-4" />
                </div>
                <span className="text-left">Early access to new products</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <LuSparkles className="w-4 h-4" />
                </div>
                <span className="text-left">24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
