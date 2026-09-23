export interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  userId: string;
  dwollaCustomerId: string;
  dwollaCustomerUrl: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
  avatarUrl?: string;
  role: "personal" | "business";
}

export type BankType = "checking" | "savings" | "credit" | "investment";

export interface BankAccount {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  institutionName: string;
  name: string;
  type: BankType;
  subtype: string;
  shareableId: string;
  routingNumber: string;
  accountNumber: string;
  cardColor: "blue" | "emerald" | "slate" | "purple" | "amber";
  cardExpiry: string;
  cardHolder: string;
  isPrimary?: boolean;
}

export type TransactionCategory =
  | "Food and Dining"
  | "Travel & Transport"
  | "Payment / Transfer"
  | "Salary & Income"
  | "Software & Services"
  | "Entertainment"
  | "Utilities";

export type TransactionStatus = "Success" | "Processing" | "Pending" | "Declined";

export interface Transaction {
  id: string;
  name: string;
  paymentChannel: "online" | "in store" | "ach" | "wire";
  type: "debit" | "credit";
  accountId: string;
  amount: number;
  pending: boolean;
  category: TransactionCategory;
  date: string;
  status: TransactionStatus;
  channel: string;
  senderBank: string;
  receiverBank?: string;
  dwollaTransferId?: string;
  note?: string;
}

export interface PlaidInstitution {
  id: string;
  name: string;
  logo: string;
  color: string;
  popular?: boolean;
  sampleAccounts: {
    name: string;
    type: BankType;
    mask: string;
    balance: number;
  }[];
}

export interface SentryTelemetryEvent {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  category: "navigation" | "plaid" | "dwolla" | "appwrite" | "ui.click" | "form";
  message: string;
  data?: Record<string, any>;
  span?: {
    op: string;
    description: string;
    durationMs: number;
  };
}

export interface TransferFormValues {
  sourceBankId: string;
  recipientEmail: string;
  recipientName: string;
  recipientAccountNumber: string;
  routingNumber: string;
  amount: number;
  note: string;
  transferSpeed: "standard" | "instant";
}
