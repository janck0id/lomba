import React, { useMemo } from 'react';
import { DonationTransaction, ExpenseTransaction, formatRupiah } from '../utils/finance';
import { TrendingUp, TrendingDown, Wallet, PieChart, ShieldCheck } from 'lucide-react';

interface PublicSummaryChartProps {
  donations: DonationTransaction[];
  expenses: ExpenseTransaction[];
  onOpenDonate: () => void;
  onOpenZakatCalc: () => void;
}

export const PublicSummaryChart: React.FC<PublicSummaryChartProps> = ({
  donations,
  expenses,
  onOpenDonate,
  onOpenZakatCalc,
}) => {
  // Aggregate stats
  const { totalIn, totalOut, currentBalance, akadBreakdown } = useMemo(() => {
    let tIn = 0;
    const breakdown: Record<string, number> = {
      'Zakat Mal': 0,
      'Zakat Fitrah': 0,
      'Infak Terikat': 0,
      'Sedekah Subuh': 0,
      'Wakaf Produktif': 0,
    };

    donations.forEach((d) => {
      tIn += d.amount;
      const key = d.akad in breakdown ? d.akad : 'Sedekah Subuh';
      breakdown[key] = (breakdown[key] || 0) + d.amount;
    });

    let tOut = 0;
    expenses.forEach((e) => {
      if (e.status === 'Disetujui') {
        tOut += e.amount;
      }
    });

    return {
      totalIn: tIn,
      totalOut: tOut,
      currentBalance: Math.max(0, tIn - tOut),
      akadBreakdown: breakdown,
    };
  }, [donations, expenses]);

  // Color mapping
  const colorMap: Record<string, { bg: string; fill: string; hex: string; text: string }> = {
    'Zakat Mal': { bg: 'bg-emerald-500', fill: '#10b981', hex: '#10b981', text: 'text-emerald-700' },
    'Zakat Fitrah': { bg: 'bg-teal-500', fill: '#14b8a6', hex: '#14b8a6', text: 'text-teal-700' },
    'Infak Terikat': { bg: 'bg-amber-500', fill: '#f59e0b', hex: '#f59e0b', text: 'text-amber-700' },
    'Sedekah Subuh': { bg: 'bg-blue-500', fill: '#3b82f6', hex: '#3b82f6', text: 'text-blue-700' },
    'Wakaf Produktif': { bg: 'bg-purple-500', fill: '#8b5cf6', hex: '#8b5cf6', text: 'text-purple-700' },
  };

  // Build SVG Doughnut paths
  const chartItems = useMemo(() => {
    const total = totalIn || 1;
    let accumulatedAngle = 0;
    const radius = 64;
    const strokeWidth = 26;
    const center = 85;

    return Object.entries(akadBreakdown).map(([name, val]) => {
      const percentage = (val / total) * 100;
      const angle = (val / total) * 360;
      const startAngle = accumulatedAngle;
      accumulatedAngle += angle;

      // Arc calculation for strokeDasharray
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - (circumference * percentage) / 100;

      return {
        name,
        value: val,
        percentage: percentage.toFixed(1),
        circumference,
        strokeDashoffset,
        color: colorMap[name] || colorMap['Sedekah Subuh'],
        startAngle,
      };
    });
  }, [akadBreakdown, totalIn]);

  // Cumulative offset for SVG doughnut rendering
  let currentOffset = 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Transparan & Real-Time
            </span>
            <span className="text-xs text-slate-500">Update Tiap Transaksi Masuk</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Ringkasan Keuangan ZISWAF
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Laporan keterbukaan dana amanah ummah yang dikelola yayasan secara syariah dan akuntabel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenDonate}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm shadow-sm transition transform active:scale-98 cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>Tunaikan Donasi / ZISWAF</span>
          </button>
          <button
            onClick={onOpenZakatCalc}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-medium text-sm transition cursor-pointer"
          >
            <span>Kalkulator Zakat</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {/* Saldo Kas Riil */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-xl p-5 relative overflow-hidden shadow-xs">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold">
            <span>TOTAL SALDO KAS TERSEDIA</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            {formatRupiah(currentBalance)}
          </p>
          <p className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1">
            <span>● Kas aktif di Bank Syariah & Kasir Yayasan</span>
          </p>
        </div>

        {/* Total Penerimaan */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>TOTAL PENERIMAAN MASUK</span>
            <div className="p-1.5 bg-emerald-100 rounded-md">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-800 mt-2 tracking-tight">
            {formatRupiah(totalIn)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Dari {donations.length} transaksi donasi terverifikasi
          </p>
        </div>

        {/* Total Penyaluran */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>TOTAL DANA TERSALURKAN</span>
            <div className="p-1.5 bg-rose-100 rounded-md">
              <TrendingDown className="w-4 h-4 text-rose-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-800 mt-2 tracking-tight">
            {formatRupiah(totalOut)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Untuk operasional, makan santri, & santunan
          </p>
        </div>
      </div>

      {/* Visual Doughnut Chart & Akad Breakdown */}
      <div className="mt-7 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-emerald-700" />
          <h3 className="font-bold text-slate-900 text-sm">
            Rasio Donasi Masuk Berdasarkan Akad Syariah
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* SVG Doughnut */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-3">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 170 170">
                {/* Background Ring */}
                <circle
                  cx="85"
                  cy="85"
                  r="64"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="24"
                />
                {/* Slices */}
                {chartItems.map((slice, i) => {
                  const circleCircumference = 2 * Math.PI * 64;
                  const sliceLength = (slice.value / (totalIn || 1)) * circleCircumference;
                  const offset = currentOffset;
                  currentOffset += sliceLength;

                  return (
                    <circle
                      key={i}
                      cx="85"
                      cy="85"
                      r="64"
                      fill="transparent"
                      stroke={slice.color.hex}
                      strokeWidth="24"
                      strokeDasharray={`${sliceLength} ${circleCircumference - sliceLength}`}
                      strokeDashoffset={-offset}
                      className="transition-all duration-700 ease-out hover:opacity-85"
                    />
                  );
                })}
              </svg>
              {/* Inner Circle Label */}
              <div className="absolute text-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Proporsi
                </span>
                <span className="text-sm font-black text-slate-800">
                  ZISWAF
                </span>
                <span className="text-[9px] text-emerald-700 font-medium block">
                  100% Amanah
                </span>
              </div>
            </div>
          </div>

          {/* Legend and Value List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color.hex }}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {formatRupiah(item.value)}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
