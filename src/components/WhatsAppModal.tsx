import React, { useState } from 'react';
import { Share2, Copy, Check, X, Smartphone, MessageCircle } from 'lucide-react';
import { DonationTransaction, formatRupiah, terbilang } from '../utils/finance';
import { FOUNDATION_INFO } from '../data/initialData';

interface WhatsAppModalProps {
  transaction: DonationTransaction | null;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ transaction, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState(transaction?.donorPhone || '');

  if (!transaction) return null;

  // Clean phone number for wa.me link (convert 08xx to 628xx)
  const formatPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return cleaned;
  };

  const donorDisplayName = transaction.isAnonymous ? 'Hamba Allah' : transaction.donorName;

  const messageText = `*ASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH* 🤲

Yth. *${donorDisplayName}*,

Alhamdulillah, amanah donasi Anda telah kami terima dan tercatat secara sah di sistem keuangan *${FOUNDATION_INFO.name}*.

━━━━━━━━━━━━━━━━━━━━
📄 *BUKTI PENERIMAAN ZISWAF*
━━━━━━━━━━━━━━━━━━━━
• *No. Kuitansi* : ${transaction.receiptNumber}
• *Tanggal & Waktu* : ${transaction.date} WIB
• *Akad Donasi* : *${transaction.akad}*${transaction.wishlistTitle ? ` (${transaction.wishlistTitle})` : ''}
• *Nominal* : *${formatRupiah(transaction.amount)}*
• *Terbilang* : _${terbilang(transaction.amount)}_
• *Metode Bayar* : ${transaction.paymentMethod}
• *Status* : *LUNAS & TERVERIFIKASI*

*DOA MUSTAHIK & AMIL:*
_“Ajarakallahu fiima a’thaita, wa baaraka laka fiima abqaita, wa ja’alahu laka thahuuraa.”_
Semoga Allah SWT melipatgandakan pahala atas harta yang diinfaqkan, memberkahi rezeki keluarga yang tersisa, serta menjadikannya pembersih jiwa dan penolak bala. Aamiin ya Rabbal 'Alamin.

🔗 *Cek Transparansi Buku Kas & Kuitansi:*
Kuitansi digital ini dapat diverifikasi kapan saja melalui Buku Kas Publik kami di sistem *AmanahZIS*.

Jazakumullah Khairan Katsiran.
Wassalamu'alaikum Warahmatullahi Wabarakatuh.

_Salam Hangat, Pengurus & Santri_
*${FOUNDATION_INFO.name}*
${FOUNDATION_INFO.address}
📞 Layanan Konfirmasi: ${FOUNDATION_INFO.phone}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const targetWaNumber = formatPhoneNumber(customPhone);
  const waUrl = targetWaNumber
    ? `https://wa.me/${targetWaNumber}?text=${encodeURIComponent(messageText)}`
    : `https://wa.me/?text=${encodeURIComponent(messageText)}`;

  const handleSendWA = () => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 rounded-lg">
              <MessageCircle className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Notifikasi WhatsApp Otomatis</h3>
              <p className="text-xs text-emerald-200">Kirim ucapan terima kasih + tautan kuitansi sah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor WhatsApp Tujuan:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <span className="text-xs text-slate-500">
                Format: 08... / 628...
              </span>
            </div>
          </div>

          {/* WhatsApp Preview Bubble */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pratinjau Pesan Siap Kirim:
            </label>
            <div className="bg-[#e5ddd5] p-3 sm:p-4 rounded-xl border border-slate-300 max-h-64 overflow-y-auto">
              <div className="bg-white rounded-lg p-3.5 shadow-xs text-xs sm:text-[13px] text-slate-800 font-sans leading-relaxed whitespace-pre-wrap border-l-4 border-emerald-600">
                {messageText}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSendWA}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Buka Chat WhatsApp</span>
            </button>
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition border border-slate-300 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
