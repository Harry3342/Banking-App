import React, { useState } from "react";
import { useBanking } from "../../context/BankingContext";
import { PLAID_INSTITUTIONS } from "../../data/mockData";
import { PlaidInstitution, BankAccount } from "../../types";
import {
  ShieldCheck,
  X,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Building,
  AlertCircle,
  Loader2,
} from "lucide-react";

export const PlaidLinkModal: React.FC = () => {
  const { isPlaidModalOpen, setIsPlaidModalOpen, connectPlaidAccount, currentUser } =
    useBanking();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInst, setSelectedInst] = useState<PlaidInstitution | null>(null);
  const [step, setStep] = useState<"select_bank" | "credentials" | "select_account" | "exchanging" | "success">("select_bank");
  const [username, setUsername] = useState("user_good");
  const [password, setPassword] = useState("pass_good");
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number>(0);
  const [cardColor, setCardColor] = useState<BankAccount["cardColor"]>("emerald");
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBank, setCreatedBank] = useState<BankAccount | null>(null);

  if (!isPlaidModalOpen) return null;

  const handleClose = () => {
    setIsPlaidModalOpen(false);
    // Reset state after close
    setTimeout(() => {
      setStep("select_bank");
      setSelectedInst(null);
      setSelectedAccountIndex(0);
      setCreatedBank(null);
    }, 300);
  };

  const filteredInstitutions = PLAID_INSTITUTIONS.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectInstitution = (inst: PlaidInstitution) => {
    setSelectedInst(inst);
    setStep("credentials");
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("select_account");
    }, 700);
  };

  const handleConfirmAccount = async () => {
    if (!selectedInst) return;
    const accountOption = selectedInst.sampleAccounts[selectedAccountIndex];
    setStep("exchanging");
    setIsProcessing(true);

    try {
      // Simulate Plaid public token exchange + Dwolla funding source verification
      await new Promise((r) => setTimeout(r, 1200));
      const newAccount = await connectPlaidAccount(selectedInst, accountOption, cardColor);
      setCreatedBank(newAccount);
      setIsProcessing(false);
      setStep("success");
    } catch (err) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Plaid Branded Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white font-bold text-xs tracking-tighter">
              plaid
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Plaid Link
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>256-bit encrypted connection</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body Based on Step */}
        <div className="p-6">
          {step === "select_bank" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Select your institution
                </h3>
                <p className="text-xs text-slate-500">
                  Connect your checking or savings account directly to Horizon Bank.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Chase, BofA, Wells Fargo, SVB..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Institution Grid */}
              <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                {filteredInstitutions.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => handleSelectInstitution(inst)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:border-emerald-300 hover:bg-emerald-50/40 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl shadow-xs group-hover:scale-105 transition">
                        {inst.logo}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                          {inst.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {inst.sampleAccounts.length} account types available
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "credentials" && selectedInst && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-2xl">{selectedInst.logo}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedInst.name}</h4>
                  <p className="text-[11px] text-slate-500">Plaid Sandbox Sandbox Environment</p>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50/80 p-3 border border-blue-200 text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-blue-950">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Plaid Test Credentials Pre-Filled</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Use standard test login credentials below or modify them to simulate Plaid authentication.
                </p>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Online Banking ID</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("select_bank")}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800"
                  >
                    Back to Banks
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Credentials</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "select_account" && selectedInst && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Select accounts to link
                </h3>
                <p className="text-xs text-slate-500">
                  Choose which {selectedInst.name} account to sync with Appwrite and Dwolla.
                </p>
              </div>

              <div className="space-y-2">
                {selectedInst.sampleAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAccountIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 transition text-left ${
                      selectedAccountIndex === idx
                        ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{acc.name}</p>
                      <p className="text-xs text-slate-500">
                        •••• {acc.mask} • <span className="capitalize">{acc.type}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold font-mono text-slate-900">
                        ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      {selectedAccountIndex === idx && (
                        <span className="text-[11px] font-semibold text-emerald-700">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Card Color Theme Picker */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700">Digital Card Theme</label>
                <div className="mt-1.5 flex gap-2">
                  {(["emerald", "blue", "purple", "amber", "slate"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCardColor(c)}
                      className={`h-7 w-7 rounded-full border-2 transition ${
                        c === "emerald"
                          ? "bg-emerald-600"
                          : c === "blue"
                          ? "bg-blue-600"
                          : c === "purple"
                          ? "bg-purple-600"
                          : c === "amber"
                          ? "bg-amber-600"
                          : "bg-slate-800"
                      } ${cardColor === c ? "border-slate-900 ring-2 ring-offset-2 ring-slate-400" : "border-transparent"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmAccount}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Authorize & Link Account
                </button>
              </div>
            </div>
          )}

          {step === "exchanging" && (
            <div className="py-10 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Securing Plaid Access Token
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Exchanging <code className="text-slate-800">public_token</code> with server action, generating Dwolla processor token, and persisting record to Appwrite database...
                </p>
              </div>
            </div>
          )}

          {step === "success" && createdBank && (
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Bank Account Successfully Connected!
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {createdBank.name} (•••• {createdBank.mask}) is now ready for ACH money transfers via Dwolla and real-time transaction synchronization.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-left text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shareable ID:</span>
                  <span className="text-slate-700 font-semibold">{createdBank.shareableId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Balance:</span>
                  <span className="text-emerald-700 font-bold">${createdBank.availableBalance.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-2.5 text-center text-[11px] text-slate-400">
          Powered by Plaid OAuth 2.0 API & Dwolla ACH Processing Integration
        </div>
      </div>
    </div>
  );
};
