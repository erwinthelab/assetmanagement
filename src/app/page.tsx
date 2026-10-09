'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAssets } from '@/lib/AssetContext';
import { Search, Filter, Box, Laptop, Grid2x2 } from 'lucide-react';

export default function Dashboard() {
  const { assets, resetData } = useAssets();
  const [filterFloor, setFilterFloor] = useState<number | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredAssets = assets.filter(asset => {
    if (filterFloor !== 'ALL' && asset.floor !== filterFloor) return false;
    if (filterCategory !== 'ALL' && asset.category !== filterCategory) return false;
    if (search && !asset.name.toLowerCase().includes(search.toLowerCase()) && !asset.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Asset Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={() => { if(confirm('Reset all data to dummy?')) resetData() }} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition">
            Reset Data
          </button>
          <Link href="/print" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Print QR Codes
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search asset ID or name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
          >
            <option value="ALL">All Floors</option>
            <option value="1">Lantai 1 - Kinder</option>
            <option value="2">Lantai 2 - Junior</option>
            <option value="3">Lantai 3 - Coder</option>
          </select>
          <select 
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => (
          <Link href={`/asset/${encodeURIComponent(asset.id)}`} key={asset.id} className="block">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition group h-full flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                  {asset.category === 'KIT' && <Box size={20} />}
                  {asset.category === 'SINGLE' && <Laptop size={20} />}
                  {asset.category === 'FURNITURE' && <Grid2x2 size={20} />}
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  asset.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 
                  asset.status === 'BORROWED' ? 'bg-amber-100 text-amber-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {asset.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{asset.name}</h3>
              <p className="text-slate-500 text-sm font-mono mb-4">{asset.id}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
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
        <div className="text-center py-12 text-slate-500">
          No assets found matching your criteria.
        </div>
      )}
    </div>
  );
}
