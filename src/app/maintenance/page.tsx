'use client';
import { useAssets } from '@/lib/AssetContext';
import { ArrowLeft, Wrench, AlertTriangle, Box } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  const { assets, updateAssetStatus, updateAssetMaintenanceLocation } = useAssets();

  // Find assets in maintenance
  const maintenanceAssets = assets.filter(a => a.status === 'MAINTENANCE');

  // Find assets that have missing components from their logs
  const missingComponentAssets = assets.filter(a => {
    if (!a.logs || a.logs.length === 0) return false;
    const lastLog = a.logs[a.logs.length - 1];
    return lastLog.missingComponents && lastLog.missingComponents.length > 0;
  });

  // Find assets with partial damage reports
  const partialDamageAssets = assets.filter(a => 
    a.damageReports && a.damageReports.some(report => report.components.length > 0)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <Wrench className="mr-2 text-red-500" /> Maintenance & Repair Report
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Damaged / Maintenance Assets */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-amber-500" size={20} /> Assets Under Maintenance
          </h2>
          {maintenanceAssets.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No assets currently under maintenance.</p>
          ) : (
            <ul className="space-y-3">
              {maintenanceAssets.map(asset => (
                <li key={asset.id} className="p-4 border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/20 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/asset/${encodeURIComponent(asset.id)}`} className="font-bold text-red-800 dark:text-red-300 hover:underline">
                        {asset.name}
                      </Link>
                      <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-1">{asset.id}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      asset.maintenanceLocation === 'SEDANG_DIPERBAIKI' 
                        ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800' 
                        : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}>
                      {asset.maintenanceLocation === 'SEDANG_DIPERBAIKI' ? 'Sedang Diperbaiki' : 'Masih di Cabang'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-red-200 dark:border-red-900/40 mt-1 flex flex-wrap gap-2">
                    {asset.maintenanceLocation !== 'SEDANG_DIPERBAIKI' && (
                      <button 
                        onClick={() => updateAssetMaintenanceLocation(asset.id, 'SEDANG_DIPERBAIKI')} 
                        className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded transition shadow-sm"
                      >
                        Kirim ke Pusat (Perbaiki)
                      </button>
                    )}
                    <button 
                      onClick={() => { if(confirm('Tandai sudah diperbaiki dan kembalikan ke AVAILABLE?')) updateAssetStatus(asset.id, 'AVAILABLE') }} 
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition shadow-sm"
                    >
                      ✔ Tandai Selesai Diperbaiki
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Missing Components */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <Box className="mr-2 text-blue-500" size={20} /> Missing Components (from Check-in)
          </h2>
          {missingComponentAssets.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No recent reports of missing components.</p>
          ) : (
            <ul className="space-y-3">
              {missingComponentAssets.map(asset => {
                const lastLog = asset.logs![asset.logs!.length - 1];
                return (
                  <li key={asset.id} className="p-4 border border-blue-200 dark:border-blue-900/40 bg-blue-50/80 dark:bg-blue-950/20 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/asset/${encodeURIComponent(asset.id)}`} className="font-bold text-blue-800 dark:text-blue-300 hover:underline">
                          {asset.name}
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(lastLog.checkinTime!).toLocaleDateString()}</p>
                      </div>
                      {asset.status !== 'MAINTENANCE' && (
                        <button 
                          onClick={() => { if(confirm('Pindahkan Box ini ke MAINTENANCE?')) updateAssetStatus(asset.id, 'MAINTENANCE') }}
                          className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded transition shadow-sm"
                        >
                          ⚠ Tandai Rusak (Maintenance)
                        </button>
                      )}
                      {asset.status === 'MAINTENANCE' && (
                        <span className="text-xs bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 px-2 py-1 rounded-full font-semibold">Maintenance</span>
                      )}
                    </div>
                    <div className="pt-2 border-t border-blue-200 dark:border-blue-900/40 mt-1">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium text-red-600 dark:text-red-400">Minus: </span> 
                        {lastLog.missingComponents?.join(', ')}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Partial Damage Reports */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-2 transition-colors">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <Wrench className="mr-2 text-red-500" size={20} /> Component Damage Reports
          </h2>
          {partialDamageAssets.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No component damage reports.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partialDamageAssets.map(asset => (
                asset.damageReports?.filter(r => r.components.length > 0).map(report => (
                  <div key={report.id} className="p-4 border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/20 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/asset/${encodeURIComponent(asset.id)}`} className="font-bold text-red-800 dark:text-red-300 hover:underline">
                          {asset.name}
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(report.date).toLocaleDateString()} {new Date(report.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      {asset.status !== 'MAINTENANCE' && (
                        <button 
                          onClick={() => { if(confirm('Pindahkan Box ini ke MAINTENANCE?')) updateAssetStatus(asset.id, 'MAINTENANCE') }}
                          className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded transition shadow-sm"
                        >
                          ⚠ Tandai Rusak (Maintenance)
                        </button>
                      )}
                      {asset.status === 'MAINTENANCE' && (
                        <span className="text-xs bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 px-2 py-1 rounded-full font-semibold">Maintenance</span>
                      )}
                    </div>
                    <div className="pt-2 border-t border-red-200 dark:border-red-900/40 mt-1">
                      <p className="text-sm text-red-700 dark:text-red-300 mb-1">
                        <span className="font-medium">Komponen Rusak: </span> 
                        {report.components.join(', ')}
                      </p>
                      <p className="text-sm text-red-900 dark:text-red-200 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-red-200 dark:border-slate-700">
                        <span className="font-medium">Alasan/Note: </span> 
                        {report.note}
                      </p>
                    </div>
                  </div>
                ))
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
