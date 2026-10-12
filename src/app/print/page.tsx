'use client';
import { useAssets } from '@/lib/AssetContext';
import QRGenerator from '@/components/QRGenerator';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

export default function PrintQRCodes() {
  const { assets } = useAssets();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center print:hidden">
        <Link href="/" className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition">
          <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
        </Link>
        <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center shadow-sm">
          <Printer size={18} className="mr-2" /> Print Stickers
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 print:grid-cols-4 print:gap-2">
        {assets.map(asset => (
          <div key={asset.id} className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col items-center text-center bg-white dark:bg-slate-900 print:bg-white print:border-slate-300 page-break-inside-avoid shadow-sm transition-colors">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">AMTC System</h4>
            <div className="p-2 bg-white rounded-lg">
              <QRGenerator value={asset.id} size={100} />
            </div>
            <p className="mt-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 break-all w-full">{asset.id}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-1 truncate w-full">{asset.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
