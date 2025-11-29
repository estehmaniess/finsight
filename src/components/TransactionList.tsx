import { useState, useMemo, type FC } from "react";
import { Transaction, TransactionType } from "../types";
import { CATEGORIES } from "../constants";
import { Trash2, Edit2, Filter, Search } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (t: Transaction) => void;
}

const TransactionList: FC<TransactionListProps> = ({
  transactions,
  onDelete,
  onEdit,
}) => {
  const [filterType, setFilterType] = useState<TransactionType | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesType = filterType === "ALL" || t.type === filterType;
        const matchesSearch = t.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, searchTerm]);

  const getCategoryName = (id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat ? `${cat.icon} ${cat.name}` : "Unknown";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="font-semibold text-slate-800 flex items-center">
          Riwayat Transaksi
          <span className="ml-2 bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
            {filteredData.length}
          </span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-48"
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white cursor-pointer w-full"
            >
              <option value="ALL">Semua Tipe</option>
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredData.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <p className="mb-2">Tidak ada transaksi yang ditemukan.</p>
            <p className="text-xs">Coba ubah filter atau tambah data baru.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Deskripsi</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3 text-right">Jumlah</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {t.description}
                    <div className="text-xs text-slate-400 mt-0.5">
                      {t.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {getCategoryName(t.categoryId)}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      t.type === TransactionType.INCOME
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {t.type === TransactionType.INCOME ? "+" : "-"}{" "}
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
