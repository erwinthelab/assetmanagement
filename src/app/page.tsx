'use client';
import { useState } from 'react';
import { useAssets } from '@/lib/AssetContext';
import { BorrowLog } from '@/types';
import Link from 'next/link';
import { CheckCircle, Undo2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ClassPortal() {
  const { assets, updateMultipleAssetsWithLog } = useAssets();
  
  const [activeTab, setActiveTab] = useState<'START' | 'ACTIVE'>('START');
  
  // Checkout State
  const [teacherName, setTeacherName] = useState('');
  const [classType, setClassType] = useState<'KINDER' | 'JUNIOR' | 'CODER' | ''>('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  // Store missing components per asset id: { assetId: [compName1, compName2] }
  const [missingCompsCheckout, setMissingCompsCheckout] = useState<Record<string, string[]>>({});

  // Active Classes grouping
  // We identify an active class by borrowerName (which contains the teacher and class)
  const activeBorrowedAssets = assets.filter(a => a.status === 'BORROWED' && a.category === 'KIT');
  
  // Group by borrowerName
  const activeGroups = activeBorrowedAssets.reduce((acc, asset) => {
    const lastLog = asset.logs?.[asset.logs.length - 1];
    if (lastLog && !lastLog.checkinTime) {
      const bName = lastLog.borrowerName;
      if (!acc[bName]) acc[bName] = { borrowerName: bName, assets: [], checkoutTime: lastLog.checkoutTime };
      acc[bName].assets.push(asset);
    }
    return acc;
  }, {} as Record<string, { borrowerName: string, checkoutTime: string, assets: typeof assets }>);

  // Map class to floor
  const getFloor = () => {
    if (classType === 'KINDER') return 1;
    if (classType === 'JUNIOR') return 2;
    if (classType === 'CODER') return 3;
    return 0;
  };

  const availableKits = assets.filter(a => a.category === 'KIT' && a.status === 'AVAILABLE' && a.floor === getFloor());

  const handleToggleAsset = (assetId: string) => {
    setSelectedAssetIds(prev => 
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  const handleToggleMissingCheckout = (assetId: string, compName: string) => {
    setMissingCompsCheckout(prev => {
      const current = prev[assetId] || [];
      const updated = current.includes(compName) ? current.filter(c => c !== compName) : [...current, compName];
      return { ...prev, [assetId]: updated };
    });
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAssetIds.length === 0) {
      alert('Pilih minimal 1 SPIKE Box!');
      return;
    }

    const updates = selectedAssetIds.map(id => {
      const missing = missingCompsCheckout[id] || [];
      const newLog: BorrowLog = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'INTERNAL',
        borrowerName: `${teacherName} (Class: ${classType})`,
        checkoutTime: new Date().toISOString(),
        checkoutMissingComponents: missing,
      };
      return { id, status: 'BORROWED' as const, log: newLog };
    });

    updateMultipleAssetsWithLog(updates);
    
    // Reset form
    setTeacherName('');
    setClassType('');
    setSelectedAssetIds([]);
    setMissingCompsCheckout({});
    alert('Berhasil memulai kelas & meminjam Box!');
    setActiveTab('ACTIVE');
  };

  // Return logic state
  const [returningGroup, setReturningGroup] = useState<string | null>(null);
  const [missingCompsCheckin, setMissingCompsCheckin] = useState<Record<string, string[]>>({});

  const handleToggleMissingCheckin = (assetId: string, compName: string) => {
    setMissingCompsCheckin(prev => {
      const current = prev[assetId] || [];
      const updated = current.includes(compName) ? current.filter(c => c !== compName) : [...current, compName];
      return { ...prev, [assetId]: updated };
    });
  };

  const handleSubmitCheckin = (borrowerName: string) => {
    const group = activeGroups[borrowerName];
    if (!group) return;

    const updates = group.assets.map(asset => {
      const missing = missingCompsCheckin[asset.id] || [];
      return { id: asset.id, status: 'AVAILABLE' as const, missingComponents: missing };
    });

    updateMultipleAssetsWithLog(updates);

    setReturningGroup(null);
    setMissingCompsCheckin({});
    alert('Semua box dari kelas ini berhasil dikembalikan!');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Class Portal</h1>
        <p className="text-slate-500 mt-2">Mulai kelas atau selesaikan kelas dengan cepat.</p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button 
          onClick={() => setActiveTab('START')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition ${activeTab === 'START' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          ▶ Mulai Kelas Baru
        </button>
        <button 
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition ${activeTab === 'ACTIVE' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Selesaikan Kelas ({Object.keys(activeGroups).length})
        </button>
      </div>

      {activeTab === 'START' && (
        <form onSubmit={handleSubmitCheckout} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-5 animate-in fade-in">
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
                setSelectedAssetIds([]); 
                setMissingCompsCheckout({});
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Box SPIKE yang Dipakai (Bisa Lebih dari 1)</label>
              {availableKits.length === 0 ? (
                <p className="text-red-500 text-sm py-2 bg-red-50 px-3 rounded-lg border border-red-100">Semua box di Lantai {getFloor()} sedang dipinjam atau dalam perbaikan.</p>
              ) : (
                <div className="space-y-3">
                  {availableKits.map(kit => {
                    const isSelected = selectedAssetIds.includes(kit.id);
                    return (
                      <div key={kit.id} className={`border rounded-lg overflow-hidden transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                        <label className="flex items-center p-3 cursor-pointer hover:bg-slate-50">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                            checked={isSelected}
                            onChange={() => handleToggleAsset(kit.id)}
                          />
                          <span className={`font-medium ${isSelected ? 'text-blue-800' : 'text-slate-700'}`}>{kit.name} ({kit.id})</span>
                        </label>
                        
                        {/* Jika Box dipilih, tampilkan opsi ceklis jika ada yang hilang (Optional) */}
                        {isSelected && 'components' in kit && (
                          <div className="p-3 pt-0 border-t border-blue-100 mt-1">
                            <p className="text-xs text-blue-700 font-medium mb-2">Ceklis jika ada komponen yang SUDAH HILANG / RUSAK sejak awal:</p>
                            <div className="grid grid-cols-2 gap-1">
                              {kit.components.map(comp => (
                                <label key={comp.id} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer bg-white p-1.5 rounded border border-blue-100">
                                  <input 
                                    type="checkbox" 
                                    className="w-3 h-3 text-red-500 rounded focus:ring-red-500"
                                    checked={(missingCompsCheckout[kit.id] || []).includes(comp.name)}
                                    onChange={() => handleToggleMissingCheckout(kit.id, comp.name)}
                                  />
                                  <span className="truncate">{comp.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={selectedAssetIds.length === 0}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <CheckCircle size={20} className="mr-2" /> Mulai Kelas & Pinjam Box
          </button>
        </form>
      )}

      {activeTab === 'ACTIVE' && (
        <div className="space-y-4 animate-in fade-in">
          {Object.keys(activeGroups).length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-500">
              Tidak ada kelas yang sedang meminjam SPIKE Box saat ini.
            </div>
          ) : (
            Object.values(activeGroups).map(group => (
              <div key={group.borrowerName} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{group.borrowerName}</h3>
                    <p className="text-xs text-slate-500">Mulai: {new Date(group.checkoutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-bold">{group.assets.length} Box Dipinjam</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.assets.map(a => (
                    <span key={a.id} className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                      {a.name}
                    </span>
                  ))}
                </div>

                {returningGroup === group.borrowerName ? (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm font-bold text-red-700 mb-2">Ceklis jika ada komponen yang HILANG/RUSAK saat pengembalian:</p>
                    <div className="space-y-3 mb-4">
                      {group.assets.map(kit => (
                        <div key={kit.id} className="bg-red-50 p-3 rounded border border-red-100">
                          <p className="text-xs font-bold text-red-800 mb-2">{kit.name} ({kit.id})</p>
                          {'components' in kit && (
                            <div className="grid grid-cols-2 gap-1">
                              {kit.components.map(comp => (
                                <label key={comp.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer bg-white p-1.5 rounded border border-red-100">
                                  <input 
                                    type="checkbox" 
                                    className="w-3 h-3 text-red-600 rounded focus:ring-red-500"
                                    checked={(missingCompsCheckin[kit.id] || []).includes(comp.name)}
                                    onChange={() => handleToggleMissingCheckin(kit.id, comp.name)}
                                  />
                                  <span className="truncate">{comp.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleSubmitCheckin(group.borrowerName)} className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition">
                        Konfirmasi Selesai
                      </button>
                      <button onClick={() => setReturningGroup(null)} className="px-4 bg-slate-200 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-300 transition">
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setReturningGroup(group.borrowerName)} className="w-full bg-green-50 text-green-700 font-bold py-2 rounded-lg border border-green-200 hover:bg-green-100 transition flex items-center justify-center">
                    <Undo2 size={16} className="mr-2" /> Selesaikan Kelas & Kembalikan Box
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 text-sm mt-8 border-t border-slate-200 pt-6">
        <Link href="/dashboard" className="text-slate-500 hover:text-blue-600 font-medium transition">Admin Dashboard</Link>
        <span className="text-slate-300">|</span>
        <Link href="/history" className="text-slate-500 hover:text-blue-600 font-medium transition">History Peminjaman</Link>
      </div>
    </div>
  );
}
