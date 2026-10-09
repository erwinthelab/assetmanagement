import { Asset } from '@/types';

export const initialData: Asset[] = [
  // L1 - KINDER - KITS
  ...Array.from({ length: 7 }).map((_, i) => ({
    id: `SPK-BOX-${(i + 8).toString().padStart(2, '0')}`,
    name: `SPIKE BOX ${(i + 8).toString().padStart(2, '0')}`,
    category: 'KIT' as const,
    floor: 1 as const,
    status: 'AVAILABLE' as const,
    components: [
      { id: 'c1', name: 'SPIKE Brain', quantity: 1 },
      { id: 'c2', name: 'Medium Motor 1', quantity: 1 },
      { id: 'c3', name: 'Medium Motor 2', quantity: 1 },
      { id: 'c4', name: 'Large Motor', quantity: 1 },
      { id: 'c5', name: 'Sensor: Ultrasonic', quantity: 1 },
      { id: 'c6', name: 'Sensor: Color', quantity: 1 },
      { id: 'c7', name: 'Sensor: Touch', quantity: 1 },
      { id: 'c8', name: 'Mono Wheel', quantity: 1 },
    ],
  })),

  // L1 - KINDER - TABLETS
  { id: 'KG/TAB/08/CE', name: 'Tablet Kinder', category: 'SINGLE', floor: 1, status: 'AVAILABLE', specifications: 'INFINIX XPAD 20 | 4GB/128GB' },
  { id: 'KG/TAB/09/CE', name: 'Tablet Kinder', category: 'SINGLE', floor: 1, status: 'AVAILABLE', specifications: 'INFINIX XPAD 20 | 4GB/128GB' },
  { id: 'KG/TAB/10/CE', name: 'Tablet Kinder', category: 'SINGLE', floor: 1, status: 'AVAILABLE', specifications: 'INFINIX XPAD X1101 | 128GB' },
  { id: 'KG/TAB/11/CE', name: 'Tablet Kinder', category: 'SINGLE', floor: 1, status: 'AVAILABLE', specifications: 'INFINIX XPAD X1101 | 128GB' },
  { id: 'KG/TAB/12/CE', name: 'Tablet Kinder', category: 'SINGLE', floor: 1, status: 'AVAILABLE', specifications: 'INFINIX XPAD X1101 | 256GB' },
  { id: 'KG/TAB/13/CE', name: 'Tablet Kinder', category: 'SINGLE', floor: 1, status: 'AVAILABLE', specifications: 'INFINIX XPAD X1101 | 256GB', notes: 'tombol lock rusak' },
  { id: 'KG/TAB/14/CE', name: 'Tablet Kinder', category: 'SINGLE', floor: 1, status: 'AVAILABLE', specifications: 'TECNO MEGAPAD 11 | 128GB' },

  // L1 - KINDER - FURNITURE
  { id: 'FURN-L1-CHAIR-B', name: 'Kursi Anak', category: 'FURNITURE', floor: 1, status: 'AVAILABLE', color: 'Biru', quantity: 12 },
  { id: 'FURN-L1-CHAIR-Y', name: 'Kursi Anak', category: 'FURNITURE', floor: 1, status: 'AVAILABLE', color: 'Kuning', quantity: 3 },
  { id: 'FURN-L1-TABLE', name: 'Meja Belajar', category: 'FURNITURE', floor: 1, status: 'AVAILABLE', color: 'Wood', quantity: 4 },

  // L2 - JUNIOR - KITS (01-07 and 15-24)
  ...[1, 2, 3, 4, 5, 6, 7, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((num) => ({
    id: `SPK-BOX-${num.toString().padStart(2, '0')}`,
    name: `SPIKE BOX ${num.toString().padStart(2, '0')}`,
    category: 'KIT' as const,
    floor: 2 as const,
    status: 'AVAILABLE' as const,
    components: [
      { id: 'c1', name: 'SPIKE Brain', quantity: 1 },
      { id: 'c2', name: 'Medium Motor 1', quantity: 1 },
      { id: 'c3', name: 'Medium Motor 2', quantity: 1 },
      { id: 'c4', name: 'Large Motor', quantity: 1 },
      { id: 'c5', name: 'Sensor: Ultrasonic', quantity: 1 },
      { id: 'c6', name: 'Sensor: Color', quantity: 1 },
      { id: 'c7', name: 'Sensor: Touch', quantity: 1 },
      { id: 'c8', name: 'Mono Wheel', quantity: 1 },
    ],
  })),

  // L2 - JUNIOR - TABLETS
  { id: 'KG/TAB/01/CE', name: 'Tablet Junior', category: 'SINGLE', floor: 2, status: 'AVAILABLE', specifications: 'Infinix XPAD X1101' },
  { id: 'KG/TAB/03/CE', name: 'Tablet Junior', category: 'SINGLE', floor: 2, status: 'AVAILABLE', specifications: 'Infinix XPAD X1101' },
  { id: 'KG/TAB/04/CE', name: 'Tablet Junior', category: 'SINGLE', floor: 2, status: 'AVAILABLE', specifications: 'Infinix XPAD X1101' },
  { id: 'KG/TAB/05/CE', name: 'Tablet Junior', category: 'SINGLE', floor: 2, status: 'AVAILABLE', specifications: 'Infinix XPAD 20 X1102' },
  { id: 'KG/TAB/06/CE', name: 'Tablet Junior', category: 'SINGLE', floor: 2, status: 'AVAILABLE', specifications: 'Infinix XPAD X1101B' },
  { id: 'KG/TAB/07/CE', name: 'Tablet Junior', category: 'SINGLE', floor: 2, status: 'AVAILABLE', specifications: 'Infinix XPAD X1101B' },

  // L2 - JUNIOR - FURNITURE
  { id: 'FURN-L2-CHAIR-B', name: 'Kursi Anak', category: 'FURNITURE', floor: 2, status: 'AVAILABLE', color: 'Biru', quantity: 12 },
  { id: 'FURN-L2-CHAIR-Y', name: 'Kursi Anak', category: 'FURNITURE', floor: 2, status: 'AVAILABLE', color: 'Kuning', quantity: 3 },
  { id: 'FURN-L2-TABLE', name: 'Meja Belajar', category: 'FURNITURE', floor: 2, status: 'AVAILABLE', color: 'Wood', quantity: 6 },

  // L3 - CODER - LAPTOPS (STUDENT)
  { id: 'LPT/JKT-KG/STD/001', name: 'Laptop Coder', category: 'SINGLE', floor: 3, status: 'AVAILABLE', specifications: 'Lenovo Thinkpad T460p (RAM 8GB, i7-6700HQ)' },
  { id: 'LPT/JKT-KG/STD/003', name: 'Laptop Coder', category: 'SINGLE', floor: 3, status: 'AVAILABLE', specifications: 'Lenovo Thinkpad T460p (RAM 8GB, i7-6820HQ)' },
  { id: 'LPT/JKT-KG/STD/004', name: 'Laptop Coder', category: 'SINGLE', floor: 3, status: 'AVAILABLE', specifications: 'Lenovo Thinkpad T460p (RAM 8GB, i7-6820HQ)' },
  { id: 'LPT/JKT-KG/STD/006', name: 'Laptop Coder', category: 'SINGLE', floor: 3, status: 'AVAILABLE', specifications: 'Lenovo Thinkpad X280 (RAM 8GB, i5-8350U)' },
  { id: 'LPT/JKT-KG/STD/005', name: 'Laptop Coder', category: 'SINGLE', floor: 3, status: 'AVAILABLE', specifications: 'Lenovo Thinkpad X390 (RAM 8GB, i5-8365U)' },
  { id: 'KG/LPT STU/08/CE', name: 'Laptop Coder', category: 'SINGLE', floor: 3, status: 'AVAILABLE', specifications: 'Lenovo Thinkpad X395 (RAM 8GB, Ryzen 5 PRO 3500U)' },
  { id: 'KG/LPT STU/09/CE', name: 'Laptop Coder', category: 'SINGLE', floor: 3, status: 'AVAILABLE', specifications: 'Lenovo Thinkpad X395 (RAM 8GB, Ryzen 5 PRO 3500U)' },
  { id: 'KG/LPT STU/01/CE', name: 'Laptop Coder', category: 'SINGLE', floor: 3, status: 'AVAILABLE', specifications: 'Lenovo Thinkpad X390 (RAM 8GB, i5-8365U)' },

  // L3 - CODER - LAPTOPS (STAFF)
  { id: 'STAFF-LPT-VALENT', name: 'Laptop Valent', category: 'SINGLE', floor: 3, status: 'BORROWED', specifications: 'Lenovo Thinkpad X395 (Win 10, RAM 8GB/256GB)', pic: 'Valent' },
  { id: 'STAFF-LPT-ALBERT', name: 'Laptop Albert', category: 'SINGLE', floor: 3, status: 'BORROWED', specifications: 'Lenovo Thinkpad T490S (Win 11, RAM 16GB/120GB)', pic: 'Albert' },
  { id: 'STAFF-LPT-YUNI', name: 'Laptop Yuni', category: 'SINGLE', floor: 3, status: 'BORROWED', specifications: 'Lenovo Thinkpad X390 (Win 11, RAM 16GB/256GB, i5)', pic: 'Yuni' },
  { id: 'STAFF-LPT-YOLA', name: 'Laptop Yola', category: 'SINGLE', floor: 3, status: 'BORROWED', specifications: 'Lenovo ThinkPad X390 (Win 11, RAM 8GB/238GB)', pic: 'Yola' },
  { id: 'STAFF-LPT-GAPIN', name: 'Laptop Gapin', category: 'SINGLE', floor: 3, status: 'BORROWED', specifications: 'Lenovo Thinkpad X390 20Q1S3JOS (Win 11, RAM 16GB, i5-8365U)', pic: 'Gapin' },
  { id: 'STAFF-LPT-ERWIN', name: 'Laptop Erwin', category: 'SINGLE', floor: 3, status: 'BORROWED', specifications: 'Lenovo Thinkpad T490s (Win 11, RAM 16GB/256GB, i5 Gen8)', pic: 'Erwin' },
  { id: 'STAFF-LPT-JUNDI', name: 'Laptop Jundi', category: 'SINGLE', floor: 3, status: 'BORROWED', specifications: 'Lenovo Thinkpad L380 (RAM 8GB/256GB, i5)', pic: 'Jundi' },
];
