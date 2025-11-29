import type { FC } from "react";
import { SummaryStats, Transaction, TransactionType } from "../types";
import { CATEGORIES } from "../constants";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { Wallet, TrendingUp, TrendingDown, Activity } from "lucide-react";

interface DashboardProps {
  stats: SummaryStats;
  transactions: Transaction[];
}

const Dashboard: FC<DashboardProps> = ({ stats, transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const expenseData = (() => {
    const categoryTotals: Record<string, number> = {};

    transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .forEach((t) => {
        const catName =
          CATEGORIES.find((c) => c.id === t.categoryId)?.name || "Lainnya";
        categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
      });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  })();

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Saldo</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {formatCurrency(stats.balance)}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Wallet size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Pemasukan Bulan Ini
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {formatCurrency(stats.totalIncome)}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Pengeluaran Bulan Ini
            </p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">
              {formatCurrency(stats.totalExpense)}
            </h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <TrendingDown size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Activity className="mr-2 text-slate-500" size={20} /> Analisis
            Pengeluaran
          </h3>
        </div>

        {expenseData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <TrendingDown size={32} className="mb-2 opacity-50" />
            <p>Belum ada data pengeluaran</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
