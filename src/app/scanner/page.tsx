'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Scanner from '@/components/Scanner';
import { AlertCircle } from 'lucide-react';

export default function ScannerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    // Assuming the QR code contains the Asset ID
    router.push(`/asset/${encodeURIComponent(decodedText)}`);
  };

  const handleScanFailure = (err: any) => {
    // Ignoring routine scan failures (no QR code found)
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Scan Asset QR</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Point your camera at the asset's QR code to view details.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <Scanner onScanSuccess={handleScanSuccess} onScanFailure={handleScanFailure} />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 p-4 rounded-lg flex gap-3 items-start">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
