import React from "react";
import { useBanking } from "../../context/BankingContext";
import {
  Bell,
  Eye,
  EyeOff,
  Plus,
  Activity,
  ShieldCheck,
  ChevronDown,
  Building2,
  RefreshCw,
  Zap,
  LogOut,
} from "lucide-react";
import { formatAmount } from "../../lib/utils";

export const Header: React.FC<{ onMenuToggle?: () => void }> = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    logout,
    bankAccounts,
    selectedAccountId,
    setSelectedAccountId,
    setIsPlaidModalOpen,
    setIsSentryDrawerOpen,
    sentryEvents,
    hideBalances,
    setHideBalances,
    resetAllData,
  } = useBanking();

  const totalBalance = bankAccounts.reduce(
    (sum, acc) => sum + acc.availableBalance,
    0
  );

  const errorCount = sentryEvents.filter((e) => e.level === "error").length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left side: Account selector and Total Balance Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="account-selector" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline">
            Active Bank
          </label>
          <div className="relative">
            <select
              id="account-selector"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-800 transition hover:bg-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Accounts ({bankAccounts.length})</option>
              {bankAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.institutionName} •••• {acc.mask} ({formatAmount(acc.availableBalance)})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <button
          onClick={() => setHideBalances((prev) => !prev)}
          title={hideBalances ? "Show balances" : "Hide balances"}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          {hideBalances ? (
            <>
              <EyeOff className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden md:inline font-mono">••••••</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden md:inline font-medium text-slate-900">
                {formatAmount(totalBalance)}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Right side: Plaid Link button, Sentry Monitor, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Plaid Link Connect Button */}
        <button
          id="btn-connect-bank-header"
          onClick={() => setIsPlaidModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Connect Bank</span>
          <span className="sm:hidden">Connect</span>
        </button>

        {/* Sentry Telemetry Trigger */}
        <button
          id="btn-open-sentry-monitor"
          onClick={() => setIsSentryDrawerOpen(true)}
          className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          title="Open Sentry Application Monitoring & Telemetry"
        >
          <Activity className="h-3.5 w-3.5 text-violet-600" />
          <span className="hidden md:inline">Sentry Logs</span>
          {errorCount > 0 ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {errorCount}
            </span>
          ) : (
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          )}
        </button>

        {/* Appwrite User Switcher */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="relative group">
            <button className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-slate-100">
              <img
                src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="hidden text-left lg:block">
                <p className="text-xs font-semibold text-slate-900 leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[10px] font-medium text-emerald-600 capitalize mt-0.5">
                  Appwrite {currentUser.role}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 hidden w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl group-hover:block group-focus-within:block z-50">
              <div className="px-2 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-semibold uppercase text-slate-400">
                  Switch Appwrite Session
                </p>
              </div>
              {allUsers.map((user) => (
                <button
                  key={user.$id}
                  onClick={() => switchUser(user.$id)}
                  className={`mt-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs text-left transition ${
                    currentUser.$id === user.$id
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="truncate">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  {currentUser.$id === user.$id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  )}
                </button>
              ))}

              <div className="mt-2 border-t border-slate-100 pt-1.5 space-y-1">
                <button
                  id="btn-header-logout"
                  onClick={logout}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log Out (Appwrite)
                </button>
                <button
                  onClick={resetAllData}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset Demo State
                </button>
              </div>
            </div>
          </div>

          {/* Quick direct logout button */}
          <button
            id="btn-quick-logout"
            onClick={logout}
            title="Log Out (End Appwrite Session)"
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
