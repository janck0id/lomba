/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { PublicSummaryChart } from './components/PublicSummaryChart';
import { PublicLedger } from './components/PublicLedger';
import { WishlistSection } from './components/WishlistSection';
import { QrisChannel } from './components/QrisChannel';
import { ImpactGallery } from './components/ImpactGallery';
import { AdminPOS } from './components/AdminPOS';
import { AdminExpense } from './components/AdminExpense';
import { DonorMustahikDatabase } from './components/DonorMustahikDatabase';
import { PSAK109ReportView } from './components/PSAK109ReportView';
import { ReceiptModal } from './components/ReceiptModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { ZakatCalculatorModal } from './components/ZakatCalculatorModal';

import {
  INITIAL_DONATIONS,
  INITIAL_EXPENSES,
  INITIAL_WISHLIST,
  INITIAL_DONORS,
  INITIAL_MUSTAHIK,
  INITIAL_IMPACT_PROGRAMS,
  FOUNDATION_INFO,
} from './data/initialData';

import {
  DonationTransaction,
  ExpenseTransaction,
  WishlistItem,
  DonorProfile,
  MustahikProfile,
  ImpactProgram,
  AkadType,
  PaymentMethod,
  exportTransactionsToCSV,
  generateKuitansiNumber,
} from './utils/finance';

import {
  Heart,
  RotateCcw,
  ShieldCheck,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Navigation & Role
  const [activeTab, setActiveTab] = useState<NavTab>('OVERVIEW');
  const [currentUserRole, setCurrentUserRole] = useState<string>('Nurul Hidayat (Bendahara)');

  // Persistence States
  const [donations, setDonations] = useState<DonationTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('amanahzis_donations');
      return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const [expenses, setExpenses] = useState<ExpenseTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('amanahzis_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('amanahzis_wishlist');
      return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
    } catch {
      return INITIAL_WISHLIST;
    }
  });

  const [donors, setDonors] = useState<DonorProfile[]>(() => {
    try {
      const saved = localStorage.getItem('amanahzis_donors');
      return saved ? JSON.parse(saved) : INITIAL_DONORS;
    } catch {
      return INITIAL_DONORS;
    }
  });

  const [mustahik, setMustahik] = useState<MustahikProfile[]>(() => {
    try {
      const saved = localStorage.getItem('amanahzis_mustahik');
      return saved ? JSON.parse(saved) : INITIAL_MUSTAHIK;
    } catch {
      return INITIAL_MUSTAHIK;
    }
  });

  const [programs, setPrograms] = useState<ImpactProgram[]>(() => {
    try {
      const saved = localStorage.getItem('amanahzis_programs');
      return saved ? JSON.parse(saved) : INITIAL_IMPACT_PROGRAMS;
    } catch {
      return INITIAL_IMPACT_PROGRAMS;
    }
  });

  // Modals & Presets
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<DonationTransaction | null>(null);
  const [selectedWaTx, setSelectedWaTx] = useState<DonationTransaction | null>(null);
  const [isZakatCalcOpen, setIsZakatCalcOpen] = useState(false);

  // Prefill for QRIS / Donation from Wishlist or Zakat Calc
  const [qrisPreset, setQrisPreset] = useState<{
    amount?: number;
    akad?: AkadType;
    note?: string;
  }>({});

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('amanahzis_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('amanahzis_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('amanahzis_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('amanahzis_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('amanahzis_mustahik', JSON.stringify(mustahik));
  }, [mustahik]);

  useEffect(() => {
    localStorage.setItem('amanahzis_programs', JSON.stringify(programs));
  }, [programs]);

  // Handler: Add New Donation (From POS or Self Confirmation)
  const handleAddDonation = (
    data: Omit<DonationTransaction, 'id' | 'receiptNumber' | 'date' | 'status'>
  ): DonationTransaction => {
    const seq = donations.length + 55;
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const receiptNumber = `KW/YBU/2026/10/${String(seq).padStart(4, '0')}`;

    const newTx: DonationTransaction = {
      ...data,
      id: `don-${Date.now()}`,
      receiptNumber,
      date: dateStr,
      status: 'Terverifikasi',
    };

    setDonations((prev) => [newTx, ...prev]);

    // If wishlist attached, update collectedAmount
    if (data.wishlistId) {
      setWishlist((prev) =>
        prev.map((w) =>
          w.id === data.wishlistId
            ? { ...w, collectedAmount: w.collectedAmount + data.amount }
            : w
        )
      );
    }

    // Update or add donor in donor database if not anonymous
    if (!data.isAnonymous && data.donorName && data.donorName !== 'Hamba Allah') {
      setDonors((prev) => {
        const existingIdx = prev.findIndex(
          (d) =>
            d.name.toLowerCase() === data.donorName.toLowerCase() ||
            (data.donorPhone && d.phone === data.donorPhone)
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            totalDonation: updated[existingIdx].totalDonation + data.amount,
            frequency: updated[existingIdx].frequency + 1,
            lastDonationDate: dateStr.split(' ')[0],
            preferredAkad: data.akad,
          };
          return updated;
        } else {
          const newProfile: DonorProfile = {
            id: `don-p-${Date.now()}`,
            name: data.donorName,
            phone: data.donorPhone || '',
            isRoutine: false,
            totalDonation: data.amount,
            frequency: 1,
            lastDonationDate: dateStr.split(' ')[0],
            preferredAkad: data.akad,
          };
          return [newProfile, ...prev];
        }
      });
    }

    return newTx;
  };

  // Handler: Add New Expense
  const handleAddExpense = (data: Omit<ExpenseTransaction, 'id' | 'status'>) => {
    const requiresApproval = data.amount > 1000000;
    const newExp: ExpenseTransaction = {
      ...data,
      id: `exp-${Date.now()}`,
      status: requiresApproval ? 'Menunggu Persetujuan' : 'Disetujui',
      approvedBy: requiresApproval ? undefined : currentUserRole,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  // Handler: Approve Expense (Dual-control by Ketua/Pembina)
  const handleApproveExpense = (id: string, approverName: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'Disetujui', approvedBy: approverName } : e
      )
    );
  };

  // Handler: Reject Expense
  const handleRejectExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Ditolak' } : e))
    );
  };

  // Handler: Add Donor Profile
  const handleAddDonor = (d: Omit<DonorProfile, 'id'>) => {
    setDonors((prev) => [{ ...d, id: `don-p-${Date.now()}` }, ...prev]);
  };

  // Handler: Add Mustahik Profile
  const handleAddMustahik = (m: Omit<MustahikProfile, 'id'>) => {
    setMustahik((prev) => [{ ...m, id: `mus-${Date.now()}` }, ...prev]);
  };

  // Handler: Update Mustahik disbursement date
  const handleUpdateMustahikStatus = (id: string, newDate: string) => {
    setMustahik((prev) =>
      prev.map((m) => (m.id === id ? { ...m, lastDisbursedDate: newDate } : m))
    );
  };

  // Handler: Add Impact Program
  const handleAddImpactProgram = (p: Omit<ImpactProgram, 'id'>) => {
    setPrograms((prev) => [{ ...p, id: `imp-${Date.now()}` }, ...prev]);
  };

  // Handler: Wishlist Card "Bantu Item Ini"
  const handleDonateWishlistItem = (item: WishlistItem) => {
    const remaining = Math.max(0, item.targetAmount - item.collectedAmount);
    setQrisPreset({
      amount: remaining > 0 ? remaining : 100000,
      akad: 'Infak Terikat',
      note: `Bantuan untuk: ${item.title}`,
    });
    setActiveTab('QRIS');
  };

  // Handler: Apply from Zakat Calculator
  const handleApplyZakat = (amount: number, akad: AkadType, note: string) => {
    setQrisPreset({
      amount,
      akad,
      note,
    });
    setActiveTab('QRIS');
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    const csvContent = exportTransactionsToCSV(donations, expenses);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Laporan_Buku_Kas_${FOUNDATION_INFO.name.replace(/\s+/g, '_')}_Oktober_2026.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler: Reset to Initial Data
  const handleResetData = () => {
    if (confirm('Kembalikan semua data ke sampel awal default?')) {
      localStorage.removeItem('amanahzis_donations');
      localStorage.removeItem('amanahzis_expenses');
      localStorage.removeItem('amanahzis_wishlist');
      localStorage.removeItem('amanahzis_donors');
      localStorage.removeItem('amanahzis_mustahik');
      localStorage.removeItem('amanahzis_programs');
      setDonations(INITIAL_DONATIONS);
      setExpenses(INITIAL_EXPENSES);
      setWishlist(INITIAL_WISHLIST);
      setDonors(INITIAL_DONORS);
      setMustahik(INITIAL_MUSTAHIK);
      setPrograms(INITIAL_IMPACT_PROGRAMS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Navbar with Role Switcher & Tabs */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUserRole={currentUserRole}
        onChangeRole={setCurrentUserRole}
        onOpenZakatCalc={() => setIsZakatCalcOpen(true)}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            <PublicSummaryChart
              donations={donations}
              expenses={expenses}
              onOpenDonate={() => setActiveTab('QRIS')}
              onOpenZakatCalc={() => setIsZakatCalcOpen(true)}
            />

            {/* Quick Preview of Wishlist */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Kebutuhan Mendesak Panti Asuhan & Lembaga
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bantu penuhi kebutuhan spesifik yang belum tertutupi bulan ini
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('WISHLIST')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  Lihat Semua Wishlist →
                </button>
              </div>
              <WishlistSection
                items={wishlist.slice(0, 3)}
                onDonateItem={handleDonateWishlistItem}
              />
            </div>

            {/* Quick Preview of Transparent Ledger */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Mutasi Terbaru Buku Kas Transparan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pencatatan real-time otomatis setiap kali admin memasukkan donasi & pengeluaran
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('LEDGER')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  Buka Buku Kas Lengkap →
                </button>
              </div>
              <PublicLedger
                donations={donations.slice(0, 5)}
                expenses={expenses.slice(0, 5)}
                onSelectReceipt={(tx) => setSelectedReceiptTx(tx)}
                onExportCSV={handleExportCSV}
              />
            </div>
          </div>
        )}

        {activeTab === 'LEDGER' && (
          <PublicLedger
            donations={donations}
            expenses={expenses}
            onSelectReceipt={(tx) => setSelectedReceiptTx(tx)}
            onExportCSV={handleExportCSV}
          />
        )}

        {activeTab === 'WISHLIST' && (
          <WishlistSection
            items={wishlist}
            onDonateItem={handleDonateWishlistItem}
          />
        )}

        {activeTab === 'QRIS' && (
          <QrisChannel
            onConfirmDonation={(data) => {
              const tx = handleAddDonation({
                ...data,
                enteredBy: 'Donatur (Mandiri Online)',
              });
              setSelectedReceiptTx(tx);
            }}
            presetAmount={qrisPreset.amount}
            presetAkad={qrisPreset.akad}
            presetNote={qrisPreset.note}
          />
        )}

        {activeTab === 'GALLERY' && (
          <ImpactGallery
            programs={programs}
            onAddProgram={handleAddImpactProgram}
            canManage={currentUserRole !== 'Masyarakat / Donatur'}
          />
        )}

        {activeTab === 'POS' && (
          <AdminPOS
            wishlist={wishlist}
            onAddDonation={handleAddDonation}
            onOpenReceipt={(tx) => setSelectedReceiptTx(tx)}
            onOpenWhatsApp={(tx) => setSelectedWaTx(tx)}
            currentUserRole={currentUserRole}
          />
        )}

        {activeTab === 'EXPENSES' && (
          <AdminExpense
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onApproveExpense={handleApproveExpense}
            onRejectExpense={handleRejectExpense}
            currentUserRole={currentUserRole}
          />
        )}

        {activeTab === 'DATABASE' && (
          <DonorMustahikDatabase
            donors={donors}
            mustahik={mustahik}
            onAddDonor={handleAddDonor}
            onAddMustahik={handleAddMustahik}
            onUpdateMustahikStatus={handleUpdateMustahikStatus}
          />
        )}

        {activeTab === 'REPORTS' && (
          <PSAK109ReportView
            donations={donations}
            expenses={expenses}
            onExportCSV={handleExportCSV}
          />
        )}
      </main>

      {/* Global Modals */}
      <ReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
        onOpenWhatsApp={(tx) => {
          setSelectedReceiptTx(null);
          setSelectedWaTx(tx);
        }}
      />

      <WhatsAppModal
        transaction={selectedWaTx}
        onClose={() => setSelectedWaTx(null)}
      />

      <ZakatCalculatorModal
        isOpen={isZakatCalcOpen}
        onClose={() => setIsZakatCalcOpen(false)}
        onApplyDonation={handleApplyZakat}
      />

      {/* Public Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-12 border-t border-slate-800 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                  AZ
                </span>
                <span className="text-white font-bold text-base tracking-tight">
                  AmanahZIS - Yayasan Sekitar
                </span>
              </div>
              <p className="mt-1 text-slate-400 max-w-md">
                Sistem transparansi donasi, kasir POS ZISWAF, dan pelaporan keuangan syariah PSAK 109 untuk yayasan & panti asuhan lokal.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleResetData}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data Demo</span>
              </button>
              <button
                onClick={() => setIsZakatCalcOpen(true)}
                className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-700 transition cursor-pointer"
              >
                Kalkulator Zakat
              </button>
              <button
                onClick={() => setActiveTab('REPORTS')}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Laporan PSAK 109
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>
              © 2026 {FOUNDATION_INFO.name}. Dipersiapkan untuk Karya Inovasi SYLS 2026.
            </p>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparansi 100% Terverifikasi Digital</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
