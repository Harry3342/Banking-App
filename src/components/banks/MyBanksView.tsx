import React from "react";
import { useBanking } from "../../context/BankingContext";
import { BankCard } from "./BankCard";
import { Plus, ShieldCheck, ArrowRight, Building, CheckCircle2, Lock } from "lucide-react";
import { formatAmount } from "../../lib/utils";

export const MyBanksView: React.FC = () => {
  const { bankAccounts, setIsPlaidModalOpen, setActiveTab, currentUser, hideBalances } =
    useBanking();

  const totalBalance = bankAccounts.reduce((sum, b) => sum + b.availableBalance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Connected Bank Accounts
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time balance synchronization powered by Plaid Link and verified Dwolla funding sources.
          </p>
        </div>

        <button
          onClick={() => setIsPlaidModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Connect Bank with Plaid</span>
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Combined Liquidity
          </span>
          <p className="font-mono text-2xl font-extrabold text-slate-900 mt-1">
            {hideBalances ? "••••••••" : formatAmount(totalBalance)}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Across {bankAccounts.length} institutions
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Dwolla Payment Gateway
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-800">Verified Customer</span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-1 truncate">
            ID: {currentUser.dwollaCustomerId}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Security & Encryption
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Lock className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-800">AES-256 GCM</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">
            Tokens stored in Appwrite BaaS
          </span>
        </div>
      </div>

      {/* Grid of Bank Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bankAccounts.map((account) => (
          <div
            key={account.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
          >
            <BankCard account={account} showDetails={true} />

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-3 w-3" />
                Dwolla Ready
              </span>
              <button
                onClick={() => setActiveTab("transfer")}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 transition"
              >
                <span>Send Money</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Connect New Bank Card */}
        <button
          onClick={() => setIsPlaidModalOpen(true)}
          className="flex min-h-[350px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-slate-500 transition hover:border-emerald-500 hover:bg-emerald-50/30 hover:text-emerald-700 group"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200 group-hover:scale-105 group-hover:border-emerald-300 group-hover:text-emerald-600 transition">
            <Plus className="h-7 w-7 text-slate-400 group-hover:text-emerald-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">
              Link another financial institution
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Supports Chase, Bank of America, Wells Fargo, SVB, Citibank, and 12,000+ banks via Plaid Link.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
