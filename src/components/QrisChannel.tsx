import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { FOUNDATION_INFO } from '../data/initialData';
import { formatRupiah, PaymentMethod, AkadType } from '../utils/finance';
import {
  QrCode,
  Copy,
  Check,
  Download,
  Smartphone,
  CreditCard,
  Building,
  HelpCircle,
  Send,
  Sparkles,
} from 'lucide-react';

interface QrisChannelProps {
  onConfirmDonation: (data: {
    donorName: string;
    donorPhone: string;
    isAnonymous: boolean;
    amount: number;
    akad: AkadType;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => void;
  presetAmount?: number;
  presetAkad?: AkadType;
  presetNote?: string;
}

export const QrisChannel: React.FC<QrisChannelProps> = ({
  onConfirmDonation,
  presetAmount,
  presetAkad,
  presetNote,
}) => {
  const [amount, setAmount] = useState<number>(presetAmount || 100000);
  const [akad, setAkad] = useState<AkadType>(presetAkad || 'Sedekah Subuh');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [notes, setNotes] = useState(presetNote || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate QRIS QR code
  useEffect(() => {
    // We compose the QRIS payload containing the nominal if dynamic
    const payload = `${FOUNDATION_INFO.qrisPayload}|NOMINAL=${amount}|AKAD=${akad}|REF=${Date.now()}`;
    QRCode.toDataURL(payload, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [amount, akad]);

  const handleCopyAccount = (num: string, bank: string) => {
    navigator.clipboard.writeText(num);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QRIS_${FOUNDATION_INFO.name.replace(/\s+/g, '_')}_${amount}.png`;
    link.click();
  };

  const handleSubmitConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    onConfirmDonation({
      donorName: isAnonymous ? 'Hamba Allah' : donorName || 'Hamba Allah',
      donorPhone,
      isAnonymous,
      amount,
      akad,
      paymentMethod,
      notes,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDonorName('');
      setDonorPhone('');
      setNotes('');
    }, 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <QrCode className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Kanal Donasi Digital & QRIS Nasional
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Berdonasi semudah memindai QR code dari aplikasi mobile banking apa pun (BYOND BSI, BRImo, Livin&apos;, DANA, GoPay, OVO, ShopeePay).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive QRIS Code Scanner */}
        <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              QRIS DINAMIS STANDAR BI
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
              NMID: ID1020038910
            </span>
          </div>

          {/* Preset Buttons for Quick Amount */}
          <div className="w-full mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-2 text-left">
              Pilih / Ketik Nominal Donasi:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
              {[25000, 50000, 100000, 250000, 500000, 1000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    amount === val
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {formatRupiah(val)}
                </button>
              ))}
            </div>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                Rp
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={10000}
                step={5000}
                className="w-full pl-9 pr-3 py-2 text-sm font-bold text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* QR Code Graphic Frame */}
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm relative group my-2">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QRIS Donasi Yayasan"
                className="w-56 h-56 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
                Membuat QR Code...
              </div>
            )}
            <div className="mt-2 text-center">
              <p className="text-xs font-bold text-slate-900 uppercase">
                {FOUNDATION_INFO.name}
              </p>
              <p className="text-[11px] text-emerald-800 font-bold">
                Nominal: {formatRupiah(amount)}
              </p>
            </div>
          </div>

          {/* Download & Copy QR */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleDownloadQR}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Gambar QRIS</span>
            </button>
          </div>

          {/* Supported Apps Logos & Badges */}
          <div className="mt-5 pt-4 border-t border-slate-100 w-full text-left">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">
              Bisa di-scan dari seluruh aplikasi berikut:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'BYOND BSI',
                'BRImo',
                'Livin’ Mandiri',
                'BCA Mobile',
                'Muamalat DIN',
                'DANA',
                'GoPay',
                'OVO',
                'ShopeePay',
              ].map((app) => (
                <span
                  key={app}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-[10px] font-medium"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Bank Syariah Accounts & Transfer Confirmation */}
        <div className="lg:col-span-6 space-y-5">
          {/* Bank Syariah Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Building className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Rekening Resmi Bank Syariah Yayasan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Silakan transfer langsung ke rekening resmi lembaga atas nama <strong>{FOUNDATION_INFO.name}</strong>:
            </p>

            <div className="space-y-3">
              {FOUNDATION_INFO.bankAccounts.map((acc) => (
                <div
                  key={acc.number}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-emerald-950">
                        {acc.bank}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        {acc.badge}
                      </span>
                    </div>
                    <p className="font-mono font-bold text-base text-slate-900 mt-1 tracking-wider">
                      {acc.number}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      a.n. {acc.holder}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyAccount(acc.number, acc.bank)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                  >
                    {copiedBank === acc.bank ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin No.</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Konfirmasi Donasi Mandiri */}
          <div className="bg-emerald-900 text-white rounded-2xl shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <h3 className="font-bold text-base">Konfirmasi Donasi Mandiri</h3>
            </div>
            <p className="text-xs text-emerald-200/90 mb-4">
              Sudah transfer atau scan QRIS? Masukkan data di bawah agar kuitansi langsung terbit dan tercatat di Buku Kas Publik.
            </p>

            {isSubmitted ? (
              <div className="p-4 bg-emerald-800/90 rounded-xl border border-emerald-600 text-center space-y-1">
                <Check className="w-8 h-8 text-emerald-300 mx-auto" />
                <p className="font-bold text-sm text-white">Alhamdulillah, Donasi Diterima!</p>
                <p className="text-xs text-emerald-200">
                  Data telah masuk ke Buku Kas Transparan dan kuitansi digital telah diterbitkan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitConfirmation} className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-emerald-100">
                      Nama Donatur:
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-emerald-200">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-0"
                      />
                      <span>Sembunyikan Nama (Hamba Allah)</span>
                    </label>
                  </div>
                  {!isAnonymous && (
                    <input
                      type="text"
                      required={!isAnonymous}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Nama lengkap Anda..."
                      className="w-full px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-white placeholder-emerald-400/60 focus:ring-2 focus:ring-emerald-400"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-emerald-100 block mb-1">
                      No. WhatsApp (Untuk Kuitansi):
                    </label>
                    <input
                      type="text"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="0812xxxxxxx"
                      className="w-full px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-white placeholder-emerald-400/60 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-emerald-100 block mb-1">
                      Metode Pembayaran:
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-white focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="QRIS" className="bg-slate-900">QRIS All Payment</option>
                      <option value="Transfer BSI" className="bg-slate-900">Transfer BSI</option>
                      <option value="Transfer Bank Lain" className="bg-slate-900">Transfer Bank Lain</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-emerald-100 block mb-1">
                      Pilihan Akad:
                    </label>
                    <select
                      value={akad}
                      onChange={(e) => setAkad(e.target.value as AkadType)}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-white focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="Sedekah Subuh" className="bg-slate-900">Sedekah Subuh</option>
                      <option value="Zakat Mal" className="bg-slate-900">Zakat Mal</option>
                      <option value="Zakat Fitrah" className="bg-slate-900">Zakat Fitrah</option>
                      <option value="Infak Terikat" className="bg-slate-900">Infak Terikat (Kebutuhan)</option>
                      <option value="Wakaf Produktif" className="bg-slate-900">Wakaf Produktif</option>
                      <option value="Fidyah" className="bg-slate-900">Fidyah / Kafarat</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-emerald-100 block mb-1">
                      Nominal Donasi (Rp):
                    </label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-white font-bold focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-emerald-100 block mb-1">
                    Catatan / Doa Kebaikan:
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Mohon doa kelancaran ujian anak & kesehatan orang tua"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-white placeholder-emerald-400/60 focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Konfirmasi & Terbitkan Kuitansi</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
