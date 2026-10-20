import React from 'react';
import {
  DonationTransaction,
  ExpenseTransaction,
  calculatePSAK109,
  formatRupiah,
} from '../utils/finance';
import { FOUNDATION_INFO } from '../data/initialData';
import {
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  CheckCircle,
  Building,
  TrendingUp,
  Download,
} from 'lucide-react';

interface PSAK109ReportViewProps {
  donations: DonationTransaction[];
  expenses: ExpenseTransaction[];
  onExportCSV: () => void;
}

export const PSAK109ReportView: React.FC<PSAK109ReportViewProps> = ({
  donations,
  expenses,
  onExportCSV,
}) => {
  const report = calculatePSAK109(donations, expenses);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Screen Only */}
      <div className="no-print bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Laporan Keuangan Standar Syariah (PSAK 109)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Rekapitulasi resmi pemisahan dana Zakat, Infak, Sedekah, Wakaf, dan Amil sesuai standar akuntansi IAI (Ikatan Akuntan Indonesia) & BAZNAS.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Ekspor Excel (.CSV)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Report Document Body (Printable) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 text-slate-900 print-only-modal">
        {/* Kop Resmi Laporan */}
        <div className="border-b-2 border-emerald-900 pb-5 mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-lg">
              AZ
            </span>
            <div className="text-left">
              <h1 className="text-lg sm:text-xl font-black uppercase text-emerald-950 tracking-tight leading-none">
                {FOUNDATION_INFO.name}
              </h1>
              <p className="text-xs text-slate-600 font-medium">{FOUNDATION_INFO.tagline}</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
            {FOUNDATION_INFO.address} • Telp: {FOUNDATION_INFO.phone} • Email: {FOUNDATION_INFO.email}
          </p>
          <p className="text-[10px] text-emerald-800 font-semibold mt-1">
            {FOUNDATION_INFO.legalNumber} • {FOUNDATION_INFO.baznasReg}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200 inline-block px-6">
            <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
              LAPORAN PERUBAHAN DANA ZISWAF & POSISI KEUANGAN
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Periode Berjalan: Oktober 2026 (Format Standar PSAK 109)
            </p>
          </div>
        </div>

        {/* 1. Laporan Perubahan Dana Zakat */}
        <div className="mb-6">
          <h3 className="text-xs sm:text-sm font-black text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border-l-4 border-emerald-700 uppercase tracking-wide mb-3">
            I. LAPORAN PERUBAHAN DANA ZAKAT
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-200">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50/50 font-semibold">
                  <td className="py-2 px-3">Saldo Awal Dana Zakat</td>
                  <td className="py-2 px-3 text-right font-mono">Rp 0</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 pl-6 text-slate-700">Penerimaan Zakat Mal & Profesi Muzakki</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-700">
                    + {formatRupiah(report.totalPenerimaanZakat)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 pl-6 text-slate-700">Alokasi Hak Bagian Amil (Maks 1/8 atau 12.5%)</td>
                  <td className="py-2 px-3 text-right font-mono text-amber-700">
                    - {formatRupiah(Math.round(report.totalPenerimaanZakat * 0.125))}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 pl-6 text-slate-700">Penyaluran ke Asnaf Mustahik (Fakir, Miskin, Ibnu Sabil)</td>
                  <td className="py-2 px-3 text-right font-mono text-rose-700">
                    - {formatRupiah(report.totalPenyaluranZakat)}
                  </td>
                </tr>
                <tr className="bg-emerald-50/80 font-bold text-emerald-950">
                  <td className="py-2 px-3">Saldo Akhir Dana Zakat Tersedia</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-900">
                    {formatRupiah(report.saldoDanaZakat)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Laporan Perubahan Dana Infak / Sedekah */}
        <div className="mb-6">
          <h3 className="text-xs sm:text-sm font-black text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border-l-4 border-teal-700 uppercase tracking-wide mb-3">
            II. LAPORAN PERUBAHAN DANA INFAK & SEDEKAH
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-200">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50/50 font-semibold">
                  <td className="py-2 px-3">Saldo Awal Dana Infak/Sedekah</td>
                  <td className="py-2 px-3 text-right font-mono">Rp 0</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 pl-6 text-slate-700">Penerimaan Infak Terikat (Katalog Wishlist) & Sedekah Subuh</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-700">
                    + {formatRupiah(report.totalPenerimaanInfak)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 pl-6 text-slate-700">Alokasi Hak Kelola Amil (12.5%)</td>
                  <td className="py-2 px-3 text-right font-mono text-amber-700">
                    - {formatRupiah(Math.round(report.totalPenerimaanInfak * 0.125))}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 pl-6 text-slate-700">Penyaluran Pangan Santri & Bantuan Sosial</td>
                  <td className="py-2 px-3 text-right font-mono text-rose-700">
                    - {formatRupiah(report.totalPenyaluranInfak)}
                  </td>
                </tr>
                <tr className="bg-teal-50/80 font-bold text-teal-950">
                  <td className="py-2 px-3">Saldo Akhir Dana Infak & Sedekah</td>
                  <td className="py-2 px-3 text-right font-mono text-teal-900">
                    {formatRupiah(report.saldoDanaInfak)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Laporan Perubahan Dana Wakaf & Amil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-purple-950 bg-purple-50 px-3 py-1.5 rounded-lg border-l-4 border-purple-700 uppercase tracking-wide mb-2">
              III. DANA WAKAF
            </h3>
            <table className="w-full text-xs border border-slate-200">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-1.5 px-3">Penerimaan Wakaf</td>
                  <td className="py-1.5 px-3 text-right font-mono">{formatRupiah(report.totalPenerimaanWakaf)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">Penyaluran Fisik</td>
                  <td className="py-1.5 px-3 text-right font-mono">{formatRupiah(report.totalPenyaluranWakaf)}</td>
                </tr>
                <tr className="font-bold bg-purple-50">
                  <td className="py-1.5 px-3">Saldo Dana Wakaf</td>
                  <td className="py-1.5 px-3 text-right font-mono">{formatRupiah(report.saldoDanaWakaf)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-black text-amber-950 bg-amber-50 px-3 py-1.5 rounded-lg border-l-4 border-amber-700 uppercase tracking-wide mb-2">
              IV. DANA AMIL (OPERASIONAL)
            </h3>
            <table className="w-full text-xs border border-slate-200">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-1.5 px-3">Hak Bagian Amil</td>
                  <td className="py-1.5 px-3 text-right font-mono">{formatRupiah(report.totalBagianAmil)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">Beban Operasional Riil</td>
                  <td className="py-1.5 px-3 text-right font-mono text-rose-700">
                    - {formatRupiah(report.totalOperasionalAmil)}
                  </td>
                </tr>
                <tr className="font-bold bg-amber-50">
                  <td className="py-1.5 px-3">Sisa Kas Dana Amil</td>
                  <td className="py-1.5 px-3 text-right font-mono">{formatRupiah(report.saldoDanaAmil)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Rekapitulasi Posisi Saldo Kas Akhir */}
        <div className="p-4 bg-emerald-900 text-white rounded-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">
              TOTAL SALDO KAS TERSEDIA (NERACA PSAK 109)
            </span>
            <p className="text-[11px] text-emerald-200 mt-0.5">
              Akumulasi Saldo Zakat + Infak + Wakaf + Amil
            </p>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono">
            {formatRupiah(report.totalKasTersedia)}
          </div>
        </div>

        {/* Pengesahan Tanda Tangan */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <p className="text-slate-500">Disusun Oleh,</p>
            <p className="font-bold text-slate-800 mt-0.5">Bendahara Lembaga</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-xs font-serif italic text-slate-400">[Tanda Tangan Digital]</span>
            </div>
            <p className="font-bold text-emerald-950 underline decoration-slate-400">
              {FOUNDATION_INFO.treasurer}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Mengetahui & Menyetujui,</p>
            <p className="font-bold text-slate-800 mt-0.5">Ketua Yayasan</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-xs font-serif italic text-slate-400">[Tanda Tangan Digital]</span>
            </div>
            <p className="font-bold text-emerald-950 underline decoration-slate-400">
              {FOUNDATION_INFO.chairman}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
