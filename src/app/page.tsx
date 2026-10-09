'use client';
import { useState } from 'react';
import { useAssets } from '@/lib/AssetContext';
import { BorrowLog } from '@/types';
import Link from 'next/link';

export default function ClassPortal() {
  const { assets, updateAssetWithLog } = useAssets();
  
  const [teacherName, setTeacherName] = useState('');
  const [classType, setClassType] = useState<'KINDER' | 'JUNIOR' | 'CODER' | ''>('');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [checkedComps, setCheckedComps] = useState<string[]>([]);

  // Map class to floor
  const getFloor = () => {
    if (classType === 'KINDER') return 1;
    if (classType === 'JUNIOR') return 2;
    if (classType === 'CODER') return 3;
    return 0;
  };

  const availableKits = assets.filter(a => a.category === 'KIT' && a.status === 'AVAILABLE' && a.floor === getFloor());
  const selectedAsset = availableKits.find(a => a.id === selectedAssetId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !selectedAssetId) return;

    let actualMissingCheckout: string[] = [];
    if (selectedAsset.category === 'KIT' && 'components' in selectedAsset) {
      actualMissingCheckout = selectedAsset.components.filter(c => !checkedComps.includes(c.name)).map(c => c.name);
    }

    const newLog: BorrowLog = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'INTERNAL',
      borrowerName: `${teacherName} (Class: ${classType})`,
      checkoutTime: new Date().toISOString(),
      checkoutMissingComponents: actualMissingCheckout,
    };

    updateAssetWithLog(selectedAssetId, 'BORROWED', newLog);
    
    // Reset form
    setTeacherName('');
    setClassType('');
    setSelectedAssetId('');
    setCheckedComps([]);
    alert('Berhasil Checkout Box untuk kelas!');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Class Portal</h1>
        <p className="text-slate-500 mt-2">Mulai kelas dan pinjam SPIKE Box Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Teacher / Pengajar</label>
          <input 
            type="text" required
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Contoh: Erwin"
            value={teacherName} onChange={e => setTeacherName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Kelas</label>
          <select 
            required
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={classType} onChange={e => {
              setClassType(e.target.value as any);
              setSelectedAssetId(''); // Reset selection when class changes
              setCheckedComps([]);
            }}
          >
            <option value="" disabled>-- Pilih Kelas --</option>
            <option value="KINDER">Kinder (Lantai 1)</option>
            <option value="JUNIOR">Junior (Lantai 2)</option>
            <option value="CODER">Coder (Lantai 3)</option>
          </select>
        </div>

        {classType && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Box SPIKE (Tersedia)</label>
            {availableKits.length === 0 ? (
              <p className="text-red-500 text-sm py-2 bg-red-50 px-3 rounded-lg border border-red-100">Semua box di Lantai {getFloor()} sedang dipinjam atau dalam perbaikan.</p>
            ) : (
              <select 
                required
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}
              >
                <option value="" disabled>-- Pilih SPIKE Box --</option>
                {availableKits.map(kit => (
                  <option key={kit.id} value={kit.id}>{kit.name} ({kit.id})</option>
                ))}
              </select>
            )}
          </div>
        )}

        {selectedAsset && selectedAsset.category === 'KIT' && 'components' in selectedAsset && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <label className="block text-sm font-medium text-blue-900 mb-3">Kelengkapan Awal: Ceklis komponen yang ADA di dalam box</label>
            <div className="space-y-2 bg-white p-3 rounded-lg border border-blue-100 max-h-[250px] overflow-y-auto">
              {selectedAsset.components.map(comp => (
                <label key={comp.id} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    checked={checkedComps.includes(comp.name)}
                    onChange={(e) => {
                      if(e.target.checked) setCheckedComps([...checkedComps, comp.name]);
                      else setCheckedComps(checkedComps.filter(m => m !== comp.name));
                    }}
                  />
                  <span>{comp.name} (x{comp.quantity})</span>
                </label>
              ))}
            </div>
            {selectedAsset.components.length !== checkedComps.length && (
              <p className="text-xs text-red-500 mt-2">* Peringatan: Ada komponen yang belum diceklis (dianggap hilang).</p>
            )}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!selectedAssetId}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mulai Kelas & Pinjam Box
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-4 text-sm mt-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">Admin Dashboard</Link>
        <span className="text-slate-300">|</span>
        <Link href="/history" className="text-blue-600 hover:underline">History Peminjaman</Link>
      </div>
    </div>
  );
}
