import React, { useState } from "react";
import { useBanking } from "../../context/BankingContext";
import { BankCard } from "../banks/BankCard";
import { TransactionReceiptModal } from "../common/TransactionReceiptModal";
import { formatAmount, formatDate, getCategoryBadge } from "../../lib/utils";
import { Transaction } from "../../types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Plus,
  Send,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Building,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export const DashboardOverview: React.FC = () => {
  const {
    currentUser,
    bankAccounts,
    transactions,
    selectedAccountId,
    setSelectedAccountId,
    setIsPlaidModalOpen,
    setActiveTab,
    hideBalances,
  } = useBanking();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  // Compute total available & current balance
  const totalAvailable = bankAccounts.reduce((sum, b) => sum + b.availableBalance, 0);
  const totalCurrent = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);

  // Filter transactions based on active bank selector and search
  const filteredTransactions = transactions.filter((tx) => {
    const matchesAccount = selectedAccountId === "all" || tx.accountId === selectedAccountId;
    const matchesSearch =
      tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.dwollaTransferId && tx.dwollaTransferId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAccount && matchesSearch;
  });

  // Calculate category spending for Recharts donut chart
  const categorySpending = transactions
    .filter((tx) => tx.type === "debit")
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(categorySpending).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Summary KPIs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
            <span>Appwrite Authenticated</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="capitalize">{currentUser.role} Account</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="text-xs text-slate-300 max-w-lg">
            Manage your connected Plaid bank accounts, process real-time Dwolla transfers, and review your financial ledger.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("transfer")}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span>Transfer Funds</span>
          </button>
          <button
            onClick={() => setIsPlaidModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Link Bank</span>
          </button>
        </div>
      </div>

      {/* KPI Cards & Spending Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1: Total Balance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Available Balance</span>
              <Building className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 font-mono text-3xl font-extrabold tracking-tight text-slate-900">
              {hideBalances ? "••••••••" : formatAmount(totalAvailable)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Current ledger: {hideBalances ? "••••••••" : formatAmount(totalCurrent)}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{bankAccounts.length} Connected Institutions</span>
            <button
              onClick={() => setActiveTab("banks")}
              className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* KPI 2: Category Spending Donut Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Outflow Category Breakdown
              </h3>
              <p className="text-xs text-slate-500">Expenditure across all connected accounts</p>
            </div>
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
              {chartData.length} Active Categories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
            <div className="sm:col-span-5 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`$${Number(val).toFixed(2)}`, "Spent"]}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "11px",
                      border: "none",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="sm:col-span-7 grid grid-cols-2 gap-2 text-xs">
              {chartData.slice(0, 6).map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <div className="truncate">
                    <p className="truncate text-slate-600 font-medium text-[11px]">{item.name}</p>
                    <p className="font-mono font-bold text-slate-900 text-xs">
                      {hideBalances ? "••••" : formatAmount(item.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Cards Carousel / Highlights */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Connected Bank Accounts
          </h2>
          <button
            onClick={() => setActiveTab("banks")}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Manage Banks ({bankAccounts.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bankAccounts.slice(0, 2).map((acc) => (
            <BankCard key={acc.id} account={acc} showDetails={false} />
          ))}

          {/* Quick Plaid Add Card */}
          <button
            onClick={() => setIsPlaidModalOpen(true)}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-6 text-slate-500 transition hover:border-emerald-500 hover:bg-emerald-50/30 hover:text-emerald-700 group min-h-[220px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                Connect New Bank Account
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Via Plaid Link 256-bit encrypted authentication
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Recent Transactions
            </h2>
            <p className="text-xs text-slate-500">
              Showing recent Dwolla ACH transfers, point-of-sale, and Plaid synced transactions
            </p>
          </div>

          {/* Search Input & View All */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setActiveTab("history")}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>Full Ledger</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Transaction</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Channel</th>
                <th className="pb-3 font-semibold">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.slice(0, 6).map((tx) => {
                const isCredit = tx.type === "credit";
                const catBadge = getCategoryBadge(tx.category);
                return (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedReceiptTx(tx)}
                    className="cursor-pointer hover:bg-slate-50/80 transition group"
                  >
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isCredit ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition">
                            {tx.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {tx.dwollaTransferId ? `Dwolla: ${tx.dwollaTransferId}` : tx.senderBank}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 font-mono font-bold">
                      <span className={isCredit ? "text-emerald-600" : "text-slate-900"}>
                        {isCredit ? "+" : "-"}
                        {hideBalances ? "••••••" : formatAmount(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {tx.status}
                      </span>
                    </td>

                    <td className="py-3 text-slate-500 font-medium">
                      {formatDate(tx.date)}
                    </td>

                    <td className="py-3 text-slate-500 capitalize">
                      {tx.channel}
                    </td>

                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${catBadge.bg} ${catBadge.text}`}>
                        {tx.category}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      <TransactionReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
      />
    </div>
  );
};
