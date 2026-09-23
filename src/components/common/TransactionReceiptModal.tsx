import React, { useState } from "react";
import { Transaction } from "../../types";
import { formatAmount, formatDateTime, getCategoryBadge } from "../../lib/utils";
import {
  X,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  Building,
} from "lucide-react";

interface TransactionReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const isCredit = transaction.type === "credit";
  const badge = getCategoryBadge(transaction.category);

  const handleCopyId = () => {
    if (transaction.dwollaTransferId) {
      navigator.clipboard.writeText(transaction.dwollaTransferId);
    } else {
      navigator.clipboard.writeText(transaction.id);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
              ACH
            </div>
            <h3 className="text-sm font-bold text-slate-900">Transaction Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="p-6 text-center border-b border-slate-100">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            {isCredit ? (
              <ArrowDownLeft className="h-6 w-6 text-emerald-600" />
            ) : (
              <ArrowUpRight className="h-6 w-6 text-slate-700" />
            )}
          </div>
          <p
            className={`font-mono text-3xl font-extrabold tracking-tight ${
              isCredit ? "text-emerald-600" : "text-slate-900"
            }`}
          >
            {isCredit ? "+" : "-"}
            {formatAmount(transaction.amount)}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-800">{transaction.name}</p>

          <div className="mt-2 flex items-center justify-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.text}`}>
              {transaction.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              {transaction.status}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="p-6 space-y-3 text-xs">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500 font-medium">Timestamp</span>
            <span className="font-mono text-slate-800 font-medium">{formatDateTime(transaction.date)}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Channel</span>
            <span className="text-slate-800 font-medium capitalize">{transaction.channel}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Origin Account</span>
            <span className="text-slate-800 font-medium">{transaction.senderBank}</span>
          </div>

          {transaction.receiverBank && (
            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Destination</span>
              <span className="text-slate-800 font-medium">{transaction.receiverBank}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-1 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Dwolla Reference</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-slate-800 font-medium">
                {transaction.dwollaTransferId || transaction.id}
              </span>
              <button
                onClick={handleCopyId}
                className="text-slate-400 hover:text-slate-700 transition"
                title="Copy reference ID"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {transaction.note && (
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 mt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Memo</span>
              <p className="text-slate-700 italic">{transaction.note}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Settled via Dwolla ACH Gateway</span>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
