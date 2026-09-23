import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getAccountTypeColor(type: string): { bg: string; text: string; border: string } {
  switch (type.toLowerCase()) {
    case "checking":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
    case "savings":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
    case "credit":
      return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" };
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
  }
}

export function getCategoryBadge(category: string): { bg: string; text: string } {
  const c = category.toLowerCase();
  if (c.includes("food") || c.includes("restaurant") || c.includes("grocer")) {
    return { bg: "bg-amber-100", text: "text-amber-800" };
  }
  if (c.includes("travel") || c.includes("uber") || c.includes("transit")) {
    return { bg: "bg-sky-100", text: "text-sky-800" };
  }
  if (c.includes("transfer") || c.includes("dwolla")) {
    return { bg: "bg-violet-100", text: "text-violet-800" };
  }
  if (c.includes("income") || c.includes("deposit") || c.includes("payroll") || c.includes("stripe")) {
    return { bg: "bg-emerald-100", text: "text-emerald-800" };
  }
  if (c.includes("software") || c.includes("tech") || c.includes("subscription")) {
    return { bg: "bg-indigo-100", text: "text-indigo-800" };
  }
  return { bg: "bg-slate-100", text: "text-slate-800" };
}
