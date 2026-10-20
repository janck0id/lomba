import React from 'react';
import { FOUNDATION_INFO } from '../data/initialData';
import {
  ShieldCheck,
  UserCheck,
  Calculator,
  LayoutDashboard,
  FileText,
  Target,
  QrCode,
  Image as ImageIcon,
  Receipt,
  Users,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';

export type NavTab =
  | 'OVERVIEW'
  | 'LEDGER'
  | 'WISHLIST'
  | 'QRIS'
  | 'GALLERY'
  | 'POS'
  | 'EXPENSES'
  | 'DATABASE'
  | 'REPORTS';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUserRole: string;
  onChangeRole: (role: string) => void;
  onOpenZakatCalc: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUserRole,
  onChangeRole,
  onOpenZakatCalc,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Bar: Foundation Legality & Role Switcher */}
      <div className="bg-emerald-950 text-emerald-100 px-4 sm:px-8 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-emerald-900/60">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">{FOUNDATION_INFO.name}</span>
          <span className="hidden md:inline text-emerald-300/80">•</span>
          <span className="hidden md:inline text-emerald-300/80">{FOUNDATION_INFO.legalNumber}</span>
        </div>

        {/* Role Switcher Pill */}
        <div className="flex items-center gap-2">
          <span className="text-emerald-300 text-[11px] font-medium flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Mode Peran:
          </span>
          <select
            value={currentUserRole}
            onChange={(e) => onChangeRole(e.target.value)}
            className="bg-emerald-900 border border-emerald-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-400 cursor-pointer"
          >
            <option value="Masyarakat / Donatur">Masyarakat / Donatur (Publik)</option>
            <option value="Nurul Hidayat (Bendahara)">Nurul Hidayat (Bendahara - Kasir)</option>
            <option value="H. Muhammad Irfan, Lc. (Ketua)">H. Muhammad Irfan, Lc. (Ketua Yayasan)</option>
          </select>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div
            onClick={() => onSelectTab('OVERVIEW')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-900 to-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-emerald-900/20">
              AZ
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-lg tracking-tight">
                  Amanah<span className="text-emerald-700">ZIS</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  SYLS 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
                Transparansi & Kasir ZISWAF Yayasan
              </p>
            </div>
          </div>

          {/* Quick Zakat Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenZakatCalc}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 transition cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
              <span>Kalkulator Zakat</span>
            </button>
            <button
              onClick={() => onSelectTab('QRIS')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QRIS Donasi</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Links (Scrollable on mobile) */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold text-slate-600 border-t border-slate-100 pt-1">
          {/* Public Views */}
          <button
            onClick={() => onSelectTab('OVERVIEW')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'bg-emerald-50 text-emerald-900 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <PieChart className="w-4 h-4 text-emerald-700" />
            <span>Ringkasan Kas & Rasio</span>
          </button>

          <button
            onClick={() => onSelectTab('LEDGER')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'LEDGER'
                ? 'bg-emerald-50 text-emerald-900 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Buku Kas Real-Time</span>
          </button>

          <button
            onClick={() => onSelectTab('WISHLIST')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'WISHLIST'
                ? 'bg-emerald-50 text-emerald-900 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Target className="w-4 h-4 text-amber-600" />
            <span>Katalog Kebutuhan</span>
          </button>

          <button
            onClick={() => onSelectTab('QRIS')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'QRIS'
                ? 'bg-emerald-50 text-emerald-900 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-700" />
            <span>Kanal QRIS & Rekening</span>
          </button>

          <button
            onClick={() => onSelectTab('GALLERY')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'GALLERY'
                ? 'bg-emerald-50 text-emerald-900 font-bold border-b-2 border-emerald-700'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Galeri Dampak</span>
          </button>

          {/* Separator */}
          <div className="h-5 w-px bg-slate-300 mx-1 shrink-0" />

          {/* Admin Management Views */}
          <button
            onClick={() => onSelectTab('POS')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'POS'
                ? 'bg-emerald-800 text-white font-bold'
                : 'text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Kasir POS ZISWAF</span>
          </button>

          <button
            onClick={() => onSelectTab('EXPENSES')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'EXPENSES'
                ? 'bg-emerald-800 text-white font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4 text-rose-600" />
            <span>Kas Keluar & Nota</span>
          </button>

          <button
            onClick={() => onSelectTab('DATABASE')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'DATABASE'
                ? 'bg-emerald-800 text-white font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>Database Mustahik</span>
          </button>

          <button
            onClick={() => onSelectTab('REPORTS')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'REPORTS'
                ? 'bg-emerald-800 text-white font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Laporan PSAK 109</span>
          </button>
        </div>
      </div>
    </header>
  );
};
