export type Role = 'ADMIN' | 'GATE' | 'SEG' | 'INVENTORY' | 'SALES' | 'FINANCE' | 'AUDITOR';

export type SourceType =
  | 'BRAND' | 'NGO' | 'WAGHRI' | 'CONSUMER' | 'SCHOOL' | 'HOTEL' | 'OFFICE' | 'AGGREGATOR' | 'IMPORTED' | 'OTHER';

export type PartnerType = 'COLLECTION' | 'PROCESSOR';

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  panNumber?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Facility {
  id: string;
  partnerId: string;
  name: string;
  address: string;
  contactPerson: string;
  phone: string;
  email?: string;
  capacity?: number;
  specialization?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export type WasteCategory = 'POST_CONSUMER' | 'INDUSTRIAL' | 'INSTITUTIONAL';
export type ProductType = 'RAGS' | 'Rewear' | 'UPCYCLING' | 'JEANS' | 'WASTE' | 'POLYESTER' | 'RECYCLING';

export interface InventoryItem {
  wasteCategory: WasteCategory;
  productType: ProductType;
  totalWeight: number;
  totalAmount: number;
}

export interface InventoryByCategory {
  category: WasteCategory;
  totalWeight: number;
  totalAmount: number;
  items: InventoryItem[];
}

export type ContaminationFlag = 'WET' | 'SOILED' | 'MIXED' | 'INFESTED';

export type PrimaryCategory = 'REWEAR' | 'REVAMP' | 'RECYCLE' | 'RELIFE';
export type RewearBucket = 'MEN' | 'WOMEN' | 'KIDS';
export type GsmBand = 'LOW' | 'HIGH'; // Low ≤180; High >180
export type ColorType = 'WHITE' | 'COLOR';
export type RecycleComposition = 'COTTON_DOM' | 'POLY_DOM' | 'MIXED';

export type SkuCode =
  | 'REW-MEN' | 'REW-WOM' | 'REW-KID'
  | 'RAG-LGSM-WHITE' | 'RAG-LGSM-COLOR' | 'RAG-HGSM-WHITE' | 'RAG-HGSM-COLOR'
  | 'REC-COT-WHITE' | 'REC-COT-COLOR' | 'REC-POLY-WHITE' | 'REC-POLY-COLOR' | 'REC-MIX'
  | 'RLF-WTE';

export interface Site { 
  id: string; 
  name: string; 
}

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  contact?: string;
}

export interface Material {
  id: string;
  code: string; // e.g. MAT-YYMMDD-#### 
  name: string;
  wasteCategory: WasteCategory;
  siteId: string;
  sourceId?: string;
  sourceType: SourceType;
  grossKg: number;
  tareKg: number;
  netKg: number;
  contamination: ContaminationFlag[];
  weighbridgeDoc?: string; // weighbridge document URL
  purchaseBillDoc?: string; // purchase bill document URL
  materialPicWithGeo?: string; // material picture with geo location URL
  vehicleImageLoaded?: string; // vehicle image (loaded) URL
  createdAt: string;
  createdBy: string;
  notes?: string;
  payoutRatePerKg?: number; // default 15
}

// Keep Lot interface for backward compatibility
export interface Lot extends Material {}



export interface Package {
  id: string;
  code: string;
  name: string;
  address: string;
  wasteCategory: WasteCategory;
  productType: ProductType;
  grossKg: number;
  tareKg: number;
  netKg: number;
  salesRate: number;
  contamination: ContaminationFlag[];
  weighbridgeDoc?: string;
  salesBillDoc?: string;
  materialPicWithGeo?: string;
  vehicleImage?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface Pack {
  id: string;
  code: string; // Bale-..., Carton-...
  sku: SkuCode;
  materialId?: string; // from which material (optional)
  lotId?: string; // keep for backward compatibility
  kg: number;
  location: string; // e.g. R1-A1
  createdAt: string;
}

export interface PriceListItem {
  id: string;
  customerType: 'RESELLER' | 'FACTORY' | 'RECYCLER' | 'CEMENT_PLANT' | 'OTHER';
  sku: SkuCode;
  ratePerKg: number;
  effectiveFrom: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerType: PriceListItem['customerType'];
  status: 'DRAFT' | 'ALLOCATED' | 'DISPATCHED' | 'CLOSED';
  createdAt: string;
  items: { sku: SkuCode; qtyKg: number; ratePerKg?: number }[];
}

export interface Shipment {
  id: string;
  orderId: string;
  vehicleNo?: string;
  dispatchedAt: string;
  challanNo: string;
  docs?: string[]; // URLs (acknowledgement, destruction certificates)
}

export interface Settlement {
  id: string;
  sourceId?: string;
  periodMonth: string; // YYYY-MM
  totalKg: number;
  rate: number;
  amount: number;
  statementUrl?: string;
}

export interface Config {
  id: string;
  gsmThreshold: number; // default 180
  cottonDominantPct: number; // default 60
  polyDominantPct: number;   // default 60
  impact: { co2ePerKg: number; waterSavedPerKg: number }; // default 0
  settlementDefaultRate: number; // default 15
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  login: (email: string, password: string, role?: Role) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role | Role[]) => boolean;
}