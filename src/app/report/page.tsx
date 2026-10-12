'use client';
import Link from 'next/link';

export default function ReportPage() {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Fast Report</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        To report a damaged asset, please scan its QR code first or search for it in the dashboard.
      </p>
      <div className="flex flex-col gap-3">
        <Link href="/scanner" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition shadow-sm">
          Scan QR Code
        </Link>
        <Link href="/" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-lg font-medium border border-slate-200 dark:border-slate-700 transition">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
