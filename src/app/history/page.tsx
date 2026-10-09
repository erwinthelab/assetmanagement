'use client';
import { useState } from 'react';
import { useAssets } from '@/lib/AssetContext';
import Link from 'next/link';
import { ArrowLeft, History, Filter } from 'lucide-react';

export default function HistoryPage() {
  const { assets } = useAssets();
  
  const [filterType, setFilterType] = useState<'ALL' | 'THIS_WEEK' | 'THIS_MONTH'>('ALL');

  // Extract all logs from all assets and flatten them into a single array
  const allLogs = assets.reduce((acc, asset) => {
    if (asset.logs && asset.logs.length > 0) {
      const assetLogs = asset.logs.map(log => ({
        ...log,
        assetName: asset.name,
        assetId: asset.id,
        assetCategory: asset.category,
      }));
      return [...acc, ...assetLogs];
    }
    return acc;
  }, [] as any[]).sort((a, b) => new Date(b.checkoutTime).getTime() - new Date(a.checkoutTime).getTime());

  // Filter logs based on selection
  const filteredLogs = allLogs.filter(log => {
    if (filterType === 'ALL') return true;
    
    const logDate = new Date(log.checkoutTime);
    const now = new Date();
    
    if (filterType === 'THIS_MONTH') {
      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    }
    
    if (filterType === 'THIS_WEEK') {
      // Very simple this week check (within last 7 days)
      const diffTime = Math.abs(now.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays <= 7;
    }
    
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <History className="mr-2 text-blue-600" /> History Peminjaman
        </h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
        <Filter className="text-slate-400" size={20} />
        <select 
          className="p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="ALL">Semua Waktu</option>
          <option value="THIS_WEEK">7 Hari Terakhir</option>
          <option value="THIS_MONTH">Bulan Ini</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
        {filteredLogs.length === 0 ? (
          <p className="text-center text-slate-500 py-10">Belum ada riwayat peminjaman.</p>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{log.borrowerName}</h3>
                  <p className="text-sm text-slate-600">
                    Meminjam <Link href={`/asset/${encodeURIComponent(log.assetId)}`} className="font-bold text-blue-600 hover:underline">{log.assetName}</Link> ({log.assetId})
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-slate-200 text-slate-700 rounded">
                    Tipe: {log.type}
                  </span>
                </div>
                
                <div className="text-left md:text-right text-sm space-y-1">
                  <p className="text-slate-700">
                    <span className="font-medium">Pinjam:</span> {new Date(log.checkoutTime).toLocaleDateString()} {new Date(log.checkoutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  {log.checkinTime ? (
                    <p className="text-green-700">
                      <span className="font-medium">Kembali:</span> {new Date(log.checkinTime).toLocaleDateString()} {new Date(log.checkinTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  ) : (
                    <p className="text-amber-600 font-bold">Sedang Dipinjam</p>
                  )}
                </div>
              </div>

              {/* Tampilkan jika ada minus */}
              {(log.checkoutMissingComponents?.length > 0 || log.missingComponents?.length > 0) && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm">
                  {log.checkoutMissingComponents?.length > 0 && (
                    <p className="text-red-700">
                      <span className="font-bold">Minus saat Pinjam:</span> {log.checkoutMissingComponents.join(', ')}
                    </p>
                  )}
                  {log.missingComponents?.length > 0 && (
                    <p className="text-red-700">
                      <span className="font-bold">Minus saat Kembali:</span> {log.missingComponents.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
