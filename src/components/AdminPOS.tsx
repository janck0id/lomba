import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AkadType,
  PaymentMethod,
  DonationTransaction,
  WishlistItem,
  formatRupiah,
} from '../utils/finance';
import {
  Calculator,
  User,
  Phone,
  Banknote,
  Sparkles,
  Printer,
  Share2,
  CheckCircle,
  HelpCircle,
  Clock,
} from 'lucide-react';

interface AdminPOSProps {
  wishlist: WishlistItem[];
  onAddDonation: (data: Omit<DonationTransaction, 'id' | 'receiptNumber' | 'date' | 'status'>) => DonationTransaction;
  onOpenReceipt: (tx: DonationTransaction) => void;
  onOpenWhatsApp: (tx: DonationTransaction) => void;
  currentUserRole: string;
}

export const AdminPOS: React.FC<AdminPOSProps> = ({
  wishlist,
  onAddDonation,
  onOpenReceipt,
  onOpenWhatsApp,
  currentUserRole,
}) => {
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorPhone, setDonorPhone] = useState('');
  const [amount, setAmount] = useState<number>(100000);
  const [customAmountStr, setCustomAmountStr] = useState('100000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [akad, setAkad] = useState<AkadType>('Sedekah Subuh');
  const [selectedWishlistId, setSelectedWishlistId] = useState<string>('');
  const [notes, setNotes] = useState('');

  const [lastSubmittedTx, setLastSubmittedTx] = useState<DonationTransaction | null>(null);

  const quickAmounts = [25000, 50000, 100000, 200000, 500000, 1000000, 2500000];

  const handleSelectAmount = (val: number) => {
    setAmount(val);
    setCustomAmountStr(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountStr(val);
    setAmount(Number(val) || 0);
  };

  const handleToggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
    if (!isAnonymous) {
      setDonorName('Hamba Allah');
    } else {
      setDonorName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const matchedWishlist = wishlist.find((w) => w.id === selectedWishlistId);

    const newTx = onAddDonation({
      donorName: isAnonymous ? 'Hamba Allah' : donorName || 'Hamba Allah',
      donorPhone,
      isAnonymous,
      amount,
      akad,
      paymentMethod,
      wishlistId: matchedWishlist?.id,
      wishlistTitle: matchedWishlist?.title,
      notes,
      enteredBy: currentUserRole,
    });

    setLastSubmittedTx(newTx);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleResetForNext = () => {
    setLastSubmittedTx(null);
    setDonorName('');
    setIsAnonymous(false);
    setDonorPhone('');
    setAmount(100000);
    setCustomAmountStr('100000');
    setNotes('');
    setSelectedWishlistId('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-800 text-emerald-100 rounded-lg">
                <Calculator className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Kasir Cepat POS ZISWAF (Penerimaan Donasi)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Input donasi langsung di loket yayasan dengan otomatisasi kuitansi sah & notifikasi WhatsApp ke donatur.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold self-start sm:self-auto">
            Petugas: {currentUserRole}
          </span>
        </div>
      </div>

      {lastSubmittedTx ? (
        /* Success Card with Action Buttons */
        <div className="bg-emerald-950 text-white rounded-2xl shadow-xl p-6 sm:p-8 border border-emerald-800 text-center space-y-5 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-500 text-emerald-950 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 bg-emerald-800/80 text-emerald-300 rounded-full text-xs font-mono font-bold">
              No. Kuitansi: {lastSubmittedTx.receiptNumber}
            </span>
            <h3 className="text-2xl font-black mt-2">
              Donasi Berhasil Dicatat & Masuk Kas!
            </h3>
            <p className="text-emerald-200 text-sm mt-1">
              {lastSubmittedTx.isAnonymous ? 'Hamba Allah' : lastSubmittedTx.donorName} •{' '}
              <strong className="text-white">{formatRupiah(lastSubmittedTx.amount)}</strong> (
              {lastSubmittedTx.akad})
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenReceipt(lastSubmittedTx)}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kuitansi Digital (PDF)</span>
            </button>

            <button
              onClick={() => onOpenWhatsApp(lastSubmittedTx)}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim Notifikasi WhatsApp</span>
            </button>

            <button
              onClick={handleResetForNext}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-sm border border-slate-700 transition cursor-pointer"
            >
              + Transaksi Baru
            </button>
          </div>
        </div>
      ) : (
        /* POS Input Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* 1. Donor Information */}
          <div className="space-y-3 pb-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>1. Data Donatur</span>
              </label>
              <button
                type="button"
                onClick={handleToggleAnonymous}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                  isAnonymous
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isAnonymous ? '✓ Mode Anonim Aktif' : '+ Set Hamba Allah (Anonim)'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Donatur:
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Nama Lengkap Donatur..."
                  disabled={isAnonymous}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Nomor WhatsApp (Untuk kirim kuitansi):</span>
                  <span className="text-[11px] text-slate-400 font-normal">Opsional</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="Contoh: 081288990011"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Amount and Quick Presets */}
          <div className="space-y-3 pb-5 border-b border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-emerald-700" />
              <span>2. Nominal Donasi</span>
            </label>

            {/* Quick Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectAmount(val)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    amount === val
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {formatRupiah(val).replace(',00', '')}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="relative mt-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-base">
                Rp
              </span>
              <input
                type="text"
                required
                value={customAmountStr}
                onChange={handleCustomAmountChange}
                placeholder="Ketik nominal..."
                className="w-full pl-12 pr-4 py-3 text-lg font-black text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 3. Akad Syariah & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                3. Pilihan Akad Syariah
              </label>
              <select
                value={akad}
                onChange={(e) => setAkad(e.target.value as AkadType)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Sedekah Subuh">Sedekah Subuh / Harian</option>
                <option value="Zakat Mal">Zakat Mal (Harta & Simpanan)</option>
                <option value="Zakat Fitrah">Zakat Fitrah</option>
                <option value="Infak Terikat">Infak Terikat (Kebutuhan Spesifik)</option>
                <option value="Wakaf Produktif">Wakaf Produktif / Sarana</option>
                <option value="Fidyah">Fidyah / Kafarat Puasa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                4. Metode Pembayaran Kasir
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Tunai">Tunai / Uang Pas di Loket</option>
                <option value="QRIS">QRIS Statis / Dinamis</option>
                <option value="Transfer BSI">Transfer Bank BSI</option>
                <option value="Transfer Bank Lain">Transfer Bank Lain</option>
              </select>
            </div>
          </div>

          {/* 5. Alokasi Wishlist (Optional) & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alokasi ke Kebutuhan Spesifik (Opsional):
              </label>
              <select
                value={selectedWishlistId}
                onChange={(e) => setSelectedWishlistId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Umum / Tanpa Alokasi Tertentu --</option>
                {wishlist.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.title} ({formatRupiah(w.targetAmount - w.collectedAmount)} lagi)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan / Doa Donatur:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Titipan doa atau hajat keluarga..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Recitation Guide / Akad Syariah Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Lafaz Ijab Qabul Amil Kasir:</p>
              <p className="italic text-emerald-900 mt-0.5">
                &quot;Bismillah, kami terima donasi {akad} sebesar {formatRupiah(amount)} dari Bapak/Ibu {isAnonymous ? 'Hamba Allah' : donorName || 'Donatur'}. Semoga Allah menerima dan memberkahi.&quot;
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-base shadow-md transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-emerald-300" />
            <span>Simpan Donasi & Terbitkan Kuitansi Sah</span>
          </button>
        </form>
      )}
    </div>
  );
};
