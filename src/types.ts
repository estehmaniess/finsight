export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  paymentMethod: "CASH" | "TRANSFER" | "E-WALLET";
}

export interface SummaryStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
