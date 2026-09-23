import React, { useState } from "react";
import { BankAccount } from "../../types";
import { formatAmount } from "../../lib/utils";
import { useBanking } from "../../context/BankingContext";
import { Copy, Check, Eye, EyeOff, Radio, ShieldCheck, Wifi } from "lucide-react";

interface BankCardProps {
  account: BankAccount;
  showDetails?: boolean;
}

export const BankCard: React.FC<BankCardProps> = ({ account, showDetails = true }) => {
  const { hideBalances } = useBanking();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showFullNumber, setShowFullNumber] = useState(false);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getGradient = (color: BankAccount["cardColor"]) => {
    switch (color) {
      case "emerald":
        return "from-emerald-700 via-teal-800 to-slate-900 text-white";
      case "blue":
        return "from-blue-700 via-indigo-900 to-slate-950 text-white";
      case "purple":
        return "from-purple-800 via-violet-950 to-slate-950 text-white";
      case "amber":
        return "from-amber-600 via-amber-800 to-stone-900 text-white";
      case "slate":
      default:
        return "from-slate-800 via-zinc-900 to-black text-white";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Visual Card */}
      <div
        className={`relative aspect-[1.586/1] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-tr p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${getGradient(
          account.cardColor
        )}`}
      >
        {/* Abstract background decorative overlay */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/5 blur-xl" />

        {/* Card Header: Institution & Contactless */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
              {account.institutionName}
            </p>
            <h3 className="text-base font-bold tracking-tight text-white">{account.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-white/80 rotate-90" />
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              {account.type}
            </span>
          </div>
        </div>

        {/* Microchip Graphic & Contactless */}
        <div className="relative z-10 mt-4 flex items-center gap-3">
          <div className="h-7 w-10 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 shadow-inner">
            <div className="h-full w-full rounded border border-amber-800/40 opacity-70" />
          </div>
          <ShieldCheck className="h-4 w-4 text-emerald-300/80" />
        </div>

        {/* Card Number & Balance */}
        <div className="relative z-10 mt-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-base font-semibold tracking-widest text-white sm:text-lg">
              {showFullNumber
                ? account.accountNumber.replace(/(\d{4})/g, "$1 ").trim()
                : `•••• •••• •••• ${account.mask}`}
            </p>
            <button
              onClick={() => setShowFullNumber((prev) => !prev)}
              className="p-1 text-white/60 hover:text-white transition"
              title={showFullNumber ? "Mask Number" : "Show Number"}
            >
              {showFullNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">
                Cardholder
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                {account.cardHolder}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">Expires</p>
              <p className="font-mono text-xs font-semibold text-white">{account.cardExpiry}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-white/60">
                Available Balance
              </p>
              <p className="font-mono text-sm font-bold text-emerald-300">
                {hideBalances ? "••••••" : formatAmount(account.availableBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Details & Copy Buttons */}
      {showDetails && (
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Routing Number (ACH):</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-medium text-slate-800">{account.routingNumber}</span>
              <button
                onClick={() => copyToClipboard(account.routingNumber, `routing_${account.id}`)}
                className="text-slate-400 hover:text-slate-700 transition"
                title="Copy routing number"
              >
                {copiedField === `routing_${account.id}` ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Account Number:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-medium text-slate-800">
                •••• {account.mask}
              </span>
              <button
                onClick={() => copyToClipboard(account.accountNumber, `account_${account.id}`)}
                className="text-slate-400 hover:text-slate-700 transition"
                title="Copy full account number"
              >
                {copiedField === `account_${account.id}` ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-medium">Plaid Secure ID:</span>
            <span className="font-mono text-[11px] text-slate-500 truncate max-w-[150px]">
              {account.shareableId}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
