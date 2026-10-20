import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, Share2, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { DonationTransaction, formatRupiah, terbilang } from '../utils/finance';
import { FOUNDATION_INFO } from '../data/initialData';

interface ReceiptModalProps {
  transaction: DonationTransaction | null;
  onClose: () => void;
  onOpenWhatsApp: (tx: DonationTransaction) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
  onOpenWhatsApp,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (!transaction) return;

    // Generate valid verification QR code containing verified transaction details
    const verifyPayload = JSON.stringify({
      app: 'AmanahZIS',
      org: FOUNDATION_INFO.name,
      receipt: transaction.receiptNumber,
      donor: transaction.isAnonymous ? 'Hamba Allah' : transaction.donorName,
      amount: transaction.amount,
      akad: transaction.akad,
      date: transaction.date,
      verified: true,
    });

    QRCode.toDataURL(verifyPayload, {
      width: 180,
      margin: 1,
      color: {
        dark: '#064e3b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Error generating QR', err));
  }, [transaction]);

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Action Header (Excluded from Print) */}
        <div className="no-print bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Bukti Setor & Kuitansi Digital Resmi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition cursor-pointer"
              title="Cetak Kuitansi atau Simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={() => onOpenWhatsApp(transaction)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition cursor-pointer"
              title="Kirim ke WhatsApp Donatur"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
              aria-label="Tutup kuitansi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="overflow-y-auto p-6 sm:p-8 bg-amber-50/20 text-slate-800 print-only-modal">
          {/* Receipt Border Frame */}
          <div className="border-2 border-emerald-900/40 rounded-xl p-6 bg-white shadow-xs relative">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <span className="text-8xl font-black font-arabic text-emerald-950">أمانة</span>
            </div>

            {/* Header / Kop Yayasan */}
            <div className="border-b-2 border-emerald-800/80 pb-4 mb-4 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
                      AZ
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-emerald-950 tracking-tight leading-tight uppercase">
                        {FOUNDATION_INFO.name}
                      </h2>
                      <p className="text-xs text-slate-600">{FOUNDATION_INFO.tagline}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-md leading-relaxed">
                    {FOUNDATION_INFO.address} • Telp: {FOUNDATION_INFO.phone}
                  </p>
                  <p className="text-[10px] text-emerald-800 font-medium">
                    {FOUNDATION_INFO.legalNumber} • {FOUNDATION_INFO.baznasReg}
                  </p>
                </div>

                <div className="text-right sm:text-right border sm:border-0 border-emerald-200 p-2 sm:p-0 rounded-lg bg-emerald-50/40 sm:bg-transparent">
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-800 text-white text-[11px] font-bold rounded uppercase tracking-wider mb-1">
                    BUKTI SETOR ZISWAF
                  </span>
                  <p className="text-xs font-mono font-bold text-emerald-950">
                    No: {transaction.receiptNumber}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tgl: {transaction.date} WIB
                  </p>
                </div>
              </div>
            </div>

            {/* Receipt Table Items */}
            <div className="space-y-3.5 text-xs sm:text-sm my-5">
              <div className="flex flex-col sm:flex-row sm:items-start py-1.5 border-b border-dashed border-slate-200">
                <span className="w-36 text-slate-500 font-medium shrink-0">Telah Diterima Dari</span>
                <span className="font-bold text-emerald-950 text-base">
                  : {transaction.isAnonymous ? 'Hamba Allah (Anonim)' : transaction.donorName}
                  {transaction.donorPhone && (
                    <span className="text-xs text-slate-500 font-normal ml-2">
                      ({transaction.donorPhone})
                    </span>
                  )}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start py-1.5 border-b border-dashed border-slate-200">
                <span className="w-36 text-slate-500 font-medium shrink-0">Akad Syariah</span>
                <span className="font-semibold text-slate-800">
                  : <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold text-xs">{transaction.akad}</span>
                  {transaction.wishlistTitle && (
                    <span className="text-xs text-slate-600 block sm:inline sm:ml-2 font-normal">
                      (Alokasi Program: <strong>{transaction.wishlistTitle}</strong>)
                    </span>
                  )}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start py-1.5 border-b border-dashed border-slate-200">
                <span className="w-36 text-slate-500 font-medium shrink-0">Metode Penyetoran</span>
                <span className="font-medium text-slate-800">
                  : {transaction.paymentMethod} • Status: <strong className="text-emerald-700">Lunas & Sah</strong>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start py-1.5 border-b border-dashed border-slate-200">
                <span className="w-36 text-slate-500 font-medium shrink-0">Uang Sejumlah</span>
                <span className="font-bold text-emerald-900 text-lg">
                  : {formatRupiah(transaction.amount)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start py-2 bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
                <span className="w-36 text-emerald-900 font-semibold shrink-0">Terbilang</span>
                <span className="font-semibold italic text-emerald-950">
                  # {terbilang(transaction.amount)} #
                </span>
              </div>

              {transaction.notes && (
                <div className="flex flex-col sm:flex-row sm:items-start py-1 border-b border-dashed border-slate-200">
                  <span className="w-36 text-slate-500 font-medium shrink-0">Catatan / Doa Donatur</span>
                  <span className="text-slate-700 italic">
                    : &ldquo;{transaction.notes}&rdquo;
                  </span>
                </div>
              )}
            </div>

            {/* Doa Akad Syariah & Stamp + Signatures */}
            <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code Verifikasi Kuitansi"
                    className="w-24 h-24 object-contain shadow-xs bg-white p-1 rounded"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-200 animate-pulse rounded" />
                )}
                <span className="text-[10px] text-slate-500 mt-1 font-mono">
                  Scan Validasi Resmi
                </span>
              </div>

              <div className="sm:col-span-8 flex flex-col justify-between text-right">
                <div className="text-left bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/60 mb-3">
                  <p className="font-arabic text-emerald-950 text-sm leading-relaxed text-center" dir="rtl">
                    آجَرَكَ اللهُ فِيْمَا أَعْطَيْتَ، وَبَارَكَ لَكَ فِيْمَا أَبْقَيْتَ، وَجَعَلَهُ لَكَ طَهُوْرًا
                  </p>
                  <p className="text-[10px] text-slate-600 text-center italic mt-1">
                    &quot;Semoga Allah memberi pahala atas apa yang engkau berikan, memberkahi apa yang tersisa, dan menjadikannya pembersih bagimu.&quot;
                  </p>
                </div>

                <div className="flex justify-between items-end pt-1">
                  <div className="text-left">
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-emerald-700" />
                      TERVERIFIKASI SISTEM
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Petugas Kasir: {transaction.enteredBy}</p>
                  </div>

                  <div className="text-center min-w-[140px]">
                    <p className="text-[11px] text-slate-600">Depok, {transaction.date.split(' ')[0]}</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">Bendahara Yayasan</p>
                    <div className="my-2 relative flex items-center justify-center">
                      <div className="border border-emerald-600 text-emerald-800 font-serif font-black text-[11px] px-2 py-1 rounded-sm rotate-[-8deg] opacity-85 uppercase tracking-wider">
                        ★ LUNAS & SAH ★<br/>
                        <span className="text-[9px] font-sans font-normal">YYS AMANAH BINA UMMAH</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-emerald-950 underline decoration-slate-400 underline-offset-2">
                      {FOUNDATION_INFO.treasurer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="no-print bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Kuitansi ini dibuat secara otomatis dan sah secara hukum & syariah.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
