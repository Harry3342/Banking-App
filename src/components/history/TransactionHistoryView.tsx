import React, { useState } from "react";
import { useBanking } from "../../context/BankingContext";
import { TransactionReceiptModal } from "../common/TransactionReceiptModal";
import { formatAmount, formatDate, getCategoryBadge } from "../../lib/utils";
import { Transaction, TransactionCategory } from "../../types";
import {
  Search,
  Filter,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Building,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

export const TransactionHistoryView: React.FC = () => {
  const {
    transactions,
    bankAccounts,
    selectedAccountId,
    setSelectedAccountId,
    hideBalances,
  } = useBanking();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "credit" | "debit">("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_desc");
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesAccount = selectedAccountId === "all" || tx.accountId === selectedAccountId;
    const matchesCategory = selectedCategory === "all" || tx.category === selectedCategory;
    const matchesType = selectedType === "all" || tx.type === selectedType;
    const matchesSearch =
      tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.senderBank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.receiverBank && tx.receiverBank.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.dwollaTransferId && tx.dwollaTransferId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesAccount && matchesCategory && matchesType && matchesSearch;
  });

  // Sort transactions
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "date_desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === "amount_desc") return b.amount - a.amount;
    if (sortBy === "amount_asc") return a.amount - b.amount;
    return 0;
  });

  // Ledger stats
  const totalInflow = sorted
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOutflow = sorted
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const categories: TransactionCategory[] = [
    "Food and Dining",
    "Travel & Transport",
    "Payment / Transfer",
    "Salary & Income",
    "Software & Services",
    "Entertainment",
    "Utilities",
  ];

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Type", "Amount", "Category", "Date", "Status", "Channel", "Dwolla Ref"];
    const rows = sorted.map((t) => [
      t.id,
      `"${t.name.replace(/"/g, '""')}"`,
      t.type,
      t.amount.toFixed(2),
      `"${t.category}"`,
      t.date,
      t.status,
      t.channel,
      t.dwollaTransferId || "",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `horizon_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Transaction History
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ledger of Plaid synchronized transactions and Dwolla ACH payment records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Inflows (Deposits)
          </span>
          <p className="font-mono text-2xl font-extrabold text-emerald-600 mt-1">
            +{hideBalances ? "••••••••" : formatAmount(totalInflow)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">
            {sorted.filter((t) => t.type === "credit").length} credit transactions
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Outflows (Debits / Transfers)
          </span>
          <p className="font-mono text-2xl font-extrabold text-slate-900 mt-1">
            -{hideBalances ? "••••••••" : formatAmount(totalOutflow)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">
            {sorted.filter((t) => t.type === "debit").length} debit transactions
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Net Cash Flow
          </span>
          <p
            className={`font-mono text-2xl font-extrabold mt-1 ${
              totalInflow - totalOutflow >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {totalInflow - totalOutflow >= 0 ? "+" : ""}
            {hideBalances ? "••••••••" : formatAmount(totalInflow - totalOutflow)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">
            {sorted.length} total filtered items
          </span>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        {/* Account Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
          <button
            onClick={() => setSelectedAccountId("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedAccountId === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Accounts ({transactions.length})
          </button>
          {bankAccounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedAccountId === acc.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {acc.institutionName} •••• {acc.mask}
            </button>
          ))}
        </div>

        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search memo, merchant, Dwolla ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Types (Debits & Credits)</option>
            <option value="credit">Inflow / Credits only</option>
            <option value="debit">Outflow / Debits only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-semibold">Transaction Details</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Channel</th>
                <th className="py-3 px-4 font-semibold">Dwolla Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                sorted.map((tx) => {
                  const isCredit = tx.type === "credit";
                  const catBadge = getCategoryBadge(tx.category);
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedReceiptTx(tx)}
                      className="cursor-pointer hover:bg-slate-50 transition group"
                    >
                      <td className="py-3.5 px-4">
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
                            <p className="text-[10px] text-slate-400">
                              {tx.senderBank} {tx.receiverBank ? `→ ${tx.receiverBank}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={isCredit ? "text-emerald-600" : "text-slate-900"}>
                          {isCredit ? "+" : "-"}
                          {hideBalances ? "••••••" : formatAmount(tx.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {formatDate(tx.date)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${catBadge.bg} ${catBadge.text}`}>
                          {tx.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 capitalize">
                        {tx.channel}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {tx.dwollaTransferId || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      <TransactionReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
      />
    </div>
  );
};
