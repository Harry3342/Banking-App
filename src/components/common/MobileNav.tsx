import React from "react";
import { useBanking } from "../../context/BankingContext";
import { LayoutDashboard, CreditCard, ArrowLeftRight, Send, Activity, GitBranch } from "lucide-react";

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useBanking();

  const items = [
    { id: "dashboard" as const, label: "Home", icon: LayoutDashboard },
    { id: "banks" as const, label: "Banks", icon: CreditCard },
    { id: "transfer" as const, label: "Transfer", icon: Send },
    { id: "history" as const, label: "History", icon: ArrowLeftRight },
    { id: "sentry" as const, label: "Sentry", icon: Activity },
    { id: "architecture" as const, label: "Arch", icon: GitBranch },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium transition ${
              isActive ? "text-emerald-600 font-semibold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
