/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BankingProvider, useBanking } from "./context/BankingContext";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { MobileNav } from "./components/common/MobileNav";
import { DashboardOverview } from "./components/dashboard/DashboardOverview";
import { MyBanksView } from "./components/banks/MyBanksView";
import { TransactionHistoryView } from "./components/history/TransactionHistoryView";
import { TransferFundsForm } from "./components/transfer/TransferFundsForm";
import { SentryMonitorDrawer } from "./components/sentry/SentryMonitorDrawer";
import { PlaidLinkModal } from "./components/plaid/PlaidLinkModal";
import { AuthView } from "./components/auth/AuthView";
import { ArchitectureView } from "./components/architecture/ArchitectureView";

function BankingAppContent() {
  const { activeTab, isAuthenticated } = useBanking();

  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && <DashboardOverview />}
          {activeTab === "banks" && <MyBanksView />}
          {activeTab === "history" && <TransactionHistoryView />}
          {activeTab === "transfer" && <TransferFundsForm />}
          {activeTab === "sentry" && <SentryMonitorDrawer isFullPage={true} />}
          {activeTab === "architecture" && <ArchitectureView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Interactive Overlays */}
      <PlaidLinkModal />
      <SentryMonitorDrawer isFullPage={false} />
    </div>
  );
}

export default function App() {
  return (
    <BankingProvider>
      <BankingAppContent />
    </BankingProvider>
  );
}
