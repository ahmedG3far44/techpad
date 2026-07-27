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
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50 to-accent-50 flex items-center justify-center p-4 relative overflow-hidden">
      <SEO title="Sign Up" description="Create your TechPad account." />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden relative z-10 border border-white/50">
        <div className="w-full p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-6">
            <div className="inline-flex md:hidden items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl mb-3">
              <LuShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 mb-1">
              Create Account
            </h1>
            <p className="text-surface-500 text-sm">
              Join us and start your shopping journey
            </p>
          </div>

          <form aria-label="Sign up form" onSubmit={handleRegister} className="w-full space-y-3.5">
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-sm font-medium text-surface-700 block mb-1">
                  First Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400 group-focus-within:text-primary-600 transition-colors">
                    <LuCircleUserRound size={18} />
                  </div>
                  <input
                    type="text"
                    autoComplete="given-name"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-surface-50 rounded-lg border border-surface-300 focus:outline-none focus:border-primary-600 focus:bg-white focus:ring-1 focus:ring-primary-600 transition-all text-surface-900 placeholder-surface-400 text-sm"
                    placeholder="First name"
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

              <div>
                <label className="text-sm font-medium text-surface-700 block mb-1">
                  Last Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400 group-focus-within:text-primary-600 transition-colors">
                    <LuUserRoundCheck size={18} />
                  </div>
                  <input
                    type="text"
                    autoComplete="family-name"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-surface-50 rounded-lg border border-surface-300 focus:outline-none focus:border-primary-600 focus:bg-white focus:ring-1 focus:ring-primary-600 transition-all text-surface-900 placeholder-surface-400 text-sm"
                    placeholder="Last name"
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
            </div>

            <div>
              <label className="text-sm font-medium text-surface-700 block mb-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400 group-focus-within:text-primary-600 transition-colors">
                  <LuMail size={18} />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-surface-50 rounded-lg border border-surface-300 focus:outline-none focus:border-primary-600 focus:bg-white focus:ring-1 focus:ring-primary-600 transition-all text-surface-900 placeholder-surface-400 text-sm"
                  placeholder="you@example.com"
                  value={userRegister.email}
                  onChange={(e) =>
                    setUserRegister({ ...userRegister, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-surface-700 block mb-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400 group-focus-within:text-primary-600 transition-colors">
                  <LuLock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-surface-50 rounded-lg border border-surface-300 focus:outline-none focus:border-primary-600 focus:bg-white focus:ring-1 focus:ring-primary-600 transition-all text-surface-900 placeholder-surface-400 text-sm"
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
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-surface-400 hover:text-surface-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 animate-shake">
                <svg
                  className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
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

            <div className="flex items-start text-sm pt-0.5">
              <input
                type="checkbox"
                id="terms"
                className="mt-0.5 mr-2 h-4 w-4 rounded border border-surface-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                required
              />
              <label
                htmlFor="terms"
                className="text-surface-600 cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold rounded-lg transition-all duration-150 flex items-center justify-center shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-surface-500 font-medium">
                  Already have an account?
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-surface-600 text-sm">
              Sign in to your existing account{" "}
              <a
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors inline-flex items-center gap-1"
              >
                Log In
                <svg
                  className="w-3.5 h-3.5"
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
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-primary-700 to-primary-900 text-white relative overflow-hidden order-1 md:order-2">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl mb-5 shadow-lg">
              <LuShoppingBag className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold mb-3 leading-tight">
              Join Our Community!
            </h2>
            <p className="text-primary-100 text-base mb-6 max-w-xs mx-auto">
              Create your account and unlock exclusive shopping benefits
            </p>

            <div className="space-y-3 mt-10">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <LuSparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-left">
                  Get 10% off on your first order
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <LuSparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-left">
                  Free shipping on orders over $50
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <LuSparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-left">Early access to new products</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <LuSparkles className="w-3.5 h-3.5" />
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
