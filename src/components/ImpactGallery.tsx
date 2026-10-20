import React, { useState } from 'react';
import { ImpactProgram, formatRupiah } from '../utils/finance';
import { Image as ImageIcon, Users, Calendar, Banknote, Plus, Check } from 'lucide-react';

interface ImpactGalleryProps {
  programs: ImpactProgram[];
  onAddProgram?: (program: Omit<ImpactProgram, 'id'>) => void;
  canManage?: boolean;
}

export const ImpactGallery: React.FC<ImpactGalleryProps> = ({
  programs,
  onAddProgram,
  canManage = false,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [amountSpent, setAmountSpent] = useState(1500000);
  const [beneficiariesCount, setBeneficiariesCount] = useState(25);
  const [category, setCategory] = useState('Pendidikan');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !onAddProgram) return;

    onAddProgram({
      title,
      date: date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      amountSpent,
      beneficiariesCount,
      category,
      description,
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setImageUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <ImageIcon className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Galeri Dampak & Laporan Penyaluran
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Dokumentasi nyata kegiatan penyaluran amanah donatur untuk membuktikan bahwa dana benar-benar sampai kepada yang berhak.
            </p>
          </div>

          {canManage && onAddProgram && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dokumentasi Penyaluran</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden flex flex-col hover:shadow-md transition group"
          >
            {/* Photo Container */}
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <img
                src={prog.imageUrl}
                alt={prog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-emerald-900/80 backdrop-blur-xs text-emerald-100 rounded-full text-[11px] font-bold shadow-xs">
                  {prog.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prog.date}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-emerald-800 transition">
                  {prog.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              {/* Stats Bottom */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Users className="w-3 h-3 text-emerald-600" />
                    <span>Penerima</span>
                  </div>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {prog.beneficiariesCount} Jiwa
                  </p>
                </div>

                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Banknote className="w-3 h-3 text-rose-600" />
                    <span>Dana Disalurkan</span>
                  </div>
                  <p className="font-bold text-rose-800 mt-0.5">
                    {formatRupiah(prog.amountSpent)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Input Dokumentasi Penyaluran Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-emerald-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Judul Kegiatan Program:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Penyaluran Paket Nutrisi & Vitamin Santri Asrama"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tanggal Kegiatan:
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="20 Oktober 2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kategori:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Pendidikan">Pendidikan & Beasiswa</option>
                    <option value="Pangan & Nutrisi">Pangan & Nutrisi</option>
                    <option value="Kesehatan">Kesehatan & Medis</option>
                    <option value="Pemberdayaan">Pemberdayaan Ekonomi</option>
                    <option value="Sarana & Dakwah">Sarana & Dakwah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Total Dana Penyaluran (Rp):
                  </label>
                  <input
                    type="number"
                    value={amountSpent}
                    onChange={(e) => setAmountSpent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jumlah Penerima Manfaat:
                  </label>
                  <input
                    type="number"
                    value={beneficiariesCount}
                    onChange={(e) => setBeneficiariesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  URL Foto Dokumentasi Kegiatan:
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Deskripsi Kegiatan Penyaluran:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan detail kegiatan, penerima bantuan, dan dampak langsungnya..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                >
                  Simpan Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
