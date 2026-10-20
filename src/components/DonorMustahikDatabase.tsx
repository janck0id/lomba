import React, { useState } from 'react';
import { DonorProfile, MustahikProfile, formatRupiah } from '../utils/finance';
import {
  Users,
  Heart,
  Plus,
  Search,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  School,
  MapPin,
  Calendar,
} from 'lucide-react';

interface DonorMustahikDatabaseProps {
  donors: DonorProfile[];
  mustahik: MustahikProfile[];
  onAddDonor: (donor: Omit<DonorProfile, 'id'>) => void;
  onAddMustahik: (mus: Omit<MustahikProfile, 'id'>) => void;
  onUpdateMustahikStatus: (id: string, newDate: string) => void;
}

export const DonorMustahikDatabase: React.FC<DonorMustahikDatabaseProps> = ({
  donors,
  mustahik,
  onAddDonor,
  onAddMustahik,
  onUpdateMustahikStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'DONOR' | 'MUSTAHIK'>('MUSTAHIK');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [showAddMustahik, setShowAddMustahik] = useState(false);

  // New Donor Form State
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [preferredAkad, setPreferredAkad] = useState('Zakat Mal');

  // New Mustahik Form State
  const [mustahikName, setMustahikName] = useState('');
  const [mustahikType, setMustahikType] = useState<MustahikProfile['type']>('Anak Asuh');
  const [mustahikAge, setMustahikAge] = useState<number>(10);
  const [mustahikEducation, setMustahikEducation] = useState('SD');
  const [mustahikLocation, setMustahikLocation] = useState('Asrama Yayasan');
  const [monthlyAssistance, setMonthlyAssistance] = useState<number>(450000);
  const [needsNotes, setNeedsNotes] = useState('');

  const handleAddDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName) return;
    onAddDonor({
      name: donorName,
      phone: donorPhone,
      email: donorEmail,
      isRoutine: true,
      totalDonation: 0,
      frequency: 0,
      lastDonationDate: new Date().toISOString().slice(0, 10),
      preferredAkad,
    });
    setShowAddDonor(false);
    setDonorName('');
    setDonorPhone('');
  };

  const handleAddMustahikSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mustahikName) return;
    onAddMustahik({
      name: mustahikName,
      type: mustahikType,
      age: mustahikAge,
      education: mustahikEducation,
      location: mustahikLocation,
      monthlyAssistance,
      lastDisbursedDate: new Date().toISOString().slice(0, 10),
      status: 'Aktif Menerima',
      needsNotes,
    });
    setShowAddMustahik(false);
    setMustahikName('');
    setNeedsNotes('');
  };

  const filteredDonors = donors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery)
  );

  const filteredMustahik = mustahik.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Database Donatur & Mustahik (Penerima Manfaat)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pencegahan tumpang tindih penyaluran santunan dan penguatan hubungan jangka panjang dengan donatur tetap.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'DONOR' ? (
              <button
                onClick={() => setShowAddDonor(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Donatur Tetap</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddMustahik(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Mustahik / Anak Asuh</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selector & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('MUSTAHIK')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'MUSTAHIK'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Mustahik & Anak Asuh ({mustahik.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('DONOR')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === 'DONOR'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Donatur Tetap ({donors.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, lokasi, telepon..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Mustahik View */}
      {activeTab === 'MUSTAHIK' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
            <span className="font-semibold">
              Sistem Pengawasan Penyaluran: Menjamin bantuan tepat sasaran dan merata.
            </span>
            <span className="text-slate-500">
              Total {filteredMustahik.length} Penerima Manfaat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama & Kategori</th>
                  <th className="py-3 px-4">Pendidikan / Usia</th>
                  <th className="py-3 px-4">Alamat / Lokasi</th>
                  <th className="py-3 px-4">Alokasi Rutin / Bln</th>
                  <th className="py-3 px-4">Penyaluran Terakhir</th>
                  <th className="py-3 px-4 text-center">Status & Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMustahik.map((mus) => {
                  const isDisbursedThisMonth =
                    mus.lastDisbursedDate.startsWith('2026-10');

                  return (
                    <tr key={mus.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{mus.name}</p>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 mt-0.5">
                          {mus.type}
                        </span>
                        {mus.needsNotes && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                            {mus.needsNotes}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {mus.education ? (
                          <div className="flex items-center gap-1">
                            <School className="w-3.5 h-3.5 text-slate-400" />
                            <span>{mus.education}</span>
                          </div>
                        ) : (
                          `${mus.age || '-'} Tahun`
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{mus.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-900">
                        {formatRupiah(mus.monthlyAssistance)}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{mus.lastDisbursedDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isDisbursedThisMonth ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            Tersalurkan Okt
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              onUpdateMustahikStatus(
                                mus.id,
                                new Date().toISOString().slice(0, 10)
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-100 hover:bg-amber-200 text-amber-800 transition cursor-pointer"
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Salurkan Sekarang
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Donor View */}
      {activeTab === 'DONOR' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
            <span className="font-semibold">
              Database Donatur Rutin: Menjaga silaturahmi & transparansi penyampaian doa.
            </span>
            <span className="text-slate-500">
              Total {filteredDonors.length} Donatur Terdaftar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Donatur</th>
                  <th className="py-3 px-4">Kontak WhatsApp</th>
                  <th className="py-3 px-4">Akad Favorit</th>
                  <th className="py-3 px-4">Frekuensi Sedekah</th>
                  <th className="py-3 px-4 text-right">Total Akumulasi Donasi</th>
                  <th className="py-3 px-4 text-center">Aksi Silaturahmi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{d.name}</p>
                      {d.email && <p className="text-[11px] text-slate-400">{d.email}</p>}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700">
                      {d.phone || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        {d.preferredAkad}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {d.frequency} kali (Tgl: {d.lastDonationDate})
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-900">
                      {formatRupiah(d.totalDonation)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {d.phone && (
                        <a
                          href={`https://wa.me/${d.phone.replace(/^0/, '62')}?text=${encodeURIComponent(
                            `Assalamu'alaikum Warahmatullahi Wabarakatuh Bapak/Ibu ${d.name}, salam hangat dan doa keberkahan dari adik-adik santri asrama Yayasan Amanah Bina Ummah.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-xs font-semibold transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Mustahik Modal */}
      {showAddMustahik && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6">
            <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b">
              Tambah Data Mustahik / Anak Asuh
            </h3>
            <form onSubmit={handleAddMustahikSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={mustahikName}
                  onChange={(e) => setMustahikName(e.target.value)}
                  placeholder="Nama anak asuh / kepala keluarga..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Kategori:</label>
                  <select
                    value={mustahikType}
                    onChange={(e) => setMustahikType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Anak Asuh">Anak Asuh (Yatim/Piatu)</option>
                    <option value="Keluarga Dhuafa">Keluarga Dhuafa</option>
                    <option value="Lansia Sebatang Kara">Lansia Sebatang Kara</option>
                    <option value="Guru Ngaji">Guru Ngaji / Fisabilillah</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pendidikan / Usia:</label>
                  <input
                    type="text"
                    value={mustahikEducation}
                    onChange={(e) => setMustahikEducation(e.target.value)}
                    placeholder="Kelas 5 SD / 11 th"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Lokasi / Alamat:</label>
                <input
                  type="text"
                  value={mustahikLocation}
                  onChange={(e) => setMustahikLocation(e.target.value)}
                  placeholder="Asrama / RT 03 RW 07"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Kebutuhan Rutin Santunan (Rp):</label>
                <input
                  type="number"
                  value={monthlyAssistance}
                  onChange={(e) => setMonthlyAssistance(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Catatan Kebutuhan Khusus:</label>
                <textarea
                  rows={2}
                  value={needsNotes}
                  onChange={(e) => setNeedsNotes(e.target.value)}
                  placeholder="Yatim piatu, seragam sekolah, obat medis..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMustahik(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Simpan Mustahik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Donor Modal */}
      {showAddDonor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6">
            <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b">
              Tambah Data Donatur Tetap
            </h3>
            <form onSubmit={handleAddDonorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nama Donatur:</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Nama Lengkap..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Nomor WhatsApp:</label>
                <input
                  type="text"
                  required
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Email (Opsional):</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Akad Donasi Rutin:</label>
                <select
                  value={preferredAkad}
                  onChange={(e) => setPreferredAkad(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Zakat Mal">Zakat Mal</option>
                  <option value="Sedekah Subuh">Sedekah Subuh</option>
                  <option value="Infak Terikat">Infak Terikat</option>
                  <option value="Wakaf Produktif">Wakaf Produktif</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDonor(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Simpan Donatur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
