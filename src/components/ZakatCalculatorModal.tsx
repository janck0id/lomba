import React, { useState } from 'react';
import {
  calculateZakatPenghasilan,
  calculateZakatMaal,
  formatRupiah,
  AkadType,
} from '../utils/finance';
import { Calculator, X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDonation: (amount: number, akad: AkadType, note: string) => void;
}

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyDonation,
}) => {
  const [activeTab, setActiveTab] = useState<'PROFESI' | 'MAAL' | 'FITRAH'>('PROFESI');

  // Profesi
  const [monthlyIncome, setMonthlyIncome] = useState<number>(10000000);
  const [monthlyNeeds, setMonthlyNeeds] = useState<number>(3000000);

  // Maal
  const [totalAssets, setTotalAssets] = useState<number>(100000000);

  // Fitrah
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const ricePerPersonRupiah = 45000;

  if (!isOpen) return null;

  const profResult = calculateZakatPenghasilan(monthlyIncome, monthlyNeeds);
  const maalResult = calculateZakatMaal(totalAssets);
  const fitrahTotal = familyMembers * ricePerPersonRupiah;

  const handlePayProfesi = () => {
    onApplyDonation(
      profResult.zakatPerMonth,
      'Zakat Mal',
      `Zakat Profesi Bulanan (Penghasilan ${formatRupiah(monthlyIncome)})`
    );
    onClose();
  };

  const handlePayMaal = () => {
    onApplyDonation(
      maalResult.zakatPayable,
      'Zakat Mal',
      `Zakat Maal Harta Simpanan (${formatRupiah(totalAssets)})`
    );
    onClose();
  };

  const handlePayFitrah = () => {
    onApplyDonation(
      fitrahTotal,
      'Zakat Fitrah',
      `Zakat Fitrah untuk ${familyMembers} Jiwa Keluarga`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 rounded-lg">
              <Calculator className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Kalkulator Zakat Interaktif</h3>
              <p className="text-xs text-emerald-200">Hitung nisab & kewajiban zakat sesuai kaidah syariah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-200 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('PROFESI')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'PROFESI'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Zakat Penghasilan
          </button>
          <button
            onClick={() => setActiveTab('MAAL')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'MAAL'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Zakat Maal (Tabungan/Emas)
          </button>
          <button
            onClick={() => setActiveTab('FITRAH')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'FITRAH'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Zakat Fitrah
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 space-y-4">
          {activeTab === 'PROFESI' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pendapatan Bruto Bulanan (Gaji, Bonus, Usaha):
                </label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  step={500000}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Kebutuhan Pokok Bulanan (Cicilan pokok, nafkah keluarga):
                </label>
                <input
                  type="number"
                  value={monthlyNeeds}
                  onChange={(e) => setMonthlyNeeds(Number(e.target.value))}
                  step={500000}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pendapatan Bersih (Netto):</span>
                  <span className="font-bold text-slate-900">{formatRupiah(profResult.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standar Nisab Bulanan (BAZNAS):</span>
                  <span className="font-medium text-slate-700">{formatRupiah(6850000)} / bln</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800">Status Kewajiban:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      profResult.isWajib
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {profResult.isWajib ? 'Wajib Zakat (Mencapai Nisab)' : 'Belum Wajib (Bisa Sedekah)'}
                  </span>
                </div>
              </div>

              {profResult.isWajib ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-emerald-700 font-semibold block">
                      Zakat Penghasilan per Bulan (2.5%):
                    </span>
                    <span className="text-xl font-black text-emerald-950">
                      {formatRupiah(profResult.zakatPerMonth)}
                    </span>
                  </div>
                  <button
                    onClick={handlePayProfesi}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <span>Bayar Zakat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic text-center">
                  Penghasilan belum melampaui nisab. Anda tetap dianjurkan menunaikan Sedekah Subuh atau Infak sukarela.
                </p>
              )}
            </div>
          )}

          {activeTab === 'MAAL' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Total Nilai Harta Simpanan (Tabungan, Emas, Saham, Properti Investasi):
                </label>
                <input
                  type="number"
                  value={totalAssets}
                  onChange={(e) => setTotalAssets(Number(e.target.value))}
                  step={5000000}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Standar Nisab Emas (85 gram):</span>
                  <span className="font-medium text-slate-700">{formatRupiah(85000000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Syarat Haul:</span>
                  <span className="font-medium text-slate-700">Telah tersimpan selama 1 tahun hijriah</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800">Status Kewajiban:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      maalResult.isWajib
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {maalResult.isWajib ? 'Wajib Zakat Maal' : 'Belum Mencapai Nisab'}
                  </span>
                </div>
              </div>

              {maalResult.isWajib ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-emerald-700 font-semibold block">
                      Zakat Maal yang Harus Ditunaikan (2.5%):
                    </span>
                    <span className="text-xl font-black text-emerald-950">
                      {formatRupiah(maalResult.zakatPayable)}
                    </span>
                  </div>
                  <button
                    onClick={handlePayMaal}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <span>Bayar Zakat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic text-center">
                  Total simpanan belum mencapai nisab 85 gram emas.
                </p>
              )}
            </div>
          )}

          {activeTab === 'FITRAH' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Jumlah Jiwa Tanggungan Keluarga:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={familyMembers}
                    onChange={(e) => setFamilyMembers(Number(e.target.value))}
                    className="w-28 px-3 py-2 text-base font-bold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-600 font-medium">Orang / Jiwa</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Standar Beras per Jiwa:</span>
                  <span className="font-medium text-slate-700">2,5 kg beras kualitas premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Konversi Rupiah BAZNAS:</span>
                  <span className="font-medium text-slate-700">{formatRupiah(ricePerPersonRupiah)} / jiwa</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-700 font-semibold block">
                    Total Zakat Fitrah ({familyMembers} Jiwa):
                  </span>
                  <span className="text-xl font-black text-emerald-950">
                    {formatRupiah(fitrahTotal)}
                  </span>
                </div>
                <button
                  onClick={handlePayFitrah}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <span>Tunaikan Zakat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
