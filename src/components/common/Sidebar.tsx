import React from "react";
import { useBanking } from "../../context/BankingContext";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Send,
  Activity,
  Shield,
  Layers,
  ExternalLink,
  Lock,
  LogOut,
  GitBranch,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, bankAccounts, transactions, sentryEvents, logout } =
    useBanking();

  const navItems = [
    {
      id: "dashboard" as const,
      label: "Home",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "banks" as const,
      label: "My Banks",
      icon: CreditCard,
      badge: bankAccounts.length.toString(),
    },
    {
      id: "history" as const,
      label: "Transaction History",
      icon: ArrowLeftRight,
      badge: transactions.length.toString(),
    },
    {
      id: "transfer" as const,
      label: "Transfer Funds",
      icon: Send,
      badge: "Dwolla",
    },
    {
      id: "sentry" as const,
      label: "Sentry Monitoring",
      icon: Activity,
      badge: sentryEvents.filter((e) => e.level === "error").length > 0 ? "Alert" : "Healthy",
      badgeColor:
        sentryEvents.filter((e) => e.level === "error").length > 0
          ? "bg-rose-100 text-rose-700"
          : "bg-emerald-100 text-emerald-700",
    },
    {
      id: "architecture" as const,
      label: "Tech Stack & UX",
      icon: GitBranch,
      badge: "Docs",
      badgeColor: "bg-indigo-100 text-indigo-700",
    },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* Brand / Title */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
              Horizon Bank
            </h1>
            <p className="text-[11px] font-medium text-slate-500">
              Next.js 14 App Router Stack
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-emerald-500 text-white"
                        : item.badgeColor || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tech Stack Indicator */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Stack Architecture
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium text-slate-600">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
              <span>Next.js 14 SSR</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span>Appwrite Auth</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>Plaid Link API</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Dwolla ACH</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              <span>Sentry Logs</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              <span>Tailwind & Shadcn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom User Card */}
      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs uppercase">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate font-mono">
                {currentUser.dwollaCustomerId.slice(0, 16)}...
              </p>
            </div>
          </div>
          <div title="Secured by Appwrite BaaS" className="text-slate-400">
            <Lock className="h-3.5 w-3.5" />
          </div>
        </div>

        <button
          id="btn-sidebar-logout"
          onClick={logout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition active:scale-95"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Log Out (Appwrite)</span>
        </button>
      </div>
    </aside>
  );
};
