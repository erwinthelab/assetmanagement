'use client';
import { useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAssets } from '@/lib/AssetContext';
import { ArrowLeft, CheckCircle, AlertTriangle, Box, Wrench, Clock } from 'lucide-react';
import Link from 'next/link';
import { BorrowLog } from '@/types';

function AssetDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const decodedId = id ? decodeURIComponent(id) : '';
  const { getAssetById, updateAssetStatus, updateAssetWithLog } = useAssets();
  
  const asset = getAssetById(decodedId);
  const [reportMode, setReportMode] = useState(false);
  const [reportNote, setReportNote] = useState('');

  // Borrow Flow state
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [checkinMode, setCheckinMode] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowType, setBorrowType] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');
  
  // Missing components logic
  const [missingCompsCheckout, setMissingCompsCheckout] = useState<string[]>([]);
  const [missingComps, setMissingComps] = useState<string[]>([]);

  if (!asset) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Asset Not Found</h2>
        <p className="text-slate-500 mt-2 mb-6">No asset matches the ID: {decodedId}</p>
        <Link href="/" className="text-blue-600 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: BorrowLog = {
      id: Math.random().toString(36).substr(2, 9),
      type: borrowType,
      borrowerName,
      checkoutTime: new Date().toISOString(),
      checkoutMissingComponents: missingCompsCheckout,
    };
    updateAssetWithLog(decodedId, 'BORROWED', newLog);
    setCheckoutMode(false);
    setBorrowerName('');
    setMissingCompsCheckout([]);
  };

  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    updateAssetWithLog(decodedId, 'AVAILABLE', undefined, missingComps);
    setCheckinMode(false);
    setMissingComps([]);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    updateAssetStatus(decodedId, 'MAINTENANCE');
    setReportMode(false);
    alert(`Damage report submitted for ${asset.name}. Note: ${reportNote}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-slate-800 transition">
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1 block">
              {asset.category} ASSET
            </span>
            <h1 className="text-2xl font-bold text-slate-800">{asset.name}</h1>
            <p className="text-slate-500 font-mono mt-1">{asset.id}</p>
          </div>
          <span className={`px-3 py-1.5 text-sm font-semibold rounded-lg ${
            asset.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 
            asset.status === 'BORROWED' ? 'bg-amber-100 text-amber-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {asset.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-6 text-sm">
          <div>
            <span className="text-slate-400 block mb-1">Location</span>
            <span className="font-medium text-slate-700">Lantai {asset.floor}</span>
          </div>
          {asset.category === 'SINGLE' && 'specifications' in asset && (
            <div>
              <span className="text-slate-400 block mb-1">Specifications</span>
              <span className="font-medium text-slate-700">{asset.specifications}</span>
            </div>
          )}
          {asset.category === 'SINGLE' && 'pic' in asset && asset.pic && (
            <div>
              <span className="text-slate-400 block mb-1">PIC</span>
              <span className="font-medium text-slate-700">{asset.pic}</span>
            </div>
          )}
          {asset.category === 'FURNITURE' && 'color' in asset && (
            <div>
              <span className="text-slate-400 block mb-1">Color</span>
              <span className="font-medium text-slate-700">{asset.color}</span>
            </div>
          )}
        </div>

        {asset.category === 'KIT' && 'components' in asset && !checkinMode && !checkoutMode && (
          <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center">
              <Box size={18} className="mr-2" /> Component Checklist
            </h3>
            <ul className="space-y-2">
              {asset.components.map(comp => (
                <li key={comp.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{comp.name}</span>
                  <span className="font-medium text-slate-800">x{comp.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {asset.status === 'AVAILABLE' && !checkoutMode && (
            <button onClick={() => setCheckoutMode(true)} className="flex-1 min-w-[140px] bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex justify-center items-center">
              <CheckCircle size={18} className="mr-2" /> Checkout (Borrow)
            </button>
          )}
          {asset.status === 'BORROWED' && !checkinMode && (
            <button onClick={() => setCheckinMode(true)} className="flex-1 min-w-[140px] bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex justify-center items-center">
              <CheckCircle size={18} className="mr-2" /> Check-in (Return)
            </button>
          )}
          
          {!reportMode && !checkoutMode && !checkinMode && (
            <button onClick={() => setReportMode(true)} className="flex-1 min-w-[140px] bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition flex justify-center items-center">
              <AlertTriangle size={18} className="mr-2" /> Report Damage
            </button>
          )}
        </div>

        {checkoutMode && (
          <form onSubmit={handleCheckout} className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg animate-in fade-in slide-in-from-top-2">
            <h3 className="font-bold text-blue-800 mb-4">Checkout Asset</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-900 mb-1">Peminjam (Nama/Kelas/Staff)</label>
              <input 
                type="text" required
                className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Contoh: Budi - Kelas 3 / Cabang BSD"
                value={borrowerName} onChange={e => setBorrowerName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-900 mb-1">Tipe Peminjaman</label>
              <select className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500" value={borrowType} onChange={e => setBorrowType(e.target.value as 'INTERNAL'|'EXTERNAL')}>
                <option value="INTERNAL">Internal (Dipakai saat kelas)</option>
                <option value="EXTERNAL">External (Dipinjam cabang lain/dibawa pulang)</option>
              </select>
            </div>
            
            {asset.category === 'KIT' && 'components' in asset && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-blue-900 mb-2">Kondisi Awal: Ceklis jika HILANG/RUSAK</label>
                <div className="space-y-2 bg-white p-3 rounded-lg border border-blue-100">
                  {asset.components.map(comp => (
                    <label key={comp.id} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        checked={missingCompsCheckout.includes(comp.name)}
                        onChange={(e) => {
                          if(e.target.checked) setMissingCompsCheckout([...missingCompsCheckout, comp.name]);
                          else setMissingCompsCheckout(missingCompsCheckout.filter(m => m !== comp.name));
                        }}
                      />
                      <span>Sudah Rusak/Hilang: {comp.name} (x{comp.quantity})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Submit Checkout</button>
              <button type="button" onClick={() => setCheckoutMode(false)} className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition">Batal</button>
            </div>
          </form>
        )}

        {checkinMode && (
          <form onSubmit={handleCheckin} className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg animate-in fade-in slide-in-from-top-2">
            <h3 className="font-bold text-green-800 mb-4">Check-in Asset</h3>
            
            {asset.category === 'KIT' && 'components' in asset && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-green-900 mb-2">Verifikasi Komponen (Ceklis jika HILANG/RUSAK)</label>
                <div className="space-y-2 bg-white p-3 rounded-lg border border-green-100">
                  {asset.components.map(comp => (
                    <label key={comp.id} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        checked={missingComps.includes(comp.name)}
                        onChange={(e) => {
                          if(e.target.checked) setMissingComps([...missingComps, comp.name]);
                          else setMissingComps(missingComps.filter(m => m !== comp.name));
                        }}
                      />
                      <span>Hilang/Rusak: {comp.name} (x{comp.quantity})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">Selesaikan Check-in</button>
              <button type="button" onClick={() => setCheckinMode(false)} className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition">Batal</button>
            </div>
          </form>
        )}

        {reportMode && (
          <form onSubmit={handleReport} className="mt-6 p-4 border border-red-200 bg-red-50 rounded-lg animate-in fade-in slide-in-from-top-2">
            <h3 className="font-bold text-red-800 flex items-center mb-4">
              <Wrench size={18} className="mr-2" /> File Damage Report
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-red-900 mb-1">Chronology / Details</label>
              <textarea 
                required
                className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                rows={3}
                placeholder="What happened to the asset?"
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-red-900 mb-1">Photo Evidence (Optional)</label>
              <input type="file" accept="image/*" capture="environment" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition">
                Submit & Set to Maintenance
              </button>
              <button type="button" onClick={() => setReportMode(false)} className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {asset.logs && asset.logs.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Clock size={18} className="mr-2" /> Log Peminjaman
          </h3>
          <div className="space-y-4">
            {[...asset.logs].reverse().map(log => (
              <div key={log.id} className="border-l-2 border-blue-500 pl-4 py-1 text-sm">
                <div className="flex justify-between items-start">
                  <strong className="text-slate-800">{log.borrowerName} <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{log.type}</span></strong>
                  <span className="text-xs text-slate-500">{new Date(log.checkoutTime).toLocaleDateString()} {new Date(log.checkoutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="text-slate-600 mt-1">
                  {log.checkinTime ? (
                    <span>
                      Dikembalikan pada {new Date(log.checkinTime).toLocaleDateString()} {new Date(log.checkinTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      {log.missingComponents && log.missingComponents.length > 0 && (
                        <span className="block mt-1 text-red-600 font-medium">Minus: {log.missingComponents.join(', ')}</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">Sedang dipinjam</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AssetDetail() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading asset details...</div>}>
      <AssetDetailContent />
    </Suspense>
  );
}
