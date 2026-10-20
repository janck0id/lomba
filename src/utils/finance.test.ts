import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  terbilang,
  calculateZakatPenghasilan,
  calculateZakatMaal,
  calculatePSAK109,
} from './finance.ts';
import type { DonationTransaction, ExpenseTransaction } from './finance.ts';

test('formatRupiah formats Indonesian currency correctly', () => {
  const formatted = formatRupiah(100000);
  assert.match(formatted, /100\.000/);
});

test('terbilang converts numbers into Indonesian words correctly', () => {
  assert.equal(terbilang(0), 'Nol Rupiah');
  assert.equal(terbilang(150000), 'Seratus Lima Puluh Ribu Rupiah');
  assert.equal(terbilang(1000000), 'Satu Juta Rupiah');
  assert.equal(terbilang(2550000), 'Dua Juta Lima Ratus Lima Puluh Ribu Rupiah');
});

test('calculateZakatPenghasilan correctly calculates zakat when net income passes nisab', () => {
  // Below nisab
  const low = calculateZakatPenghasilan(5000000, 1000000, 6850000);
  assert.equal(low.isWajib, false);
  assert.equal(low.zakatPerMonth, 0);

  // Above nisab (income 10jt - needs 2jt = 8jt net >= 6.85jt nisab)
  const high = calculateZakatPenghasilan(10000000, 2000000, 6850000);
  assert.equal(high.isWajib, true);
  assert.equal(high.zakatPerMonth, 200000); // 2.5% of 8,000,000 = 200,000
});

test('calculateZakatMaal calculates 2.5% when asset reaches nisab', () => {
  const below = calculateZakatMaal(50000000, 85000000);
  assert.equal(below.isWajib, false);
  assert.equal(below.zakatPayable, 0);

  const above = calculateZakatMaal(100000000, 85000000);
  assert.equal(above.isWajib, true);
  assert.equal(above.zakatPayable, 2500000);
});

test('calculatePSAK109 segregates funds according to Islamic accounting principles', () => {
  const mockDonations: DonationTransaction[] = [
    {
      id: 'd1',
      receiptNumber: 'KW/1',
      donorName: 'Ahmad',
      isAnonymous: false,
      amount: 1000000,
      akad: 'Zakat Mal',
      paymentMethod: 'Transfer BSI',
      date: '2026-10-01',
      status: 'Terverifikasi',
      enteredBy: 'Bendahara',
    },
    {
      id: 'd2',
      receiptNumber: 'KW/2',
      donorName: 'Hamba Allah',
      isAnonymous: true,
      amount: 2000000,
      akad: 'Sedekah Subuh',
      paymentMethod: 'QRIS',
      date: '2026-10-02',
      status: 'Terverifikasi',
      enteredBy: 'Bendahara',
    },
  ];

  const mockExpenses: ExpenseTransaction[] = [
    {
      id: 'e1',
      date: '2026-10-03',
      amount: 300000,
      category: 'Operasional',
      recipient: 'PLN Listrik',
      description: 'Listrik asrama',
      status: 'Disetujui',
      enteredBy: 'Bendahara',
    },
    {
      id: 'e2',
      date: '2026-10-04',
      amount: 500000,
      category: 'Pendidikan Anak Asuh',
      recipient: 'SPP Sekolah',
      description: 'SPP 2 Anak Asuh',
      status: 'Disetujui',
      enteredBy: 'Bendahara',
    },
  ];

  const report = calculatePSAK109(mockDonations, mockExpenses);
  assert.equal(report.totalPenerimaanZakat, 1000000);
  assert.equal(report.totalPenerimaanInfak, 2000000);
  assert.ok(report.totalKasTersedia > 0);
  assert.ok(report.saldoDanaZakat >= 0);
});
