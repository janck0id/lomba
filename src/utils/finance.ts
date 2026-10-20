/**
 * Utility functions for Indonesian Rupiah formatting, number to words (terbilang),
 * PSAK 109 ZISWAF accounting, and Zakat calculations.
 */

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const satuan = [
  '',
  'Satu',
  'Dua',
  'Tiga',
  'Empat',
  'Lima',
  'Enam',
  'Tujuh',
  'Delapan',
  'Sembilan',
  'Sepuluh',
  'Sebelas',
];

export function terbilang(n: number): string {
  const num = Math.floor(Math.abs(n));
  if (num === 0) return 'Nol Rupiah';

  function convert(x: number): string {
    if (x < 12) {
      return satuan[x];
    } else if (x < 20) {
      return convert(x - 10) + ' Belas';
    } else if (x < 100) {
      return convert(Math.floor(x / 10)) + ' Puluh ' + convert(x % 10);
    } else if (x < 200) {
      return 'Seratus ' + convert(x - 100);
    } else if (x < 1000) {
      return convert(Math.floor(x / 100)) + ' Ratus ' + convert(x % 100);
    } else if (x < 2000) {
      return 'Seribu ' + convert(x - 1000);
    } else if (x < 1000000) {
      return convert(Math.floor(x / 1000)) + ' Ribu ' + convert(x % 1000);
    } else if (x < 1000000000) {
      return convert(Math.floor(x / 1000000)) + ' Juta ' + convert(x % 1000000);
    } else if (x < 1000000000000) {
      return convert(Math.floor(x / 1000000000)) + ' Miliar ' + convert(x % 1000000000);
    } else {
      return convert(Math.floor(x / 1000000000000)) + ' Triliun ' + convert(x % 1000000000000);
    }
  }

  const result = convert(num).replace(/\s+/g, ' ').trim();
  return `${result} Rupiah`;
}

export function generateKuitansiNumber(prefix = 'KW/YBU', seq = 1): string {
  const year = 2026;
  const month = 10;
  return `${prefix}/${year}/${month}/${String(seq).padStart(4, '0')}`;
}

export type AkadType = 'Zakat Mal' | 'Zakat Fitrah' | 'Infak Terikat' | 'Sedekah Subuh' | 'Wakaf Produktif' | 'Fidyah';
export type PaymentMethod = 'Tunai' | 'QRIS' | 'Transfer BSI' | 'Transfer Bank Lain';
export type ExpenseCategory = 'Operasional' | 'Bahan Pangan' | 'Pendidikan Anak Asuh' | 'Kesehatan & Medis' | 'Santunan Dhuafa';

export interface DonationTransaction {
  id: string;
  receiptNumber: string;
  donorName: string;
  donorPhone?: string;
  isAnonymous: boolean;
  amount: number;
  akad: AkadType;
  paymentMethod: PaymentMethod;
  wishlistId?: string;
  wishlistTitle?: string;
  date: string;
  notes?: string;
  status: 'Diterima' | 'Terverifikasi';
  enteredBy: string;
}

export interface ExpenseTransaction {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  recipient: string;
  description: string;
  proofImageUrl?: string;
  proofImageName?: string;
  status: 'Disetujui' | 'Menunggu Persetujuan' | 'Ditolak';
  approvedBy?: string;
  enteredBy: string;
  asnafTarget?: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  targetAmount: number;
  collectedAmount: number;
  category: string;
  urgency: 'Mendesak' | 'Prioritas' | 'Rutin';
  description: string;
  imageUrl?: string;
  deadline?: string;
}

export interface DonorProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isRoutine: boolean;
  totalDonation: number;
  frequency: number;
  lastDonationDate: string;
  preferredAkad: string;
}

export interface MustahikProfile {
  id: string;
  name: string;
  type: 'Anak Asuh' | 'Keluarga Dhuafa' | 'Lansia Sebatang Kara' | 'Guru Ngaji';
  age?: number;
  education?: string;
  location: string;
  monthlyAssistance: number;
  lastDisbursedDate: string;
  status: 'Aktif Menerima' | 'Sudah Mandiri' | 'Verifikasi Ulang';
  needsNotes: string;
}

export interface ImpactProgram {
  id: string;
  title: string;
  date: string;
  amountSpent: number;
  beneficiariesCount: number;
  description: string;
  imageUrl: string;
  category: string;
}

export interface PSAK109Report {
  totalPenerimaanZakat: number;
  totalPenyaluranZakat: number;
  saldoDanaZakat: number;

  totalPenerimaanInfak: number;
  totalPenyaluranInfak: number;
  saldoDanaInfak: number;

  totalPenerimaanWakaf: number;
  totalPenyaluranWakaf: number;
  saldoDanaWakaf: number;

  totalBagianAmil: number;
  totalOperasionalAmil: number;
  saldoDanaAmil: number;

  totalKasTersedia: number;
}

export function calculatePSAK109(
  donations: DonationTransaction[],
  expenses: ExpenseTransaction[]
): PSAK109Report {
  let totalPenerimaanZakat = 0;
  let totalPenerimaanInfak = 0;
  let totalPenerimaanWakaf = 0;

  for (const d of donations) {
    if (d.akad.includes('Zakat')) {
      totalPenerimaanZakat += d.amount;
    } else if (d.akad.includes('Wakaf')) {
      totalPenerimaanWakaf += d.amount;
    } else {
      // Infak, Sedekah, Fidyah
      totalPenerimaanInfak += d.amount;
    }
  }

  // Hak Amil (Sesuai kaidah syariah/fatwa MUI maks 12.5% atau 1/8 dari penerimaan Zakat & Infak)
  const totalBagianAmil = Math.round((totalPenerimaanZakat + totalPenerimaanInfak) * 0.125);
  const netZakatTersedia = Math.round(totalPenerimaanZakat * 0.875);
  const netInfakTersedia = Math.round(totalPenerimaanInfak * 0.875);

  let totalPenyaluranZakat = 0;
  let totalPenyaluranInfak = 0;
  let totalPenyaluranWakaf = 0;
  let totalOperasionalAmil = 0;

  for (const e of expenses) {
    if (e.status !== 'Disetujui') continue;
    if (e.category === 'Operasional') {
      totalOperasionalAmil += e.amount;
    } else if (e.category === 'Santunan Dhuafa' || e.category === 'Pendidikan Anak Asuh') {
      // Diprioritaskan dari Dana Zakat jika cukup, selebihnya Infak
      if (totalPenyaluranZakat + e.amount <= netZakatTersedia) {
        totalPenyaluranZakat += e.amount;
      } else {
        const sisa = e.amount - Math.max(0, netZakatTersedia - totalPenyaluranZakat);
        totalPenyaluranZakat = netZakatTersedia;
        totalPenyaluranInfak += sisa;
      }
    } else {
      // Bahan Pangan, Kesehatan
      totalPenyaluranInfak += e.amount;
    }
  }

  const saldoDanaZakat = Math.max(0, netZakatTersedia - totalPenyaluranZakat);
  const saldoDanaInfak = Math.max(0, netInfakTersedia - totalPenyaluranInfak);
  const saldoDanaWakaf = Math.max(0, totalPenerimaanWakaf - totalPenyaluranWakaf);
  const saldoDanaAmil = Math.max(0, totalBagianAmil - totalOperasionalAmil);

  const totalKasTersedia = saldoDanaZakat + saldoDanaInfak + saldoDanaWakaf + saldoDanaAmil;

  return {
    totalPenerimaanZakat,
    totalPenyaluranZakat,
    saldoDanaZakat,
    totalPenerimaanInfak,
    totalPenyaluranInfak,
    saldoDanaInfak,
    totalPenerimaanWakaf,
    totalPenyaluranWakaf,
    saldoDanaWakaf,
    totalBagianAmil,
    totalOperasionalAmil,
    saldoDanaAmil,
    totalKasTersedia,
  };
}

export function calculateZakatPenghasilan(monthlyIncome: number, monthlyNeeds: number, nisabBerasBulanan = 6850000): {
  isWajib: boolean;
  netIncome: number;
  zakatPerMonth: number;
} {
  const netIncome = Math.max(0, monthlyIncome - monthlyNeeds);
  const isWajib = netIncome >= nisabBerasBulanan;
  const zakatPerMonth = isWajib ? Math.round(netIncome * 0.025) : 0;
  return { isWajib, netIncome, zakatPerMonth };
}

export function calculateZakatMaal(totalAssets: number, nisabEmasRupiah = 85000000): {
  isWajib: boolean;
  zakatPayable: number;
} {
  const isWajib = totalAssets >= nisabEmasRupiah;
  const zakatPayable = isWajib ? Math.round(totalAssets * 0.025) : 0;
  return { isWajib, zakatPayable };
}

export function exportTransactionsToCSV(
  donations: DonationTransaction[],
  expenses: ExpenseTransaction[]
): string {
  // Combine all ledger transactions
  const rows: Array<{
    Tanggal: string;
    NoReferensi: string;
    Tipe: string;
    NamaEntitas: string;
    KategoriAkad: string;
    Metode: string;
    Masuk: number;
    Keluar: number;
    Keterangan: string;
  }> = [];

  donations.forEach((d) => {
    rows.push({
      Tanggal: d.date,
      NoReferensi: d.receiptNumber,
      Tipe: 'Pemasukan (Donasi)',
      NamaEntitas: d.isAnonymous ? 'Hamba Allah (Anonim)' : d.donorName,
      KategoriAkad: d.akad,
      Metode: d.paymentMethod,
      Masuk: d.amount,
      Keluar: 0,
      Keterangan: d.notes || d.wishlistTitle || 'Donasi ZISWAF',
    });
  });

  expenses.forEach((e) => {
    rows.push({
      Tanggal: e.date,
      NoReferensi: e.id,
      Tipe: 'Pengeluaran (Kas Keluar)',
      NamaEntitas: e.recipient,
      KategoriAkad: e.category,
      Metode: 'Kas / Transfer Yayasan',
      Masuk: 0,
      Keluar: e.amount,
      Keterangan: `${e.description} [Status: ${e.status}]`,
    });
  });

  // Sort by date descending
  rows.sort((a, b) => new Date(b.Tanggal).getTime() - new Date(a.Tanggal).getTime());

  const headers = [
    'Tanggal',
    'No. Referensi / Kuitansi',
    'Jenis Mutasi',
    'Nama Donatur / Penerima Dana',
    'Akad / Kategori',
    'Metode Pembayaran',
    'Pemasukan (Rp)',
    'Pengeluaran (Rp)',
    'Keterangan & Catatan',
  ];

  const csvRows = [
    headers.join(','),
    ...rows.map((r) =>
      [
        `"${r.Tanggal}"`,
        `"${r.NoReferensi}"`,
        `"${r.Tipe}"`,
        `"${r.NamaEntitas}"`,
        `"${r.KategoriAkad}"`,
        `"${r.Metode}"`,
        r.Masuk,
        r.Keluar,
        `"${r.Keterangan.replace(/"/g, '""')}"`,
      ].join(',')
    ),
  ];

  // UTF-8 BOM for Microsoft Excel compatibility
  return '\uFEFF' + csvRows.join('\r\n');
}
