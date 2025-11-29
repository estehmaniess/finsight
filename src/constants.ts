// Local type definitions to avoid missing './types' module
export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  type: TransactionType;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "Gaji",
    icon: "💰",
    type: TransactionType.INCOME,
  },
  {
    id: "cat_2",
    name: "Bonus/Sampingan",
    icon: "🎁",
    type: TransactionType.INCOME,
  },
  {
    id: "cat_3",
    name: "Makanan & Minuman",
    icon: "🍔",
    type: TransactionType.EXPENSE,
  },
  {
    id: "cat_4",
    name: "Transportasi",
    icon: "🚗",
    type: TransactionType.EXPENSE,
  },
  {
    id: "cat_5",
    name: "Belanja",
    icon: "🛍️",
    type: TransactionType.EXPENSE,
  },
  {
    id: "cat_6",
    name: "Tagihan & Utilitas",
    icon: "💡",
    type: TransactionType.EXPENSE,
  },
  {
    id: "cat_7",
    name: "Hiburan",
    icon: "🎬",
    type: TransactionType.EXPENSE,
  },
  {
    id: "cat_8",
    name: "Kesehatan",
    icon: "🏥",
    type: TransactionType.EXPENSE,
  },
  {
    id: "cat_9",
    name: "Lainnya",
    icon: "📝",
    type: TransactionType.EXPENSE,
  },
];

export const PAYMENT_METHODS: {
  value: "CASH" | "TRANSFER" | "E-WALLET";
  label: string;
}[] = [
  {
    value: "CASH",
    label: "Tunai",
  },
  {
    value: "TRANSFER",
    label: "Transfer Bank",
  },
  {
    value: "E-WALLET",
    label: "E-Wallet (GoPay/OVO)",
  },
];
