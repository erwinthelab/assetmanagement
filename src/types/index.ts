export type AssetCategory = 'KIT' | 'SINGLE' | 'FURNITURE';
export type AssetStatus = 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE';

export interface ChildComponent {
  id: string;
  name: string;
  quantity: number;
}

export interface BorrowLog {
  id: string;
  type: 'INTERNAL' | 'EXTERNAL';
  borrowerName: string;
  destination?: string;
  checkoutTime: string;
  checkinTime?: string;
  checkoutMissingComponents?: string[];
  missingComponents?: string[]; // checkin
}

export interface BaseAsset {
  id: string; // Unique identifier or QR code
  name: string;
  category: AssetCategory;
  floor: 1 | 2 | 3;
  status: AssetStatus;
  notes?: string;
  logs?: BorrowLog[];
}

export interface KitAsset extends BaseAsset {
  category: 'KIT';
  components: ChildComponent[];
  borrowLog?: {
    studentName: string;
    instructorName: string;
    checkoutTime: string;
    checkinTime?: string;
  }[];
}

export interface SingleAsset extends BaseAsset {
  category: 'SINGLE';
  specifications: string;
  pic?: string; // Person In Charge
}

export interface FurnitureAsset extends BaseAsset {
  category: 'FURNITURE';
  color: string;
  quantity: number; // for grid view
}

export type Asset = KitAsset | SingleAsset | FurnitureAsset;
