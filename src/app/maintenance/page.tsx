'use client';
import { useAssets } from '@/lib/AssetContext';
import { ArrowLeft, Wrench, AlertTriangle, Box } from 'lucide-react';
import Link from 'next/link';
import { Asset } from '@/types';

export default function MaintenancePage() {
  const { assets } = useAssets();

  // Find assets in maintenance
  const maintenanceAssets = assets.filter(a => a.status === 'MAINTENANCE');

  // Find assets that have missing components from their logs
  const missingComponentAssets = assets.filter(a => {
    if (!a.logs || a.logs.length === 0) return false;
    const lastLog = a.logs[a.logs.length - 1];
    return lastLog.missingComponents && lastLog.missingComponents.length > 0;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <Wrench className="mr-2 text-red-500" /> Maintenance & Repair Report
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Damaged / Maintenance Assets */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-amber-500" size={20} /> Assets Under Maintenance
          </h2>
          {maintenanceAssets.length === 0 ? (
            <p className="text-slate-500 text-sm">No assets currently under maintenance.</p>
          ) : (
            <ul className="space-y-3">
              {maintenanceAssets.map(asset => (
                <li key={asset.id} className="p-3 border border-red-100 bg-red-50 rounded-lg">
                  <div className="flex justify-between">
                    <Link href={`/asset/${encodeURIComponent(asset.id)}`} className="font-bold text-red-800 hover:underline">
                      {asset.name}
                    </Link>
                    <span className="text-xs font-mono text-red-600">{asset.id}</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">Lantai {asset.floor} | {asset.category}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Missing Components */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Box className="mr-2 text-blue-500" size={20} /> Missing/Damaged Kit Components
          </h2>
          {missingComponentAssets.length === 0 ? (
            <p className="text-slate-500 text-sm">No recent reports of missing components.</p>
          ) : (
            <ul className="space-y-3">
              {missingComponentAssets.map(asset => {
                const lastLog = asset.logs![asset.logs!.length - 1];
                return (
                  <li key={asset.id} className="p-3 border border-blue-100 bg-blue-50 rounded-lg">
                    <div className="flex justify-between">
                      <Link href={`/asset/${encodeURIComponent(asset.id)}`} className="font-bold text-blue-800 hover:underline">
                        {asset.name}
                      </Link>
                      <span className="text-xs text-slate-500">{new Date(lastLog.checkinTime!).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      <span className="font-medium text-red-600">Minus: </span> 
                      {lastLog.missingComponents?.join(', ')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Last user: {lastLog.borrowerName}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
