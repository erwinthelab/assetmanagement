'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset, BorrowLog } from '@/types';
import { initialData } from './data';
import { supabase } from './supabase';

interface AssetContextType {
  assets: Asset[];
  updateAssetStatus: (id: string, status: Asset['status']) => void;
  updateAssetMaintenanceLocation: (id: string, location: 'DI_CABANG' | 'SEDANG_DIPERBAIKI') => void;
  updateAssetWithLog: (id: string, status: Asset['status'], log?: BorrowLog, missingComponents?: string[]) => void;
  getAssetById: (id: string) => Asset | undefined;
  resetData: () => void;
  isLoading: boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('assets').select('*');
    if (error || !data || data.length === 0) {
      console.log('No data in Supabase, using initial data locally...');
      // Fallback locally if Supabase not seeded or keys are wrong
      const saved = localStorage.getItem('amtc-assets-v3');
      if (saved) {
        setAssets(JSON.parse(saved));
      } else {
        setAssets(initialData);
      }
    } else {
      const parsedAssets = data.map((row: any) => ({
        id: row.id,
        ...row.data
      }));
      setAssets(parsedAssets);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const saveAssets = async (newAssets: Asset[]) => {
    setAssets(newAssets);
    localStorage.setItem('amtc-assets-v3', JSON.stringify(newAssets));
    
    // Attempt to sync to Supabase
    const rows = newAssets.map(a => ({
      id: a.id,
      data: a
    }));
    const { error } = await supabase.from('assets').upsert(rows);
    if (error) console.error('Supabase Upsert Error:', error);
  };

  const updateAssetStatus = (id: string, status: Asset['status']) => {
    saveAssets(assets.map(a => a.id === id ? { ...a, status, maintenanceLocation: status === 'MAINTENANCE' ? 'DI_CABANG' : undefined } : a));
  };

  const updateAssetMaintenanceLocation = (id: string, location: 'DI_CABANG' | 'SEDANG_DIPERBAIKI') => {
    saveAssets(assets.map(a => a.id === id ? { ...a, maintenanceLocation: location } : a));
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

  const resetData = async () => {
    setIsLoading(true);
    await saveAssets(initialData);
    setIsLoading(false);
  };

  return (
    <AssetContext.Provider value={{ assets, updateAssetStatus, updateAssetMaintenanceLocation, updateAssetWithLog, getAssetById, resetData, isLoading }}>
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
