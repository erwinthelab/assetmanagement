'use client';
import { useState } from 'react';
import { useAssets } from '@/lib/AssetContext';
import Link from 'next/link';
import { ArrowLeft, History, Filter } from 'lucide-react';

export default function HistoryPage() {
  const { assets } = useAssets();
  
  const [filterType, setFilterType] = useState<'ALL' | 'THIS_WEEK' | 'THIS_MONTH'>('ALL');

  // Extract all logs and group them by class session (borrowerName + checkoutTime)
  const groupedLogs = assets.reduce((acc, asset) => {
    if (asset.logs && asset.logs.length > 0) {
      asset.logs.forEach(log => {
        // Create a unique key for the session
        // To handle slight differences in ms, we group by minute
        const timeKey = new Date(log.checkoutTime).toISOString().slice(0, 16);
        const groupKey = `${log.borrowerName}_${timeKey}`;
        
        if (!acc[groupKey]) {
          acc[groupKey] = {
            id: groupKey,
            borrowerName: log.borrowerName,
            type: log.type,
            checkoutTime: log.checkoutTime,
            // Use the earliest checkinTime if some boxes are returned, but mostly they return together
            checkinTime: log.checkinTime,
            assets: []
          };
        }
        
        // Push the specific asset details to this session
        acc[groupKey].assets.push({
          assetName: asset.name,
          assetId: asset.id,
          checkoutMissing: log.checkoutMissingComponents || [],
          checkinMissing: log.missingComponents || []
        });

        // Update checkinTime if this box hasn't been returned yet
        if (!log.checkinTime) {
          acc[groupKey].checkinTime = undefined;
        }
      });
    }
    return acc;
  }, {} as Record<string, any>);

  const allSessions = Object.values(groupedLogs).sort((a, b) => new Date(b.checkoutTime).getTime() - new Date(a.checkoutTime).getTime());

  // Filter logs based on selection
  const filteredSessions = allSessions.filter(session => {
    if (filterType === 'ALL') return true;
    
    const logDate = new Date(session.checkoutTime);
    const now = new Date();
    
    if (filterType === 'THIS_MONTH') {
      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    }
    
    if (filterType === 'THIS_WEEK') {
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
        {filteredSessions.length === 0 ? (
          <p className="text-center text-slate-500 py-10">Belum ada riwayat peminjaman.</p>
        ) : (
          filteredSessions.map(session => (
            <div key={session.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition bg-white">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-start gap-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{session.borrowerName}</h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                    Meminjam {session.assets.length} Box
                  </span>
                </div>
                
                <div className="text-left md:text-right text-sm space-y-1">
                  <p className="text-slate-700">
                    <span className="font-medium">Pinjam:</span> {new Date(session.checkoutTime).toLocaleDateString()} {new Date(session.checkoutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  {session.checkinTime ? (
                    <p className="text-green-700">
                      <span className="font-medium">Kembali:</span> {new Date(session.checkinTime).toLocaleDateString()} {new Date(session.checkinTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  ) : (
                    <p className="text-amber-600 font-bold">Sedang Dipinjam</p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white space-y-3">
                {session.assets.map((a: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                    <p className="text-sm font-medium text-slate-700">
                      <Link href={`/asset/${encodeURIComponent(a.assetId)}`} className="hover:underline text-slate-800">
                        {a.assetName}
                      </Link>
                    </p>
                    
                    <div className="text-xs">
                      {a.checkoutMissing.length > 0 || a.checkinMissing.length > 0 ? (
                        <div className="space-y-1">
                          {a.checkoutMissing.length > 0 && (
                            <span className="block text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                              <span className="font-bold">Minus (Awal):</span> {a.checkoutMissing.join(', ')}
                            </span>
                          )}
                          {a.checkinMissing.length > 0 && (
                            <span className="block text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                              <span className="font-bold">Minus (Akhir):</span> {a.checkinMissing.join(', ')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">Tidak ada minus</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
