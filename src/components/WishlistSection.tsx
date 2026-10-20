import React from 'react';
import { WishlistItem, formatRupiah } from '../utils/finance';
import { Target, HeartHandshake, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';

interface WishlistSectionProps {
  items: WishlistItem[];
  onDonateItem: (item: WishlistItem) => void;
}

export const WishlistSection: React.FC<WishlistSectionProps> = ({ items, onDonateItem }) => {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                <Target className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Katalog Kebutuhan Mendasar (Wishlist Panti & Lembaga)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Daftar kebutuhan operasional dan santri yang sedang mendesak untuk dipenuhi. Donasi Anda langsung dialokasikan ke pos yang dipilih.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Wishlist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          const percent = Math.min(
            100,
            Math.round((item.collectedAmount / item.targetAmount) * 100)
          );
          const isFulfilled = percent >= 100;
          const remaining = Math.max(0, item.targetAmount - item.collectedAmount);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden flex flex-col hover:shadow-md transition group"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-800 font-bold">
                    AmanahZIS
                  </div>
                )}
                {/* Badge Urgency */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                      item.urgency === 'Mendesak'
                        ? 'bg-rose-600 text-white'
                        : item.urgency === 'Prioritas'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {item.urgency}
                  </span>
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-xs text-white rounded-full text-[10px] font-medium">
                    {item.category}
                  </span>
                </div>

                {isFulfilled && (
                  <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex items-center justify-center text-white flex-col gap-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    <span className="font-bold text-sm">Alhamdulillah Terpenuhi!</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Progress Section */}
                  <div className="my-4">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-500">Terkumpul</span>
                      <span className="text-emerald-800 font-bold">{percent}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isFulfilled
                            ? 'bg-emerald-600'
                            : percent > 60
                            ? 'bg-emerald-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="font-bold text-slate-900">
                        {formatRupiah(item.collectedAmount)}
                      </span>
                      <span className="text-slate-500">
                        Target: {formatRupiah(item.targetAmount)}
                      </span>
                    </div>

                    {!isFulfilled && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">
                        Kekurangan: {formatRupiah(remaining)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer and Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Batas: {item.deadline || 'Bulan ini'}</span>
                  </div>

                  <button
                    onClick={() => onDonateItem(item)}
                    disabled={isFulfilled}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isFulfilled
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>{isFulfilled ? 'Selesai' : 'Bantu Item Ini'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
