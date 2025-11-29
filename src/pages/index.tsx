import { useState, useEffect, useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Dashboard from "../components/Dashboard";
import TransactionForm from "../components/TransactionForm";
import Modal from "../components/Modal";
import TransactionList from "../components/TransactionList";
import Button from "../components/Button";
import { Transaction, TransactionType, SummaryStats } from "../types";
import { Plus, LayoutDashboard, List } from "lucide-react";

const Home: NextPage = () => {
  // Initialize with an empty array on the server to keep SSR deterministic.
  // Read from localStorage only on the client after mount to avoid hydration
  // mismatches (server vs client initial render differences).
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("finsight_transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  const [view, setView] = useState<"DASHBOARD" | "LIST">("DASHBOARD");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("finsight_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const stats: SummaryStats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);

  const handleAddTransaction = (data: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = { ...data, id: crypto.randomUUID() };
    setTransactions((prev) => [newTransaction, ...prev]);
    setIsFormOpen(false);
  };

  const handleEditTransaction = (data: Omit<Transaction, "id">) => {
    if (!editingTransaction) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingTransaction.id ? { ...data, id: t.id } : t
      )
    );
    setEditingTransaction(undefined);
    setIsFormOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm("Yakin ingin menghapus transaksi ini?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const openEditForm = (t: Transaction) => {
    setEditingTransaction(t);
    setIsFormOpen(true);
  };

  return (
    <>
      <Head>
        <title>Finsight — Pencatat Keuangan</title>
        <meta
          name="description"
          content="Aplikasi pencatat keuangan sederhana"
        />
      </Head>

      <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-600 rounded-lg flex items-center justify-center h-10 w-10">
                <img src="/logo.svg" alt="Finsight" className="h-7 w-7" />
              </div>
              <div className="leading-tight">
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Finsight
                </h1>
                <p className="text-sm text-slate-500">Personal Finance</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  setEditingTransaction(undefined);
                  setIsFormOpen(true);
                }}
                className="shadow-lg shadow-emerald-600/20"
              >
                <Plus size={18} className="mr-1.5" /> Transaksi
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
          <div className="flex space-x-4 mb-6 border-b border-slate-200 pb-1">
            <button
              onClick={() => setView("DASHBOARD")}
              className={`pb-3 px-1 text-sm font-medium flex items-center transition-colors relative ${
                view === "DASHBOARD"
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LayoutDashboard size={16} className="mr-2" /> Dashboard
              {view === "DASHBOARD" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setView("LIST")}
              className={`pb-3 px-1 text-sm font-medium flex items-center transition-colors relative ${
                view === "LIST"
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <List size={16} className="mr-2" /> Riwayat
              {view === "LIST" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>
              )}
            </button>
          </div>

          <div className="space-y-6 animate-fade-in">
            {view === "DASHBOARD" && (
              <>
                <Dashboard stats={stats} transactions={transactions} />

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800">
                      Transaksi Terakhir
                    </h3>
                    <button
                      onClick={() => setView("LIST")}
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      Lihat Semua
                    </button>
                  </div>
                  <TransactionList
                    transactions={transactions.slice(0, 5)}
                    onDelete={handleDeleteTransaction}
                    onEdit={openEditForm}
                  />
                </div>
              </>
            )}

            {view === "LIST" && (
              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                onEdit={openEditForm}
              />
            )}
          </div>

          {isFormOpen && (
            <Modal
              onClose={() => {
                setIsFormOpen(false);
                setEditingTransaction(undefined);
              }}
            >
              <TransactionForm
                onSubmit={
                  editingTransaction
                    ? handleEditTransaction
                    : handleAddTransaction
                }
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingTransaction(undefined);
                }}
                initialData={editingTransaction}
              />
            </Modal>
          )}
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
          <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>© 2024 Finsight App. Dibuat dengan React & Tailwind.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
