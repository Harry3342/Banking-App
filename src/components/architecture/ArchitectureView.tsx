import React, { useState } from "react";
import { useBanking } from "../../context/BankingContext";
import {
  Layers,
  GitBranch,
  Shield,
  ArrowRight,
  Database,
  Building,
  CreditCard,
  Send,
  Activity,
  CheckCircle2,
  Lock,
  FileCode,
  Sparkles,
  Zap,
  Globe,
  FileText,
  User,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Play,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { formatAmount } from "../../lib/utils";

export const ArchitectureView: React.FC = () => {
  const {
    setActiveTab,
    setIsPlaidModalOpen,
    setIsSentryDrawerOpen,
    logout,
    currentUser,
    bankAccounts,
  } = useBanking();

  const [activeTabMode, setActiveTabMode] = useState<"visual-ux" | "swimlane" | "tech-stack">(
    "visual-ux"
  );
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  // Non-developer friendly visual UX steps
  const visualUXSteps = [
    {
      step: 1,
      badge: "Step 1",
      title: "Log In or Sign Up",
      summary: "Start safely in seconds with demo profiles or custom signup.",
      icon: User,
      color: "from-blue-600 to-indigo-600",
      accentBg: "bg-blue-50 text-blue-700 border-blue-200",
      pillColor: "bg-blue-600 text-white",
      userAction: "You enter your email and password, or choose 1-Click Instant Demo access.",
      systemWork: "Your session is encrypted and tied to your private customer profile in the cloud.",
      outcome: "Instant entry into your secure dashboard with zero waiting.",
      actionLabel: "Test Sign Out & Sign In",
      actionHandler: () => logout(),
      previewMockup: (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <div className="h-6 w-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              H
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Horizon Sign-In</p>
              <p className="text-[10px] text-slate-400">Encrypted Appwrite Session</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-7 rounded-lg bg-slate-100 px-2.5 flex items-center text-[10px] text-slate-500 font-medium">
              harrynjoga@gmail.com
            </div>
            <div className="h-7 rounded-lg bg-slate-100 px-2.5 flex items-center text-[10px] text-slate-400">
              ••••••••••••
            </div>
          </div>
          <div className="h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
            Sign In to Bank &rarr;
          </div>
        </div>
      ),
    },
    {
      step: 2,
      badge: "Step 2",
      title: "Connect Real Bank Accounts",
      summary: "Link your favorite financial institutions without sharing passwords.",
      icon: Building,
      color: "from-emerald-600 to-teal-700",
      accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pillColor: "bg-emerald-600 text-white",
      userAction: "Select your bank (Chase, Bank of America, SVB, Wells Fargo, etc.) from Plaid.",
      systemWork: "Plaid securely authenticates with your bank and sends verified account balances.",
      outcome: "A digital bank card appears in your wallet with real-time balance tracking.",
      actionLabel: "Open Plaid Bank Linker",
      actionHandler: () => setIsPlaidModalOpen(true),
      previewMockup: (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Plaid Link Flow</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-emerald-500 bg-emerald-50/50 p-2 text-center">
              <Building className="h-4 w-4 text-emerald-600 mx-auto" />
              <p className="text-[10px] font-bold text-slate-800 mt-1">Chase Bank</p>
              <p className="text-[9px] text-emerald-700 font-semibold">Connected</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center opacity-70">
              <Building className="h-4 w-4 text-slate-400 mx-auto" />
              <p className="text-[10px] font-bold text-slate-800 mt-1">SVB Silicon</p>
              <p className="text-[9px] text-slate-500">Ready</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Checking •••• 4092</span>
            <span className="font-bold text-slate-800">$18,450.00</span>
          </div>
        </div>
      ),
    },
    {
      step: 3,
      badge: "Step 3",
      title: "View Consolidated Finances",
      summary: "See your total money, cards, and spending categories in one unified view.",
      icon: CreditCard,
      color: "from-slate-800 to-slate-950",
      accentBg: "bg-slate-100 text-slate-800 border-slate-300",
      pillColor: "bg-slate-900 text-white",
      userAction: "Browse digital cards, hide balances with one click for privacy, and review spending.",
      systemWork: "Aggregates balances from all your banks and calculates monthly financial health.",
      outcome: "Full clarity of your net liquidity without having to log into separate bank apps.",
      actionLabel: "Go to Main Dashboard",
      actionHandler: () => setActiveTab("dashboard"),
      previewMockup: (
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-400 font-mono">HORIZON PLATINUM</span>
            <span className="text-[10px] font-bold text-emerald-400">Active</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Total Liquid Balance</p>
            <p className="text-lg font-mono font-extrabold text-white">$27,690.45</p>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-300 pt-2 border-t border-slate-800">
            <span>•••• •••• •••• 4092</span>
            <span>09/28</span>
          </div>
        </div>
      ),
    },
    {
      step: 4,
      badge: "Step 4",
      title: "Send Money Securely",
      summary: "Transfer funds to any person or business via official ACH or Instant rails.",
      icon: Send,
      color: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-50 text-amber-800 border-amber-200",
      pillColor: "bg-amber-600 text-white",
      userAction: "Type recipient details, amount, and pick Standard (Free) or Instant Transfer.",
      systemWork: "Smart validation checks you have enough funds and verifies the 9-digit bank routing number.",
      outcome: "Dwolla processes the payment directly to the recipient's bank account.",
      actionLabel: "Open Transfer Funds Form",
      actionHandler: () => setActiveTab("transfer"),
      previewMockup: (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="text-[10px] font-bold text-slate-700">Dwolla ACH Payment</span>
            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
              Verified Rails
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Transfer Amount:</span>
              <span className="font-mono font-bold text-emerald-600">$150.00</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">To:</span>
              <span className="font-semibold text-slate-700">alex@company.com</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Routing Transit:</span>
              <span className="font-mono text-slate-600">021000021 (Chase)</span>
            </div>
          </div>
          <div className="h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
            Send Payment Now &rarr;
          </div>
        </div>
      ),
    },
    {
      step: 5,
      badge: "Step 5",
      title: "Receive Certified Proof",
      summary: "Get an official bank transaction receipt with a tracking number.",
      icon: FileText,
      color: "from-teal-600 to-cyan-700",
      accentBg: "bg-teal-50 text-teal-800 border-teal-200",
      pillColor: "bg-teal-600 text-white",
      userAction: "View or download your printable receipt, or export transaction history to CSV.",
      systemWork: "Creates a permanent record in your ledger with a unique Dwolla tracking ID.",
      outcome: "A certified receipt that proves your payment was processed successfully.",
      actionLabel: "View Transaction History",
      actionHandler: () => setActiveTab("history"),
      previewMockup: (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
              Payment Completed
            </span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <p className="text-sm font-mono font-bold text-slate-900">$150.00 USD</p>
          <div className="text-[9px] font-mono text-slate-400 space-y-0.5 pt-1 border-t border-slate-100">
            <p>Dwolla ID: dw_tx_901428</p>
            <p>ACH Status: Processed</p>
          </div>
        </div>
      ),
    },
    {
      step: 6,
      badge: "Step 6",
      title: "24/7 Security & Health",
      summary: "Enterprise monitoring keeps your account safe from errors in the background.",
      icon: Activity,
      color: "from-violet-600 to-purple-800",
      accentBg: "bg-violet-50 text-violet-800 border-violet-200",
      pillColor: "bg-violet-700 text-white",
      userAction: "Rest easy knowing every transaction is monitored for speed, security, and errors.",
      systemWork: "Sentry records system health spans (measured in milliseconds) and detects issues.",
      outcome: "Zero silent failures and full transparency on platform speed and safety.",
      actionLabel: "Open Sentry Monitor",
      actionHandler: () => setIsSentryDrawerOpen(true),
      previewMockup: (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1">
            <span className="text-[10px] font-bold text-slate-700">Sentry APM Status</span>
            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Healthy
            </span>
          </div>
          <div className="space-y-1 text-[9px] font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Plaid Sync:</span>
              <span className="text-emerald-600 font-bold">120ms</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Dwolla ACH:</span>
              <span className="text-emerald-600 font-bold">95ms</span>
            </div>
          </div>
          <p className="text-[9px] text-violet-700 bg-violet-50 p-1 rounded font-medium text-center">
            Active Session Replay Enabled
          </p>
        </div>
      ),
    },
  ];

  const currentStep = visualUXSteps[selectedStepIndex];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            How Horizon Bank Works
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            A clear visual guide explaining the user journey, financial rails, and technology behind the platform.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="inline-flex rounded-xl bg-slate-200/80 p-1">
          <button
            id="tab-btn-visual-ux"
            onClick={() => setActiveTabMode("visual-ux")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTabMode === "visual-ux"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Visual Journey (Easy)
          </button>
          <button
            id="tab-btn-swimlane"
            onClick={() => setActiveTabMode("swimlane")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTabMode === "swimlane"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            How Parties Connect
          </button>
          <button
            id="tab-btn-tech-stack"
            onClick={() => setActiveTabMode("tech-stack")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTabMode === "tech-stack"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tech Stack Directory
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE VISUAL STEPPER (NON-DEVELOPER FRIENDLY) */}
      {activeTabMode === "visual-ux" && (
        <div className="space-y-6">
          {/* Visual Step Progress Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Click any step to inspect the experience:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {visualUXSteps.map((step, idx) => {
                const Icon = step.icon;
                const isSelected = selectedStepIndex === idx;
                return (
                  <button
                    key={step.step}
                    onClick={() => setSelectedStepIndex(idx)}
                    className={`flex flex-col items-center justify-between rounded-xl p-3 border text-center transition cursor-pointer ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs"
                        : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs mb-2 transition ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {step.badge}
                    </span>
                    <span
                      className={`text-xs font-bold mt-0.5 line-clamp-1 ${
                        isSelected ? "text-emerald-800" : "text-slate-700"
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Spotlight on Selected Step */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Spotlight Banner */}
            <div className={`p-6 bg-gradient-to-r ${currentStep.color} text-white`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white font-bold shadow-inner">
                    {React.createElement(currentStep.icon, { className: "h-6 w-6" })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase">
                        {currentStep.badge} OF 6
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold tracking-tight mt-1">
                      {currentStep.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={selectedStepIndex === 0}
                    onClick={() => setSelectedStepIndex((prev) => Math.max(0, prev - 1))}
                    className="inline-flex items-center gap-1 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none px-3 py-2 text-xs font-bold transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                  </button>
                  <button
                    disabled={selectedStepIndex === visualUXSteps.length - 1}
                    onClick={() =>
                      setSelectedStepIndex((prev) => Math.min(visualUXSteps.length - 1, prev + 1))
                    }
                    className="inline-flex items-center gap-1 rounded-xl bg-white text-slate-900 hover:bg-white/90 disabled:opacity-30 disabled:pointer-events-none px-3 py-2 text-xs font-bold transition shadow-sm"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step Body: 3 Visual Pillars */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Pillar 1: What You Do */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold">
                      1
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      What You Do
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {currentStep.userAction}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-bold">
                      2
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      What Happens For You
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {currentStep.systemWork}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      The Outcome
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentStep.outcome}
                  </p>
                </div>
              </div>

              {/* Pillar 2: Visual Screen Mockup */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Screen Preview
                </span>
                <div className="w-full max-w-xs">{currentStep.previewMockup}</div>
                <span className="text-[10px] text-slate-400 mt-3 text-center">
                  Live in-app component representation
                </span>
              </div>

              {/* Pillar 3: Action & Direct Trigger */}
              <div className="flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Experience it right now:
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    Try {currentStep.title} in the Live App
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    You don't need to read manuals. Click below to jump straight into this feature and see it live.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={currentStep.actionHandler}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95 cursor-pointer"
                  >
                    <span>{currentStep.actionLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Sandbox mode enabled • 100% Safe test data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: VISUAL SWIMLANE (HOW PARTIES CONNECT) */}
      {activeTabMode === "swimlane" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Visual Lanes: Who Does What?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                A simple diagram showing how the user, external banks, and security systems work together seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Lane 1: You */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5 space-y-4">
                <div className="flex items-center gap-3 border-b border-blue-100 pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">You (The User)</h4>
                    <p className="text-[10px] text-slate-500">In your browser or phone</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="rounded-xl bg-white border border-blue-100 p-3 shadow-2xs">
                    <p className="font-bold text-blue-900">1. Sign In</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Access personal or business accounts securely.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-blue-100 p-3 shadow-2xs">
                    <p className="font-bold text-blue-900">2. Pick Your Bank</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Connect Chase, BofA, SVB, or Wells Fargo.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-blue-100 p-3 shadow-2xs">
                    <p className="font-bold text-blue-900">3. Tap 'Send Money'</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Enter who to pay and select Standard or Instant.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lane 2: The Financial Rails */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-4">
                <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Financial Rails</h4>
                    <p className="text-[10px] text-slate-500">Plaid & Dwolla Payment Engine</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="rounded-xl bg-white border border-emerald-100 p-3 shadow-2xs">
                    <p className="font-bold text-emerald-900">Plaid Link</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Verifies bank account ownership & downloads live balances.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-emerald-100 p-3 shadow-2xs">
                    <p className="font-bold text-emerald-900">Liquidity Safeguard</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Double-checks you have enough cash so you never get overdraft fees.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-emerald-100 p-3 shadow-2xs">
                    <p className="font-bold text-emerald-900">Dwolla ACH Clearing</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sends real money across official US banking rails.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lane 3: Security & Monitoring */}
              <div className="rounded-2xl border border-violet-200 bg-violet-50/30 p-5 space-y-4">
                <div className="flex items-center gap-3 border-b border-violet-100 pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-700 text-white shadow-xs">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Security & Sentry</h4>
                    <p className="text-[10px] text-slate-500">Appwrite & Real-Time Monitoring</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="rounded-xl bg-white border border-violet-100 p-3 shadow-2xs">
                    <p className="font-bold text-violet-900">Encrypted Storage</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Credentials and tokens stay encrypted in Appwrite BaaS.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-violet-100 p-3 shadow-2xs">
                    <p className="font-bold text-violet-900">Sentry 24/7 Watchdog</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tracks every payment in milliseconds and detects errors before you do.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-violet-100 p-3 shadow-2xs">
                    <p className="font-bold text-violet-900">Official Receipts</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Delivers certified receipts with irreversible tracking IDs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: TECH STACK DIRECTORY */}
      {activeTabMode === "tech-stack" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Next.js 14</h4>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Core Framework</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Provides App Router architecture, server-rendered layouts, and secure server actions so bank credentials are never exposed to browser memory.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <FileCode className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">TypeScript 5</h4>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Type Safety</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Guarantees zero unexpected monetary errors by strictly checking every bank account, balance amount, and transaction model before code runs.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Plaid Link</h4>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Bank Connectivity</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Connects to 12,000+ banks across North America to safely sync live balances without users ever sharing their bank password.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Dwolla</h4>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Payment Engine</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Processes official ACH money transfers, routing transit numbers, and real-time funding sources with full trace receipts.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Appwrite BaaS</h4>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">User Identity</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Manages customer accounts, encrypted login sessions, KYC addresses, and multi-profile switching between personal and business.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-700 text-white flex items-center justify-center font-bold">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Sentry</h4>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">APM & Monitoring</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Monitors platform performance in milliseconds, logs every action as an audit breadcrumb, and alerts engineers to prevent downtime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
