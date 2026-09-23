import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AppwriteUser,
  BankAccount,
  PlaidInstitution,
  SentryTelemetryEvent,
  Transaction,
  TransferFormValues,
} from "../types";
import {
  INITIAL_APPWRITE_USERS,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_TRANSACTIONS,
} from "../data/mockData";

interface BankingContextType {
  isAuthenticated: boolean;
  currentUser: AppwriteUser;
  allUsers: AppwriteUser[];
  bankAccounts: BankAccount[];
  selectedAccountId: string;
  transactions: Transaction[];
  sentryEvents: SentryTelemetryEvent[];
  isPlaidModalOpen: boolean;
  isSentryDrawerOpen: boolean;
  activeTab: "dashboard" | "banks" | "history" | "transfer" | "sentry" | "architecture";
  hideBalances: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (userData: {
    name: string;
    email: string;
    password?: string;
    role?: "personal" | "business";
    address1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    dateOfBirth?: string;
    ssn?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  setSelectedAccountId: (id: string) => void;
  setActiveTab: (tab: "dashboard" | "banks" | "history" | "transfer" | "sentry" | "architecture") => void;
  setIsPlaidModalOpen: (open: boolean) => void;
  setIsSentryDrawerOpen: (open: boolean) => void;
  setHideBalances: (hide: boolean | ((prev: boolean) => boolean)) => void;
  switchUser: (userId: string) => void;
  connectPlaidAccount: (
    institution: PlaidInstitution,
    account: { name: string; type: BankAccount["type"]; mask: string; balance: number },
    color: BankAccount["cardColor"]
  ) => Promise<BankAccount>;
  executeDwollaTransfer: (
    values: TransferFormValues
  ) => Promise<{ success: boolean; transferId: string; error?: string }>;
  logSentryBreadcrumb: (
    event: Omit<SentryTelemetryEvent, "id" | "timestamp">
  ) => void;
  triggerSentrySimulatedError: () => void;
  resetAllData: () => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export function BankingProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = useState<AppwriteUser[]>(() => {
    const saved = localStorage.getItem("appwrite_all_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_APPWRITE_USERS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem("appwrite_authenticated");
    return saved !== "false";
  });

  const [currentUser, setCurrentUser] = useState<AppwriteUser>(() => {
    const saved = localStorage.getItem("appwrite_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_APPWRITE_USERS[0];
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem("banking_accounts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_BANK_ACCOUNTS;
  });

  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("banking_transactions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TRANSACTIONS;
  });

  const [sentryEvents, setSentryEvents] = useState<SentryTelemetryEvent[]>(() => {
    return [
      {
        id: "sentry_init_01",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: "info",
        category: "appwrite",
        message: "Appwrite session authenticated for user harrynjoga@gmail.com",
        data: { userId: "usr_298884965270", scope: ["account", "database.read"] },
        span: { op: "appwrite.auth", description: "account.get()", durationMs: 142 },
      },
      {
        id: "sentry_init_02",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        level: "info",
        category: "plaid",
        message: "Plaid accounts sync completed: 3 active institutions connected",
        data: { institutions: ["Chase", "Bank of America", "Silicon Valley Bank"] },
        span: { op: "plaid.accounts.balance.get", description: "Plaid Accounts Sync", durationMs: 290 },
      },
      {
        id: "sentry_init_03",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        level: "info",
        category: "dwolla",
        message: "Dwolla customer funding sources verified & webhook listener healthy",
        data: { customerId: "dwolla_cust_47f2e10a-3c09-4112", status: "verified" },
        span: { op: "dwolla.customers.fundingSources", description: "Verify Funding Sources", durationMs: 165 },
      },
    ];
  });

  const [isPlaidModalOpen, setIsPlaidModalOpen] = useState(false);
  const [isSentryDrawerOpen, setIsSentryDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "banks" | "history" | "transfer" | "sentry" | "architecture">("dashboard");
  const [hideBalances, setHideBalances] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("appwrite_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("banking_accounts", JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem("banking_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const logSentryBreadcrumb = (event: Omit<SentryTelemetryEvent, "id" | "timestamp">) => {
    const newEvent: SentryTelemetryEvent = {
      id: `sentry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };
    setSentryEvents((prev) => [newEvent, ...prev.slice(0, 99)]);
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 400));
    const normalizedEmail = email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (existing) {
      setCurrentUser(existing);
      setIsAuthenticated(true);
      localStorage.setItem("appwrite_authenticated", "true");
      logSentryBreadcrumb({
        level: "info",
        category: "appwrite",
        message: `Appwrite session created: ${existing.name} (${existing.email})`,
        data: { userId: existing.userId, role: existing.role },
        span: { op: "appwrite.account.createEmailPasswordSession", description: "Authenticate user session", durationMs: 135 },
      });
      return { success: true };
    }

    // Dynamic sign-in for demo email
    const newUser: AppwriteUser = {
      $id: `user_appwrite_${Date.now().toString(36)}`,
      name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Demo User",
      email: normalizedEmail,
      userId: `usr_${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      dwollaCustomerId: `dwolla_cust_${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}`,
      dwollaCustomerUrl: "https://api-sandbox.dwolla.com/customers/demo",
      address1: "Market Street 100",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      dateOfBirth: "1995-01-01",
      ssn: "•••-••-1234",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: "personal",
    };

    setAllUsers((prev) => {
      const updated = [...prev, newUser];
      localStorage.setItem("appwrite_all_users", JSON.stringify(updated));
      return updated;
    });
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("appwrite_authenticated", "true");
    logSentryBreadcrumb({
      level: "info",
      category: "appwrite",
      message: `New Appwrite session initiated for ${newUser.email}`,
      data: { userId: newUser.userId },
      span: { op: "appwrite.account.createEmailPasswordSession", description: "Dynamic authentication", durationMs: 140 },
    });

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("appwrite_authenticated", "false");
    logSentryBreadcrumb({
      level: "info",
      category: "appwrite",
      message: `User signed out: Appwrite session destroyed for ${currentUser.email}`,
      data: { userId: currentUser.userId },
      span: { op: "appwrite.account.deleteSession", description: "Terminate user session", durationMs: 62 },
    });
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password?: string;
    role?: "personal" | "business";
    address1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    dateOfBirth?: string;
    ssn?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 500));
    const normalizedEmail = userData.email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: "An account with this email already exists in Appwrite." };
    }

    const newUser: AppwriteUser = {
      $id: `user_appwrite_${Date.now().toString(36)}`,
      name: userData.name,
      email: normalizedEmail,
      userId: `usr_${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      dwollaCustomerId: `dwolla_cust_${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}`,
      dwollaCustomerUrl: `https://api-sandbox.dwolla.com/customers/${Math.random().toString(36).substring(2, 8)}`,
      address1: userData.address1 || "101 California St",
      city: userData.city || "San Francisco",
      state: userData.state || "CA",
      postalCode: userData.postalCode || "94111",
      dateOfBirth: userData.dateOfBirth || "1996-05-12",
      ssn: userData.ssn ? `•••-••-${userData.ssn.slice(-4)}` : "•••-••-5590",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: userData.role || "personal",
    };

    setAllUsers((prev) => {
      const updated = [...prev, newUser];
      localStorage.setItem("appwrite_all_users", JSON.stringify(updated));
      return updated;
    });
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("appwrite_authenticated", "true");

    logSentryBreadcrumb({
      level: "info",
      category: "appwrite",
      message: `New account created in Appwrite BaaS for ${newUser.name} (${newUser.email})`,
      data: { userId: newUser.userId, role: newUser.role },
      span: { op: "appwrite.account.create", description: "Appwrite user registration & Dwolla onboarding", durationMs: 290 },
    });

    return { success: true };
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find((u) => u.$id === userId);
    if (target) {
      setCurrentUser(target);
      logSentryBreadcrumb({
        level: "info",
        category: "appwrite",
        message: `User switched session to ${target.name} (${target.email})`,
        data: { userId: target.userId, role: target.role },
        span: { op: "appwrite.account.updateSession", description: "Appwrite switch user profile", durationMs: 88 },
      });
    }
  };

  const connectPlaidAccount = async (
    institution: PlaidInstitution,
    account: { name: string; type: BankAccount["type"]; mask: string; balance: number },
    color: BankAccount["cardColor"]
  ): Promise<BankAccount> => {
    const newBankId = `bank_${institution.name.toLowerCase().replace(/\s+/g, "_")}_${account.mask}`;
    const newAccount: BankAccount = {
      id: newBankId,
      availableBalance: account.balance,
      currentBalance: account.balance + 150,
      officialName: `${institution.name} ${account.name}`,
      name: `${institution.name} ${account.name}`,
      mask: account.mask,
      institutionId: institution.id,
      institutionName: institution.name,
      type: account.type,
      subtype: account.type,
      shareableId: `plaid_sec_${institution.name.toLowerCase()}_${account.mask}`,
      routingNumber: "021000" + Math.floor(100 + Math.random() * 899),
      accountNumber: "9" + Math.floor(10000000000 + Math.random() * 89999999999),
      cardColor: color,
      cardExpiry: "09/29",
      cardHolder: currentUser.name.toUpperCase(),
    };

    setBankAccounts((prev) => [newAccount, ...prev]);

    // Also add an initial sync transaction
    const syncTx: Transaction = {
      id: `tx_${Date.now()}`,
      name: `Initial Plaid Sync - ${institution.name}`,
      paymentChannel: "ach",
      type: "credit",
      accountId: newBankId,
      amount: account.balance,
      pending: false,
      category: "Payment / Transfer",
      date: new Date().toISOString(),
      status: "Success",
      channel: "Plaid Link Sync",
      senderBank: institution.name,
      receiverBank: newAccount.name,
      note: "Plaid Sandbox automated sync",
    };

    setTransactions((prev) => [syncTx, ...prev]);

    logSentryBreadcrumb({
      level: "info",
      category: "plaid",
      message: `Plaid Link exchange_public_token successful for ${institution.name} (mask: •••• ${account.mask})`,
      data: {
        institutionId: institution.id,
        institutionName: institution.name,
        accountId: newAccount.id,
        balance: account.balance,
      },
      span: {
        op: "plaid.item.public_token.exchange",
        description: "Plaid Token Exchange & Dwolla Processor Token Creation",
        durationMs: 340,
      },
    });

    return newAccount;
  };

  const executeDwollaTransfer = async (
    values: TransferFormValues
  ): Promise<{ success: boolean; transferId: string; error?: string }> => {
    const sourceAccount = bankAccounts.find((b) => b.id === values.sourceBankId);
    if (!sourceAccount) {
      logSentryBreadcrumb({
        level: "error",
        category: "dwolla",
        message: `Transfer failed: Source bank account not found (${values.sourceBankId})`,
      });
      return { success: false, transferId: "", error: "Selected source bank account could not be found." };
    }

    if (sourceAccount.availableBalance < values.amount) {
      logSentryBreadcrumb({
        level: "warning",
        category: "dwolla",
        message: `Dwolla transfer rejected: Insufficient funds. Available: $${sourceAccount.availableBalance}, Requested: $${values.amount}`,
        data: { available: sourceAccount.availableBalance, requested: values.amount },
      });
      return {
        success: false,
        transferId: "",
        error: `Insufficient funds in ${sourceAccount.name}. Available balance is $${sourceAccount.availableBalance.toFixed(2)}.`,
      };
    }

    const dwollaTransferId = `dw_tx_${Math.floor(100000 + Math.random() * 900000)}`;

    // Deduct balance from source bank account
    setBankAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === values.sourceBankId) {
          const newAvail = Math.max(0, acc.availableBalance - values.amount);
          const newCurr = Math.max(0, acc.currentBalance - values.amount);
          return {
            ...acc,
            availableBalance: newAvail,
            currentBalance: newCurr,
          };
        }
        return acc;
      })
    );

    // Record new transaction
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      name: `Dwolla ACH Transfer to ${values.recipientName}`,
      paymentChannel: "ach",
      type: "debit",
      accountId: values.sourceBankId,
      amount: values.amount,
      pending: false,
      category: "Payment / Transfer",
      date: new Date().toISOString(),
      status: "Success",
      channel: values.transferSpeed === "instant" ? "Dwolla Real-Time ACH" : "Dwolla Standard ACH",
      senderBank: sourceAccount.name,
      receiverBank: `${values.recipientName} (•••• ${values.recipientAccountNumber.slice(-4)})`,
      dwollaTransferId,
      note: values.note || "Funds transfer via Dwolla payment gateway",
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Log Sentry telemetry
    logSentryBreadcrumb({
      level: "info",
      category: "dwolla",
      message: `Dwolla money transfer initiated: $${values.amount.toFixed(2)} from ${sourceAccount.name} to ${values.recipientEmail}`,
      data: {
        dwollaTransferId,
        amount: values.amount,
        speed: values.transferSpeed,
        routingNumber: values.routingNumber,
        recipientEmail: values.recipientEmail,
        sourceCustomerId: currentUser.dwollaCustomerId,
      },
      span: {
        op: "dwolla.transfers.create",
        description: "Dwolla ACH Payment Processing",
        durationMs: values.transferSpeed === "instant" ? 112 : 210,
      },
    });

    return { success: true, transferId: dwollaTransferId };
  };

  const triggerSentrySimulatedError = () => {
    const errorTimestamp = new Date().toISOString();
    const simulatedErrorEvent: SentryTelemetryEvent = {
      id: `sentry_err_${Date.now()}`,
      timestamp: errorTimestamp,
      level: "error",
      category: "dwolla",
      message: "Uncaught DwollaApiException: Transfer verification timed out on ACH clearinghouse node 4",
      data: {
        errorCode: "DWOLLA_ROUTING_TIMEOUT",
        node: "ach-gateway-us-west.fintech.internal",
        retryCount: 3,
        stackTrace: [
          "at executeDwollaTransfer (dwolla.actions.ts:84:13)",
          "at async onSubmit (TransferFundsForm.tsx:142:7)",
          "at HTMLButtonElement.dispatch (react-dom.production.min.js:219:402)",
        ],
      },
      span: {
        op: "http.client",
        description: "POST https://api.dwolla.com/transfers",
        durationMs: 4890,
      },
    };

    setSentryEvents((prev) => [simulatedErrorEvent, ...prev]);
    setIsSentryDrawerOpen(true);
  };

  const resetAllData = () => {
    localStorage.removeItem("appwrite_user");
    localStorage.removeItem("banking_accounts");
    localStorage.removeItem("banking_transactions");
    setCurrentUser(INITIAL_APPWRITE_USERS[0]);
    setBankAccounts(INITIAL_BANK_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSelectedAccountId("all");
    logSentryBreadcrumb({
      level: "warning",
      category: "appwrite",
      message: "Banking system storage restored to factory initial demo state",
    });
  };

  return (
    <BankingContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        allUsers,
        bankAccounts,
        selectedAccountId,
        transactions,
        sentryEvents,
        isPlaidModalOpen,
        isSentryDrawerOpen,
        activeTab,
        hideBalances,
        login,
        logout,
        signup,
        setSelectedAccountId,
        setActiveTab,
        setIsPlaidModalOpen,
        setIsSentryDrawerOpen,
        setHideBalances,
        switchUser,
        connectPlaidAccount,
        executeDwollaTransfer,
        logSentryBreadcrumb,
        triggerSentrySimulatedError,
        resetAllData,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}

export function useBanking() {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error("useBanking must be used within a BankingProvider");
  }
  return context;
}
