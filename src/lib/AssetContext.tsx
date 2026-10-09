'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset, BorrowLog } from '@/types';
import { initialData } from './data';

interface AssetContextType {
  assets: Asset[];
  updateAssetStatus: (id: string, status: Asset['status']) => void;
  updateAssetWithLog: (id: string, status: Asset['status'], log?: BorrowLog, missingComponents?: string[]) => void;
  getAssetById: (id: string) => Asset | undefined;
  resetData: () => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('amtc-assets-v2');
    if (saved) {
      setAssets(JSON.parse(saved));
    } else {
      setAssets(initialData);
      localStorage.setItem('amtc-assets-v2', JSON.stringify(initialData));
    }
  }, []);

  const saveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    localStorage.setItem('amtc-assets-v2', JSON.stringify(newAssets));
  };

  const updateAssetStatus = (id: string, status: Asset['status']) => {
    saveAssets(assets.map(a => a.id === id ? { ...a, status } : a));
  };

  const updateAssetWithLog = (id: string, status: Asset['status'], newLog?: BorrowLog, missingComponents?: string[]) => {
    saveAssets(assets.map(a => {
      if (a.id !== id) return a;
      
      const updatedLogs = [...(a.logs || [])];
      
      if (newLog) {
        updatedLogs.push(newLog);
      } else if (status === 'AVAILABLE' && updatedLogs.length > 0) {
        // Find last active log and close it
        const lastLogIndex = updatedLogs.length - 1;
        if (!updatedLogs[lastLogIndex].checkinTime) {
          updatedLogs[lastLogIndex] = {
            ...updatedLogs[lastLogIndex],
            checkinTime: new Date().toISOString(),
            missingComponents: missingComponents || []
          };
        }
      }
      
      return { ...a, status, logs: updatedLogs };
    }));
  };

  const getAssetById = (id: string) => assets.find(a => a.id === id);

  const resetData = () => {
    saveAssets(initialData);
  };

  return (
    <AssetContext.Provider value={{ assets, updateAssetStatus, updateAssetWithLog, getAssetById, resetData }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
}
