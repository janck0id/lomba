import React, { useState } from 'react';
import {
  ExpenseTransaction,
  ExpenseCategory,
  formatRupiah,
} from '../utils/finance';
import {
  Receipt,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  ShieldAlert,
  Image as ImageIcon,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminExpenseProps {
  expenses: ExpenseTransaction[];
  onAddExpense: (data: Omit<ExpenseTransaction, 'id' | 'status'>) => void;
  onApproveExpense: (id: string, approverName: string) => void;
  onRejectExpense: (id: string) => void;
  currentUserRole: string; // 'Bendahara' | 'Ketua / Pembina'
}

export const AdminExpense: React.FC<AdminExpenseProps> = ({
  expenses,
  onAddExpense,
  onApproveExpense,
  onRejectExpense,
  currentUserRole,
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<number>(350000);
  const [category, setCategory] = useState<ExpenseCategory>('Bahan Pangan');
  const [description, setDescription] = useState('');
  const [asnafTarget, setAsnafTarget] = useState('Fakir / Miskin');
  const [proofImageName, setProofImageName] = useState('nota_belanja.jpg');
  const [proofImageUrl, setProofImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const isKetuaOrPembina = currentUserRole.toLowerCase().includes('ketua') || currentUserRole.toLowerCase().includes('pembina');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProofImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !recipient) return;

    onAddExpense({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      amount,
      category,
      recipient,
      description,
      proofImageName,
      proofImageUrl,
      enteredBy: currentUserRole,
      asnafTarget,
    });

    setIsSuccess(true);
    setRecipient('');
    setDescription('');
    setTimeout(() => setIsSuccess(false), 3000);
  };

  // Pending expenses requiring approval (> Rp 1.000.000)
  const pendingExpenses = expenses.filter((e) => e.status === 'Menunggu Persetujuan');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                <Receipt className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Pencatatan Kas Keluar & Upload Bukti Nota
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Catat pengeluaran riil lembaga dan lampirkan kuitansi fisik untuk keperluan audit internal & syariah.
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold self-start sm:self-auto border border-slate-200">
            Akses: {currentUserRole}
          </span>
        </div>
      </div>

      {/* Role-Based Approval Panel for Ketua / Pembina */}
      {pendingExpenses.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <h3 className="font-bold text-amber-950 text-base">
              Persetujuan Kas Keluar Berskala Besar (&gt; Rp1.000.000)
            </h3>
          </div>
          <p className="text-xs text-amber-800 mb-4">
            Sistem pengawasan dual-control (Role-Based Access): Pengeluaran di atas Rp1.000.000 memerlukan persetujuan Ketua/Pembina sebelum sah masuk pembukuan.
          </p>

          <div className="space-y-3">
            {pendingExpenses.map((pe) => (
              <div
                key={pe.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{pe.recipient}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                      {formatRupiah(pe.amount)}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">[{pe.category}]</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{pe.description}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Dicatat oleh: {pe.enteredBy} • Tgl: {pe.date}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isKetuaOrPembina ? (
                    <>
                      <button
                        onClick={() => onApproveExpense(pe.id, currentUserRole)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Setujui (Approval)</span>
                      </button>
                      <button
                        onClick={() => onRejectExpense(pe.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-semibold transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Tolak</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Menunggu Ketua Yayasan
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense Input Form & Receipt Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4"
        >
          <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
            Formulir Pengeluaran Kas
          </h3>

          {isSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Pengeluaran berhasil dicatat ke sistem!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Penerima Dana / Nama Toko / Vendor:
            </label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Contoh: Toko Beras Berkah, PLN Prabayar, Guru Ngaji..."
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Pengeluaran:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Bahan Pangan">Bahan Pangan & Dapur Asrama</option>
                <option value="Operasional">Operasional (Listrik, Air, Wifi, ATK)</option>
                <option value="Pendidikan Anak Asuh">Pendidikan & SPP Santri</option>
                <option value="Santunan Dhuafa">Santunan Dhuafa & Lansia</option>
                <option value="Kesehatan & Medis">Kesehatan & Pengobatan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sasaran Asnaf ZISWAF:
              </label>
              <select
                value={asnafTarget}
                onChange={(e) => setAsnafTarget(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Fakir / Miskin">Fakir / Miskin</option>
                <option value="Fisabilillah">Fisabilillah</option>
                <option value="Ibnu Sabil">Ibnu Sabil (Penuntut Ilmu)</option>
                <option value="Gharimin">Gharimin</option>
                <option value="Amil">Amil (Operasional Pengelola)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nominal Pengeluaran (Rp):
            </label>
            <input
              type="number"
              required
              min={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-base font-bold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
            {amount > 1000000 && (
              <p className="text-[11px] text-amber-700 font-medium mt-1">
                * Nominal &gt; Rp1.000.000 akan otomatis membutuhkan persetujuan Ketua Yayasan.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rincian Keterangan Pengeluaran:
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kebutuhan pembelian atau penerima santunan..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unggah Foto Nota / Kuitansi Fisik:
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 cursor-pointer transition">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Pilih Foto Nota</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-500 font-mono truncate">
                {proofImageName}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-sm shadow-sm transition cursor-pointer mt-2"
          >
            Simpan Pengeluaran Kas
          </button>
        </form>

        {/* Right Preview */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Pratinjau Bukti Fisik Terlampir
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Foto bukti kuitansi toko atau nota pembelian untuk transparansi pemeriksa:
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-2 bg-slate-50 flex items-center justify-center min-h-[220px]">
              {proofImageUrl ? (
                <img
                  src={proofImageUrl}
                  alt="Bukti Nota"
                  className="max-h-64 w-auto object-contain rounded-lg shadow-2xs"
                />
              ) : (
                <div className="text-center text-slate-400 text-xs">
                  Belum ada nota yang diunggah
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
            <p className="font-semibold text-slate-900 mb-1">Standar Audit PSAK 109:</p>
            <p className="text-[11px] leading-relaxed">
              Seluruh pos pengeluaran tercatat dalam Laporan Perubahan Dana dan dipertanggungjawabkan pada rapat pengurus tahunan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
