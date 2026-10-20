import React, { useState, useMemo } from 'react';
import {
  DonationTransaction,
  ExpenseTransaction,
  formatRupiah,
} from '../utils/finance';
import {
  Search,
  Filter,
  FileText,
  ArrowDownRight,
  ArrowUpRight,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
} from 'lucide-react';

interface PublicLedgerProps {
  donations: DonationTransaction[];
  expenses: ExpenseTransaction[];
  onSelectReceipt: (tx: DonationTransaction) => void;
  onExportCSV: () => void;
}

export const PublicLedger: React.FC<PublicLedgerProps> = ({
  donations,
  expenses,
  onSelectReceipt,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedProofExpense, setSelectedProofExpense] = useState<ExpenseTransaction | null>(null);

  // Combine both donations and expenses into unified ledger items
  const ledgerItems = useMemo(() => {
    const list: Array<{
      id: string;
      date: string;
      type: 'IN' | 'OUT';
      reference: string;
      name: string;
      category: string;
      paymentMethod: string;
      amount: number;
      notes: string;
      rawDonation?: DonationTransaction;
      rawExpense?: ExpenseTransaction;
    }> = [];

    donations.forEach((d) => {
      list.push({
        id: d.id,
        date: d.date,
        type: 'IN',
        reference: d.receiptNumber,
        name: d.isAnonymous ? 'Hamba Allah (Anonim)' : d.donorName,
        category: d.akad,
        paymentMethod: d.paymentMethod,
        amount: d.amount,
        notes: d.wishlistTitle ? `[${d.wishlistTitle}] ${d.notes || ''}` : d.notes || 'Donasi ZISWAF',
        rawDonation: d,
      });
    });

    expenses.forEach((e) => {
      list.push({
        id: e.id,
        date: e.date,
        type: 'OUT',
        reference: e.id,
        name: e.recipient,
        category: e.category,
        paymentMethod: 'Kas Yayasan',
        amount: e.amount,
        notes: e.description,
        rawExpense: e,
      });
    });

    // Sort descending by date
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return list;
  }, [donations, expenses]);

  // Extract unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    donations.forEach((d) => cats.add(d.akad));
    expenses.forEach((e) => cats.add(e.category));
    return Array.from(cats);
  }, [donations, expenses]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return ledgerItems.filter((item) => {
      // Type match
      if (typeFilter === 'IN' && item.type !== 'IN') return false;
      if (typeFilter === 'OUT' && item.type !== 'OUT') return false;

      // Category match
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;

      // Search match
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesRef = item.reference.toLowerCase().includes(query);
        const matchesNotes = item.notes.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesRef && !matchesNotes && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [ledgerItems, typeFilter, categoryFilter, searchTerm]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Buku Kas Transparan (Real-Time Mutasi)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Setiap rupiah donasi masuk dan kas keluar terdaftar otomatis di sini untuk keterbukaan publik.
          </p>
        </div>

        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Unduh Buku Kas (Excel / CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 my-5">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama donatur, toko penerima, atau no. kuitansi..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Type Filter */}
        <div className="sm:col-span-4 flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({ledgerItems.length})
          </button>
          <button
            onClick={() => setTypeFilter('IN')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              typeFilter === 'IN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Masuk ({donations.length})
          </button>
          <button
            onClick={() => setTypeFilter('OUT')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              typeFilter === 'OUT'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Keluar ({expenses.length})
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="sm:col-span-3 flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Akad / Kategori</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table of Ledger */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-3.5">Waktu & Bukti</th>
              <th className="py-3 px-3.5">Entitas (Donatur / Penerima)</th>
              <th className="py-3 px-3.5">Akad / Kategori</th>
              <th className="py-3 px-3.5">Metode</th>
              <th className="py-3 px-3.5 text-right">Nominal</th>
              <th className="py-3 px-3.5 text-center">Aksi Dokumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Tidak ada transaksi mutasi yang cocok dengan filter atau pencarian.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition group"
                >
                  {/* Date & Ref */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`p-1.5 rounded-lg shrink-0 ${
                          item.type === 'IN'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.type === 'IN' ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">
                          {item.date}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.reference}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Name & Note */}
                  <td className="py-3 px-3.5">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                      {item.notes}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                        item.type === 'IN'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>

                  {/* Method */}
                  <td className="py-3 px-3.5 text-xs text-slate-600 whitespace-nowrap">
                    {item.paymentMethod}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-3.5 text-right whitespace-nowrap font-bold">
                    <span
                      className={
                        item.type === 'IN' ? 'text-emerald-700' : 'text-rose-700'
                      }
                    >
                      {item.type === 'IN' ? '+ ' : '- '}
                      {formatRupiah(item.amount)}
                    </span>
                  </td>

                  {/* Document Trigger */}
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    {item.type === 'IN' && item.rawDonation ? (
                      <button
                        onClick={() => onSelectReceipt(item.rawDonation!)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-300 transition cursor-pointer"
                        title="Lihat & Cetak Kuitansi Resmi"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Kuitansi</span>
                      </button>
                    ) : item.type === 'OUT' && item.rawExpense ? (
                      <button
                        onClick={() => setSelectedProofExpense(item.rawExpense!)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-300 transition cursor-pointer"
                        title="Lihat Bukti Foto Nota & Kuitansi Pengeluaran"
                      >
                        <ImageIcon className="w-3 h-3 text-slate-500" />
                        <span>Bukti Nota</span>
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Expense Proof Modal */}
      {selectedProofExpense && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">Bukti Fisik Pengeluaran Kas</span>
              </div>
              <button
                onClick={() => setSelectedProofExpense(null)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-base text-slate-900">
                    {selectedProofExpense.recipient}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedProofExpense.date} WIB</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-rose-700">
                    {formatRupiah(selectedProofExpense.amount)}
                  </span>
                  <span className="block text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold mt-1">
                    {selectedProofExpense.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200">
                <p className="font-semibold text-slate-900">Rincian Keperluan:</p>
                <p className="mt-0.5">{selectedProofExpense.description}</p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Dicatat: {selectedProofExpense.enteredBy}</span>
                  <span>Disetujui: {selectedProofExpense.approvedBy || '-'}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Foto Nota / Kuitansi Toko Terlampir:</p>
                {selectedProofExpense.proofImageUrl ? (
                  <div className="rounded-xl overflow-hidden border border-slate-300 shadow-xs max-h-72 bg-slate-100 flex items-center justify-center">
                    <img
                      src={selectedProofExpense.proofImageUrl}
                      alt="Bukti Nota Pengeluaran"
                      className="w-full h-auto max-h-72 object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
                    Tidak ada lampiran foto nota fisik.
                  </div>
                )}
                {selectedProofExpense.proofImageName && (
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    File: {selectedProofExpense.proofImageName}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedProofExpense(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
