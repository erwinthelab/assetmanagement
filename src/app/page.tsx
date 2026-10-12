'use client';
import { useState } from 'react';
import { useAssets } from '@/lib/AssetContext';
import { BorrowLog } from '@/types';
import Link from 'next/link';
import { CheckCircle, Undo2 } from 'lucide-react';

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
    <div className="max-w-xl mx-auto space-y-6 mt-4 md:mt-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">Booking & Return</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">Record of classes that are currently borrowing SPIKE Box</p>
      </div>

      <div className="flex bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl transition-colors">
        <button
          onClick={() => setActiveTab('START')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'START' 
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          ▶ Start New Classes
        </button>
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'ACTIVE' 
              ? 'bg-white dark:bg-slate-900 text-green-600 dark:text-green-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Return Classes ({Object.keys(activeGroups).length})
        </button>
      </div>

      {activeTab === 'START' && (
        <form onSubmit={handleSubmitCheckout} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in transition-colors">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teacher's Name</label>
            <input
              type="text" required
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              placeholder="Teacher's Name"
              value={teacherName} onChange={e => setTeacherName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Class</label>
            <select
              required
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              value={classType} onChange={e => {
                setClassType(e.target.value as any);
                setSelectedAssetIds([]);
                setMissingCompsCheckout({});
              }}
            >
              <option value="" disabled>-- Choose Class --</option>
              <option value="KINDER">Kinder (1st Floor)</option>
              <option value="JUNIOR">Junior (2nd Floor)</option>
              <option value="CODER">Coder (3rd Floor)</option>
            </select>
          </div>

          {classType && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select SPIKE Box</label>
              {availableKits.length === 0 ? (
                <p className="text-red-500 dark:text-red-400 text-sm py-2.5 px-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
                  All SPIKE Box on Floor {getFloor()} are currently borrowed or under maintenance.
                </p>
              ) : (
                <div className="space-y-3">
                  {availableKits.map(kit => {
                    const isSelected = selectedAssetIds.includes(kit.id);
                    return (
                      <div 
                        key={kit.id} 
                        className={`border rounded-lg overflow-hidden transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 dark:border-blue-500 ring-1 ring-blue-500/30' 
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <label className="flex items-center p-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                            checked={isSelected}
                            onChange={() => handleToggleAsset(kit.id)}
                          />
                          <span className={`font-medium ${isSelected ? 'text-blue-800 dark:text-blue-300 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                            {kit.name} ({kit.id})
                          </span>
                        </label>

                        {/* If Box is selected, display checkbox options if any are missing */}
                        {isSelected && 'components' in kit && (
                          <div className="p-3 pt-0 border-t border-blue-100 dark:border-blue-900/40 mt-1">
                            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-2">Check if any components are MISSING / DAMAGED since the beginning:</p>
                            <div className="grid grid-cols-2 gap-1.5">
                              {kit.components.map(comp => (
                                <label key={comp.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer bg-white dark:bg-slate-800 p-2 rounded border border-blue-100 dark:border-slate-700 transition-colors">
                                  <input
                                    type="checkbox"
                                    className="w-3.5 h-3.5 text-red-500 rounded focus:ring-red-500"
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
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
          >
            <CheckCircle size={20} className="mr-2" /> Mulai Kelas & Pinjam Box
          </button>
        </form>
      )}

      {activeTab === 'ACTIVE' && (
        <div className="space-y-4 animate-in fade-in">
          {Object.keys(activeGroups).length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 transition-colors">
              Tidak ada kelas yang sedang meminjam SPIKE Box saat ini.
            </div>
          ) : (
            Object.values(activeGroups).map(group => (
              <div key={group.borrowerName} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{group.borrowerName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mulai: {new Date(group.checkoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-200 dark:border-amber-900/50">
                    {group.assets.length} Box Dipinjam
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {group.assets.map(a => (
                    <span key={a.id} className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                      {a.name}
                    </span>
                  ))}
                </div>

                {returningGroup === group.borrowerName ? (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-2">Check if any components are MISSING / DAMAGED when returning:</p>
                    <div className="space-y-3 mb-4">
                      {group.assets.map(kit => (
                        <div key={kit.id} className="bg-red-50/80 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900/40">
                          <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-2">{kit.name} ({kit.id})</p>
                          {'components' in kit && (
                            <div className="grid grid-cols-2 gap-1.5">
                              {kit.components.map(comp => (
                                <label key={comp.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer bg-white dark:bg-slate-800 p-2 rounded border border-red-100 dark:border-slate-700">
                                  <input
                                    type="checkbox"
                                    className="w-3.5 h-3.5 text-red-600 rounded focus:ring-red-500"
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
                      <button onClick={() => handleSubmitCheckin(group.borrowerName)} className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white font-bold py-2.5 rounded-lg transition shadow-sm">
                        Confirm Finish
                      </button>
                      <button onClick={() => setReturningGroup(null)} className="px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-lg transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setReturningGroup(group.borrowerName)} className="w-full bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 font-bold py-2.5 rounded-lg border border-green-200 dark:border-green-800/60 transition flex items-center justify-center">
                    <Undo2 size={16} className="mr-2" /> Finish Classes & Return Box
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 text-sm mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
        <Link href="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">AMTS Dashboard</Link>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <Link href="/history" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">Borrowing History</Link>
      </div>
    </div>
  );
}
