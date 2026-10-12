'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAssets } from '@/lib/AssetContext';
import { Search, Filter, Box, Laptop, Grid2x2 } from 'lucide-react';

export default function Dashboard() {
  const { assets, resetData } = useAssets();
  const [filterFloor, setFilterFloor] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Explicit state for applied filters
  const [applied, setApplied] = useState({
    floor: 'ALL',
    category: 'ALL',
    search: ''
  });

  const handleApply = () => setApplied({ floor: filterFloor, category: filterCategory, search });
  const handleClear = () => {
    setFilterFloor('ALL'); setFilterCategory('ALL'); setSearch('');
    setApplied({ floor: 'ALL', category: 'ALL', search: '' });
  };

  const filteredAssets = assets.filter(asset => {
    if (!asset) return false;
    if (applied.floor !== 'ALL' && asset.floor?.toString() !== applied.floor) return false;
    if (applied.category !== 'ALL' && asset.category !== applied.category) return false;
    
    if (applied.search) {
      const searchLower = applied.search.toLowerCase();
      const nameMatch = asset.name?.toLowerCase().includes(searchLower);
      const idMatch = asset.id?.toLowerCase().includes(searchLower);
      if (!nameMatch && !idMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Asset Dashboard</h1>
        <div className="flex gap-2 flex-wrap">
          <Link href="/maintenance" className="px-4 py-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-transparent dark:border-amber-900/40 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/60 transition">
            Maintenance Report
          </Link>
          <button onClick={() => { if(confirm('Reset all data to dummy?')) resetData() }} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition">
            Reset Data
          </button>
          <Link href="/print" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm">
            Print QR Codes
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4 transition-colors">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search asset ID or name..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
            >
              <option value="ALL">All Floors</option>
              <option value="1">Lantai 1 - Kinder</option>
              <option value="2">Lantai 2 - Junior</option>
              <option value="3">Lantai 3 - Coder</option>
            </select>
            <select 
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="KIT">Kit / Package</option>
              <option value="SINGLE">Single Unit</option>
              <option value="FURNITURE">Furniture</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800 pt-3">
          <button onClick={handleClear} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition">
            Clear Filters
          </button>
          <button onClick={handleApply} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition flex items-center shadow-sm">
            <Filter size={16} className="mr-2" /> Apply Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => (
          <Link href={`/asset/${encodeURIComponent(asset.id)}`} key={asset.id} className="block">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-md dark:hover:border-slate-700 transition group h-full flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                  {asset.category === 'KIT' && <Box size={20} />}
                  {asset.category === 'SINGLE' && <Laptop size={20} />}
                  {asset.category === 'FURNITURE' && <Grid2x2 size={20} />}
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                  asset.status === 'AVAILABLE' ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900/40' : 
                  asset.status === 'BORROWED' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/40' : 
                  'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/40'
                }`}>
                  {asset.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight mb-1">{asset.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-mono mb-4">{asset.id}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <span>Lantai {asset.floor}</span>
                {asset.category === 'SINGLE' && 'specifications' in asset && (
                  <span className="truncate max-w-[150px]">{asset.specifications}</span>
                )}
                {asset.category === 'FURNITURE' && 'quantity' in asset && (
                  <span>Qty: {asset.quantity}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filteredAssets.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          No assets found matching your criteria.
        </div>
      )}
    </div>
  );
}
