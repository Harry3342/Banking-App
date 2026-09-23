import React, { useState } from "react";
import { useBanking } from "../../context/BankingContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Shield,
  Lock,
  ArrowRight,
  Sparkles,
  Building,
  User,
  CheckCircle2,
  Activity,
  Zap,
  Layers,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

// Zod schemas for validation
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["personal", "business"]),
  address1: z.string().min(3, "Street address is required for Dwolla KYC"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "State must be a 2-letter abbreviation (e.g. CA)"),
  postalCode: z.string().regex(/^\d{5}$/, "Postal code must be 5 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  ssn: z.string().regex(/^\d{4}$/, "Please enter the last 4 digits of SSN"),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export const AuthView: React.FC = () => {
  const { login, signup, allUsers } = useBanking();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sign In form
  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    setValue: setSignInValue,
    formState: { errors: signInErrors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "harrynjoga@gmail.com",
      password: "password123",
    },
  });

  // Sign Up form
  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "personal",
      address1: "",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      dateOfBirth: "1995-06-15",
      ssn: "4821",
    },
  });

  const onSignIn = async (data: SignInValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await login(data.email, data.password);
      if (!res.success) {
        setAuthError(res.error || "Authentication failed. Please check credentials.");
      }
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await signup(data);
      if (!res.success) {
        setAuthError(res.error || "Failed to create Appwrite account.");
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred during account creation.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = (email: string) => {
    setSignInValue("email", email);
    setSignInValue("password", "password123");
    login(email, "password123");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
          <Shield className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Horizon Bank
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Next.js 14 • Appwrite BaaS • Plaid Link • Dwolla ACH
        </p>

        {/* Tab Switcher */}
        <div className="mt-6 inline-flex rounded-xl bg-slate-200/80 p-1">
          <button
            id="tab-btn-signin"
            onClick={() => {
              setAuthMode("signin");
              setAuthError(null);
            }}
            className={`rounded-lg px-6 py-1.5 text-xs font-bold transition ${
              authMode === "signin"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-btn-signup"
            onClick={() => {
              setAuthMode("signup");
              setAuthError(null);
            }}
            className={`rounded-lg px-6 py-1.5 text-xs font-bold transition ${
              authMode === "signup"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Card Form */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-5">
          {authError && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authMode === "signin" ? (
            <form id="form-signin" onSubmit={handleSignInSubmit(onSignIn)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...registerSignIn("email")}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {signInErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    {signInErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Demo: password123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerSignIn("password")}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signInErrors.password && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    {signInErrors.password.message}
                  </p>
                )}
              </div>

              <button
                id="btn-submit-signin"
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Verifying Appwrite Session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Horizon Bank</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* 1-Click Demo Profiles */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                  Instant Demo Access
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickDemoLogin("harrynjoga@gmail.com")}
                    className="flex flex-col text-left rounded-xl border border-slate-200 p-2.5 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      Harry Njoga
                    </span>
                    <span className="text-[10px] text-slate-500">Personal Banking</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold mt-1">
                      harrynjoga@gmail.com
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickDemoLogin("harry.ventures@fintech.io")}
                    className="flex flex-col text-left rounded-xl border border-slate-200 p-2.5 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      Harry Njoga (Ventures)
                    </span>
                    <span className="text-[10px] text-slate-500">Business LLC</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold mt-1">
                      harry.ventures@fintech.io
                    </span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form id="form-signup" onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Alex Mercer"
                    {...registerSignUp("name")}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                  {signUpErrors.name && (
                    <p className="mt-1 text-[11px] text-rose-600">{signUpErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Account Type
                  </label>
                  <select
                    {...registerSignUp("role")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="personal">Personal Account</option>
                    <option value="business">Business LLC Account</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="alex@fintech.com"
                  {...registerSignUp("email")}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
                {signUpErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-600">{signUpErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password (min 8 chars)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  {...registerSignUp("password")}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
                {signUpErrors.password && (
                  <p className="mt-1 text-[11px] text-rose-600">{signUpErrors.password.message}</p>
                )}
              </div>

              {/* Address / KYC fields */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Dwolla Customer Verification (KYC)
                </span>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="101 California St, Suite 200"
                    {...registerSignUp("address1")}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                  {signUpErrors.address1 && (
                    <p className="mt-1 text-[11px] text-rose-600">{signUpErrors.address1.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="San Francisco"
                      {...registerSignUp("city")}
                      className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="CA"
                      {...registerSignUp("state")}
                      className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-800 uppercase focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="94105"
                      {...registerSignUp("postalCode")}
                      className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      {...registerSignUp("dateOfBirth")}
                      className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">SSN (Last 4)</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="1234"
                      {...registerSignUp("ssn")}
                      className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-mono text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                id="btn-submit-signup"
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Registering with Appwrite BaaS...</span>
                  </>
                ) : (
                  <>
                    <span>Create Horizon Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security footnote */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>Appwrite Encrypted Session • Sentry Audited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
