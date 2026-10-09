'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset } from '@/types';
import { initialData } from './data';

interface AssetContextType {
  assets: Asset[];
  updateAssetStatus: (id: string, status: Asset['status']) => void;
  getAssetById: (id: string) => Asset | undefined;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    // Load from local storage or use initial data
    const saved = localStorage.getItem('amtc-assets');
    if (saved) {
      setAssets(JSON.parse(saved));
    } else {
      setAssets(initialData);
      localStorage.setItem('amtc-assets', JSON.stringify(initialData));
    }
  }, []);

  const updateAssetStatus = (id: string, status: Asset['status']) => {
    setAssets(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, status } : a);
      localStorage.setItem('amtc-assets', JSON.stringify(updated));
      return updated;
    });
  };

  const getAssetById = (id: string) => {
    return assets.find(a => a.id === id);
  };

  return (
    <AssetContext.Provider value={{ assets, updateAssetStatus, getAssetById }}>
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
