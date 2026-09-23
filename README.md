# 🏦 Horizon Bank — Modern Financial Technology Platform

![Next.js 14](https://img.shields.io/badge/Next.js%2014-App%20Router-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-BaaS%20%26%20Auth-FD366E?logo=appwrite&logoColor=white)
![Plaid](https://img.shields.io/badge/Plaid-Financial%20Link-black?logo=plaid&logoColor=white)
![Dwolla](https://img.shields.io/badge/Dwolla-ACH%20Payments-FF6B00?logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-APM%20%26%20Tracing-362D59?logo=sentry&logoColor=white)
![Zod & React Hook Form](https://img.shields.io/badge/Forms-React%20Hook%20Form%20%2B%20Zod-EC5990)

**Horizon Bank** is an enterprise-grade FinTech banking platform that brings together multi-bank account aggregation, real-time ACH payment rails, end-to-end type safety, and real-time observability. 

Engineered with **Next.js 14 (App Router)**, **Plaid**, **Dwolla**, **Appwrite**, and **Sentry**, Horizon Bank delivers a secure, accessible, and high-performance financial dashboard for both personal and commercial banking needs.

---

## ✨ Key Features

- 🔐 **Appwrite BaaS & KYC Authentication**:
  - Secure session management and credential encryption.
  - Multi-profile persona switching (Personal vs. Commercial LLC).
  - Complete KYC onboarding (routing addresses, date of birth, SSN collection).

- 🏦 **Plaid Link Multi-Bank Aggregation**:
  - Interactive Plaid Link flow supporting 12,000+ North American financial institutions (Chase, Bank of America, Wells Fargo, SVB, Citibank).
  - Instant account verification with token exchange lifecycle (`public_token` ➔ `access_token` ➔ `processor_token`).
  - Real-time balance and liquidity synchronization.

- 💸 **Dwolla ACH Money Movement Engine**:
  - Standard ACH (1–2 business days) and Instant Real-Time Transfer rails.
  - Client-side overdraft prevention validating transfer amounts against active funding source balances.
  - Certified, printable digital receipts containing official Dwolla ACH tracking numbers.

- 📋 **Schema-Driven Form Architecture**:
  - Built with **React Hook Form** and **Zod** schema validation.
  - Real-time field validation for 9-digit ABA routing numbers, account numbers, and email patterns.
  - Dynamic fee computation ($0 Standard ACH vs. $1.50 Instant transfer fee).

- 📊 **Transaction Ledger & Spend Analytics**:
  - Searchable and multi-filterable transaction history (category, credit vs. debit, date range).
  - Recharts interactive category expense donut breakdown.
  - One-click CSV ledger export for financial audits and bookkeeping.

- 🛡️ **Sentry Enterprise Observability**:
  - Distributed tracing capturing exact execution spans for Plaid, Dwolla, and Appwrite operations in milliseconds.
  - Real-time audit breadcrumbs stream tracking user actions.
  - Interactive clearinghouse exception simulation to test system recovery and error boundaries.

- 🗺️ **Non-Developer Interactive Visual UX Flow**:
  - In-app 6-step interactive visual roadmap designed for clients, product managers, and non-engineers.
  - Visual swimlanes explaining the roles of the user, the financial rails, and the security systems.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) | App Router, Server Actions, and SSR architecture |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict financial data modeling and compile-time type safety |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) | Accessible, mobile-responsive FinTech component system |
| **Backend & Auth** | [Appwrite](https://appwrite.io/) | Authentication, user profiles, KYC records, and session tokens |
| **Banking Data** | [Plaid](https://plaid.com/) | Bank connectivity, credentialing, and token exchange |
| **Payment Rails**| [Dwolla](https://www.dwolla.com/) | ACH payment processing and funding source orchestration |
| **Observability** | [Sentry](https://sentry.io/) | Performance monitoring, span tracing, and session replay |
| **Validation** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | High-performance, schema-validated forms |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/horizon-bank.git
   cd horizon-bank
