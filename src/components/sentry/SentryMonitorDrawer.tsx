import React, { useState } from "react";
import { useBanking } from "../../context/BankingContext";
import { formatDateTime } from "../../lib/utils";
import {
  Activity,
  AlertTriangle,
  Bug,
  CheckCircle2,
  Clock,
  Code2,
  ExternalLink,
  Flame,
  Layers,
  Play,
  RotateCcw,
  ShieldAlert,
  Terminal,
  X,
  Zap,
} from "lucide-react";

export const SentryMonitorDrawer: React.FC<{ isFullPage?: boolean }> = ({ isFullPage = false }) => {
  const {
    sentryEvents,
    isSentryDrawerOpen,
    setIsSentryDrawerOpen,
    triggerSentrySimulatedError,
    currentUser,
  } = useBanking();

  const [activeFilter, setActiveFilter] = useState<"all" | "error" | "dwolla" | "plaid" | "appwrite">("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  if (!isFullPage && !isSentryDrawerOpen) return null;

  const filteredEvents = sentryEvents.filter((ev) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "error") return ev.level === "error";
    return ev.category === activeFilter;
  });

  const errorEvents = sentryEvents.filter((ev) => ev.level === "error");
  const selectedEvent = sentryEvents.find((e) => e.id === selectedEventId) || filteredEvents[0];

  const content = (
    <div className="space-y-6">
      {/* Sentry System Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sentry Status</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="mt-1 text-base font-bold text-slate-900">Connected</p>
          <p className="text-[10px] text-slate-500 font-mono">dsn: o4507...ingest.sentry.io</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">SDK Version</span>
            <Code2 className="h-3.5 w-3.5 text-violet-500" />
          </div>
          <p className="mt-1 text-base font-bold text-slate-900">@sentry/nextjs</p>
          <p className="text-[10px] text-slate-500">App Router & Server Actions</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Session Replay</span>
            <Play className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <p className="mt-1 text-base font-bold text-slate-900">100% Sample</p>
          <p className="text-[10px] text-emerald-600 font-medium">Recording active session</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Captured Errors</span>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <p className={`mt-1 text-base font-bold ${errorEvents.length > 0 ? "text-rose-600" : "text-slate-900"}`}>
            {errorEvents.length} issues
          </p>
          <p className="text-[10px] text-slate-500">
            {errorEvents.length > 0 ? "Requires review" : "0 uncaught exceptions"}
          </p>
        </div>
      </div>

      {/* Trigger Simulated Error Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-rose-50/50 to-orange-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm shadow-rose-600/30">
            <Bug className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Simulate Production Sentry Error
            </h4>
            <p className="text-xs text-slate-600">
              Fire an intentional Dwolla API timeout exception to verify Sentry alert capture and session replay tracing.
            </p>
          </div>
        </div>
        <button
          onClick={triggerSentrySimulatedError}
          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition"
        >
          <Flame className="h-3.5 w-3.5" />
          <span>Fire Test Exception</span>
        </button>
      </div>

      {/* Telemetry Stream & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Events Stream (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Live Breadcrumbs & Performance Spans
              </h3>
              <p className="text-[11px] text-slate-500">
                Audited client & server transactions
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1">
              {(["all", "error", "dwolla", "plaid", "appwrite"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                    activeFilter === filter
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[480px] overflow-y-auto space-y-2 pr-1 font-mono">
            {filteredEvents.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400 font-sans">
                No events match this filter.
              </p>
            ) : (
              filteredEvents.map((ev) => {
                const isSelected = selectedEvent?.id === ev.id;
                const isError = ev.level === "error";
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`w-full text-left rounded-xl p-3 border transition ${
                      isSelected
                        ? "border-violet-500 bg-violet-50/40 ring-1 ring-violet-500"
                        : isError
                        ? "border-rose-200 bg-rose-50/40 hover:border-rose-300"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            isError
                              ? "bg-rose-600 text-white"
                              : ev.category === "dwolla"
                              ? "bg-amber-100 text-amber-800"
                              : ev.category === "plaid"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {ev.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">
                          {formatDateTime(ev.timestamp)}
                        </span>
                      </div>
                      {ev.span && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-slate-500">
                          <Clock className="h-3 w-3" />
                          {ev.span.durationMs}ms
                        </span>
                      )}
                    </div>
                    <p className={`mt-1.5 text-xs font-sans line-clamp-2 ${isError ? "text-rose-900 font-semibold" : "text-slate-800 font-medium"}`}>
                      {ev.message}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Event Inspector (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Sentry Event Inspector
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Event ID: {selectedEvent ? selectedEvent.id : "None"}
            </p>
          </div>

          {selectedEvent ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 font-sans">
                  Message
                </span>
                <div className={`p-2.5 rounded-lg border text-xs ${
                  selectedEvent.level === "error"
                    ? "bg-rose-50 border-rose-200 text-rose-900 font-semibold"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}>
                  {selectedEvent.message}
                </div>
              </div>

              {selectedEvent.span && (
                <div className="rounded-lg bg-slate-900 text-emerald-400 p-3 space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>SPAN TRACE</span>
                    <span>{selectedEvent.span.durationMs}ms</span>
                  </div>
                  <p className="text-white font-bold">{selectedEvent.span.op}</p>
                  <p className="text-xs text-slate-300 font-sans">{selectedEvent.span.description}</p>
                </div>
              )}

              {selectedEvent.data && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-sans">
                    Payload & Metadata
                  </span>
                  <pre className="max-h-48 overflow-y-auto rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-700 border border-slate-200">
                    {JSON.stringify(selectedEvent.data, null, 2)}
                  </pre>
                </div>
              )}

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] font-sans space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">User Context</span>
                <p className="font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-slate-500 font-mono text-[10px]">Appwrite: {currentUser.userId}</p>
                <p className="text-slate-500 font-mono text-[10px]">Dwolla: {currentUser.dwollaCustomerId}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Select an event to view full JSON payload.</p>
          )}
        </div>
      </div>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Sentry Monitoring & Session Replay
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise application telemetry, real-time performance span tracking, and production exception diagnostic center.
          </p>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl h-full overflow-y-auto bg-slate-50 p-6 shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sentry Telemetry Drawer</h3>
              <p className="text-xs text-slate-500">Live Application Monitoring</p>
            </div>
          </div>
          <button
            onClick={() => setIsSentryDrawerOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {content}
      </div>
    </div>
  );
};
