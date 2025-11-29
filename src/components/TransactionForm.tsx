import { useState, useEffect, type FormEvent, type FC } from "react";
import { Transaction, TransactionType } from "../types";
import { CATEGORIES, PAYMENT_METHODS } from "../constants";
import Button from "./Button";
import { Save, X } from "lucide-react";

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
  onCancel: () => void;
  initialData?: Transaction;
}

const TransactionForm: FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [categoryId, setCategoryId] = useState(
    CATEGORIES.find((c) => c.type === TransactionType.EXPENSE)?.id || ""
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "TRANSFER" | "E-WALLET"
  >("CASH");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) {
      const firstCat = CATEGORIES.find((c) => c.type === type);
      if (firstCat) setCategoryId(firstCat.id);
    }
  }, [type, initialData]);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      // store amount as formatted string (e.g. 2.000.000)
      setAmount(formatNumber(initialData.amount));
      setType(initialData.type);
      setCategoryId(initialData.categoryId);
      setDate(initialData.date);
      setPaymentMethod(initialData.paymentMethod);
    }
  }, [initialData]);

  // Helpers: format number with dot as thousand separator and remove non-digit chars
  function formatNumber(value: number | string) {
    if (value === "" || value === null || value === undefined) return "";
    const num =
      typeof value === "number"
        ? value
        : Number(String(value).replace(/\D/g, "")) || 0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function unformatNumber(formatted: string) {
    return Number(String(formatted).replace(/\./g, "")) || 0;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = unformatNumber(amount);
    if (!description || !numericAmount || numericAmount <= 0) {
      setError("Mohon lengkapi deskripsi dan pastikan nominal lebih dari 0.");
      return;
    }

    onSubmit({
      description,
      amount: numericAmount,
      type,
      categoryId,
      date,
      paymentMethod,
    });
  };

  const filteredCategories = CATEGORIES.filter((c) => c.type === type);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-slate-800">
          {initialData ? "Edit Transaksi" : "Tambah Transaksi Baru"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Jenis Transaksi
        </label>
        <div className="flex space-x-4">
          <label
            className={`flex-1 cursor-pointer border rounded-lg p-3 text-center transition-all ${
              type === TransactionType.EXPENSE
                ? "bg-red-50 border-red-500 text-red-700 font-bold"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="type"
              value={TransactionType.EXPENSE}
              checked={type === TransactionType.EXPENSE}
              onChange={() => setType(TransactionType.EXPENSE)}
              className="hidden"
            />
            Pengeluaran 💸
          </label>
          <label
            className={`flex-1 cursor-pointer border rounded-lg p-3 text-center transition-all ${
              type === TransactionType.INCOME
                ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="type"
              value={TransactionType.INCOME}
              checked={type === TransactionType.INCOME}
              onChange={() => setType(TransactionType.INCOME)}
              className="hidden"
            />
            Pemasukan 💰
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tanggal
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kategori
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
          >
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nominal (Rp)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => {
              const raw = String(e.target.value || "");
              // remove all non-digit characters
              const digits = raw.replace(/\D/g, "");
              const formatted = formatNumber(digits);
              setAmount(formatted);
            }}
            placeholder="0"
            className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 font-mono"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Metode Bayar
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
          >
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm.value} value={pm.value}>
                {pm.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Deskripsi / Keterangan
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Contoh: Makan siang nasi padang"
          className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          <Save size={18} className="mr-2" /> Simpan Data
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
