import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBanking } from "../../context/BankingContext";
import { formatAmount } from "../../lib/utils";
import { TransferFormValues } from "../../types";
import {
  Send,
  Building2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Zap,
  Clock,
  ArrowRight,
  Info,
  DollarSign,
  Receipt,
  RotateCcw,
} from "lucide-react";

// Advanced Zod schema definition for Dwolla money transfer validation
const transferSchema = z.object({
  sourceBankId: z.string().min(1, "Please select a funding source account"),
  recipientEmail: z
    .string()
    .min(1, "Recipient email is required")
    .email("Enter a valid email address (e.g., recipient@bank.com)"),
  recipientName: z
    .string()
    .min(2, "Recipient full name must be at least 2 characters")
    .max(50, "Recipient name is too long"),
  recipientAccountNumber: z
    .string()
    .regex(/^\d{8,17}$/, "Account number must be between 8 and 17 numeric digits"),
  routingNumber: z
    .string()
    .regex(/^\d{9}$/, "ACH routing transit number must be exactly 9 digits"),
  amount: z
    .number({ message: "Please enter a valid transfer amount" })
    .positive("Transfer amount must be greater than $0.00")
    .max(50000, "Maximum ACH single transfer limit is $50,000.00"),
  note: z
    .string()
    .min(2, "Please include a brief note or memo")
    .max(100, "Memo note cannot exceed 100 characters"),
  transferSpeed: z.enum(["standard", "instant"]),
});

type TransferSchemaType = z.infer<typeof transferSchema>;

export const TransferFundsForm: React.FC = () => {
  const { bankAccounts, executeDwollaTransfer, currentUser, hideBalances, setActiveTab } =
    useBanking();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    transferId: string;
    details?: TransferSchemaType;
    error?: string;
  } | null>(null);

  const defaultSourceId = bankAccounts[0]?.id || "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransferSchemaType>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceBankId: defaultSourceId,
      recipientEmail: "",
      recipientName: "",
      recipientAccountNumber: "",
      routingNumber: "021000021",
      amount: 150.0,
      note: "Consulting and development invoice",
      transferSpeed: "standard",
    },
    mode: "onBlur",
  });

  const selectedSourceBankId = watch("sourceBankId");
  const watchAmount = watch("amount") || 0;
  const watchSpeed = watch("transferSpeed");

  const selectedAccount = bankAccounts.find((b) => b.id === selectedSourceBankId) || bankAccounts[0];
  const fee = watchSpeed === "instant" ? 1.5 : 0.0;
  const totalDeduction = Number(watchAmount) + fee;
  const isInsufficient = selectedAccount && watchAmount > selectedAccount.availableBalance;

  const onTransferSubmit = async (data: TransferSchemaType) => {
    if (selectedAccount && data.amount > selectedAccount.availableBalance) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await executeDwollaTransfer({
        sourceBankId: data.sourceBankId,
        recipientEmail: data.recipientEmail,
        recipientName: data.recipientName,
        recipientAccountNumber: data.recipientAccountNumber,
        routingNumber: data.routingNumber,
        amount: Number(data.amount),
        note: data.note,
        transferSpeed: data.transferSpeed,
      });

      if (res.success) {
        setSubmissionResult({
          success: true,
          transferId: res.transferId,
          details: data,
        });
      } else {
        setSubmissionResult({
          success: false,
          transferId: "",
          error: res.error || "Payment processing failed.",
        });
      }
    } catch (e: any) {
      setSubmissionResult({
        success: false,
        transferId: "",
        error: e.message || "An unexpected error occurred during Dwolla ACH transfer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartAnother = () => {
    setSubmissionResult(null);
    reset({
      sourceBankId: defaultSourceId,
      recipientEmail: "",
      recipientName: "",
      recipientAccountNumber: "",
      routingNumber: "021000021",
      amount: 50.0,
      note: "",
      transferSpeed: "standard",
    });
  };

  // If transfer succeeded, render modern Dwolla receipt
  if (submissionResult?.success && submissionResult.details) {
    const details = submissionResult.details;
    return (
      <div className="mx-auto max-w-2xl py-6 animate-in fade-in duration-300">
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-xl">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-6 text-white text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Dwolla Money Transfer Initiated!</h2>
            <p className="text-xs text-emerald-100 mt-1">
              Your ACH payment transaction has been created and logged in the Appwrite ledger.
            </p>
          </div>

          {/* Receipt Body */}
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-5">
              <span className="text-xs uppercase tracking-wider text-slate-400">Total Transferred</span>
              <p className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
                {formatAmount(details.amount)}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Dwolla Cleared • Processing</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
                <span className="text-slate-400 uppercase font-medium text-[10px]">Source Account</span>
                <p className="font-semibold text-slate-800">{selectedAccount?.name}</p>
                <p className="font-mono text-slate-500 text-[11px]">•••• {selectedAccount?.mask}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
                <span className="text-slate-400 uppercase font-medium text-[10px]">Recipient</span>
                <p className="font-semibold text-slate-800">{details.recipientName}</p>
                <p className="text-slate-500 text-[11px] truncate">{details.recipientEmail}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
                <span className="text-slate-400 uppercase font-medium text-[10px]">Dwolla Transfer ID</span>
                <p className="font-mono font-semibold text-slate-800 text-[11px]">{submissionResult.transferId}</p>
                <p className="text-slate-400 text-[10px]">ACH Trace Reference</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
                <span className="text-slate-400 uppercase font-medium text-[10px]">Transfer Speed</span>
                <p className="font-semibold text-slate-800 capitalize">
                  {details.transferSpeed === "instant" ? "Real-Time Instant ACH" : "Standard ACH (1-2 Days)"}
                </p>
                <p className="text-slate-500 text-[10px]">Processing fee: {details.transferSpeed === "instant" ? "$1.50" : "$0.00"}</p>
              </div>
            </div>

            {details.note && (
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-400 uppercase font-medium text-[10px] block mb-1">Transfer Note</span>
                <p className="text-xs text-slate-700 italic">"{details.note}"</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleStartAnother}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <RotateCcw className="h-4 w-4" />
                Make Another Transfer
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition"
              >
                <Receipt className="h-4 w-4" />
                View in Transaction History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-2 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Payment Transfer
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Send funds securely to any external bank account via Dwolla ACH payment processing. Validated in real-time with React Hook Form & Zod schema.
        </p>
      </div>

      {submissionResult?.error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <p>{submissionResult.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Form (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form id="dwolla-transfer-form" onSubmit={handleSubmit(onTransferSubmit)} className="space-y-5">
            {/* Source Bank Account Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Funding Source Account
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bankAccounts.map((acc) => {
                  const isSelected = selectedSourceBankId === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setValue("sourceBankId", acc.id, { shouldValidate: true })}
                      className={`flex flex-col text-left rounded-xl border p-3 transition ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{acc.institutionName}</span>
                        <span className="text-[10px] font-mono text-slate-500">•••• {acc.mask}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5">{acc.name}</span>
                      <span className="text-xs font-mono font-bold text-emerald-700 mt-2">
                        {hideBalances ? "••••••" : formatAmount(acc.availableBalance)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.sourceBankId && (
                <p className="mt-1.5 text-[11px] text-rose-600 font-medium">{errors.sourceBankId.message}</p>
              )}
            </div>

            {/* Recipient Details */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recipient Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    {...register("recipientName")}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  {errors.recipientName && (
                    <p className="mt-1 text-[11px] text-rose-600">{errors.recipientName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="sarah.jenkins@example.com"
                    {...register("recipientEmail")}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  {errors.recipientEmail && (
                    <p className="mt-1 text-[11px] text-rose-600">{errors.recipientEmail.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ACH Routing Number (9 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="021000021"
                    {...register("routingNumber")}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  {errors.routingNumber && (
                    <p className="mt-1 text-[11px] text-rose-600">{errors.routingNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    {...register("recipientAccountNumber")}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  {errors.recipientAccountNumber && (
                    <p className="mt-1 text-[11px] text-rose-600">
                      {errors.recipientAccountNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Amount & Speed */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Transfer Amount & Speed
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount ($ USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="100.00"
                      {...register("amount", { valueAsNumber: true })}
                      className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-1 ${
                        isInsufficient
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/30"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-[11px] text-rose-600">{errors.amount.message}</p>
                  )}
                  {isInsufficient && selectedAccount && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600">
                      Amount exceeds available balance ({formatAmount(selectedAccount.availableBalance)})
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Transfer Speed
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setValue("transferSpeed", "standard", { shouldValidate: true })}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition ${
                        watchSpeed === "standard"
                          ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Clock className="h-4 w-4 mb-1 text-slate-500" />
                      <span className="text-xs font-bold">Standard ACH</span>
                      <span className="text-[10px] text-slate-400">1-2 Days • Free</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue("transferSpeed", "instant", { shouldValidate: true })}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition ${
                        watchSpeed === "instant"
                          ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Zap className="h-4 w-4 mb-1 text-amber-500" />
                      <span className="text-xs font-bold">Dwolla Real-Time</span>
                      <span className="text-[10px] text-slate-400">Instant • $1.50 fee</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transfer Note / Memo
                </label>
                <input
                  type="text"
                  placeholder="e.g. Office rent share, freelance invoice"
                  {...register("note")}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.note && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.note.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-slate-100 pt-4">
              <button
                id="btn-submit-transfer"
                type="submit"
                disabled={isSubmitting || isInsufficient}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing with Dwolla Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send {formatAmount(Number(watchAmount) || 0)} Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Summary Card (1 col) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Transfer Breakdown
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Principal Amount</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatAmount(Number(watchAmount) || 0)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Dwolla Network Fee</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatAmount(fee)}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900">
                <span>Total Outflow</span>
                <span className="font-mono text-emerald-700 text-sm">
                  {formatAmount(totalDeduction)}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Dwolla Security Assurance</span>
              </div>
              <p>
                Transfers are processed under Dwolla customer ID{" "}
                <code className="text-slate-800 font-mono text-[10px]">
                  {currentUser.dwollaCustomerId.slice(0, 15)}...
                </code>{" "}
                with NACHA compliance and end-to-end telemetry.
              </p>
            </div>

            {selectedAccount && (
              <div className="rounded-xl border border-slate-200/80 p-3 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Remaining Balance After Transfer</span>
                <p className="font-mono font-bold text-slate-800">
                  {formatAmount(Math.max(0, selectedAccount.availableBalance - totalDeduction))}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-950">
              <Info className="h-4 w-4 text-blue-600" />
              <span>Real-Time Zod Validation Active</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Form inputs utilize strict regex validations: 9-digit ACH routing number, 8-17 digit account number, and live liquidity check against your Plaid balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
