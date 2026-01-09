import { Site, Source, Material, Lot, Package, Pack, PriceListItem, Order, Shipment, Settlement, Config, Partner, Facility } from './types';

// In-memory data store
let sites: Site[] = [
  { id: '1', name: 'TRF-Mumbai' }
];

let sources: Source[] = [
  { id: '1', type: 'BRAND', name: 'Zara India', contact: '+91-9876543210' },
  { id: '2', type: 'NGO', name: 'Goonj Foundation', contact: 'contact@goonj.org' },
  { id: '3', type: 'WAGHRI', name: 'Mumbai Waghri Collective' },
  { id: '4', type: 'CONSUMER', name: 'Bandra Residents' },
  { id: '5', type: 'SCHOOL', name: 'St. Xavier\'s School', contact: 'admin@stxaviers.edu' },
  { id: '6', type: 'HOTEL', name: 'Taj Mahal Palace', contact: 'sustainability@taj.com' },
  { id: '7', type: 'OFFICE', name: 'Tech Mahindra', contact: 'csr@techmahindra.com' },
  { id: '8', type: 'AGGREGATOR', name: 'EcoKart Solutions' }
];

let materials: Material[] = [
  {
    id: '1',
    code: 'MAT-250101-0001',
    name: 'Zara Mixed Clothing',
    wasteCategory: 'POST_CONSUMER',
    siteId: '1',
    sourceId: '1',
    sourceType: 'BRAND',
    grossKg: 105.3,
    tareKg: 5.3,
    netKg: 100.0,
    contamination: ['WET'],
    createdAt: '2025-01-01T09:00:00.000Z',
    createdBy: 'gate-user',
    notes: 'Mixed branded clothing from store returns',
    payoutRatePerKg: 15
  },
  {
    id: '2',
    code: 'MAT-250101-0002',
    name: 'NGO Donation Batch',
    wasteCategory: 'INSTITUTIONAL',
    siteId: '1',
    sourceId: '2',
    sourceType: 'NGO',
    grossKg: 78.7,
    tareKg: 3.7,
    netKg: 75.0,
    contamination: [],
    createdAt: '2025-01-01T11:30:00.000Z',
    createdBy: 'gate-user',
    payoutRatePerKg: 15
  },
  {
    id: '3',
    code: 'MAT-250101-0003',
    name: 'Waghri Collection',
    wasteCategory: 'POST_CONSUMER',
    siteId: '1',
    sourceId: '3',
    sourceType: 'WAGHRI',
    grossKg: 52.8,
    tareKg: 2.8,
    netKg: 50.0,
    contamination: ['SOILED', 'MIXED'],
    createdAt: '2025-01-01T14:15:00.000Z',
    createdBy: 'gate-user',
    notes: 'Mixed quality collection from residential areas'
  },
  {
    id: '4',
    code: 'MAT-250102-0001',
    name: 'Consumer Drop-off',
    wasteCategory: 'POST_CONSUMER',
    siteId: '1',
    sourceType: 'CONSUMER',
    grossKg: 31.2,
    tareKg: 1.2,
    netKg: 30.0,
    contamination: ['WET', 'INFESTED'],
    createdAt: '2025-01-02T10:00:00.000Z',
    createdBy: 'gate-user',
    payoutRatePerKg: 12
  },
  {
    id: '5',
    code: 'MAT-250102-0002',
    name: 'School Uniform Collection',
    wasteCategory: 'INSTITUTIONAL',
    siteId: '1',
    sourceId: '5',
    sourceType: 'SCHOOL',
    grossKg: 85.5,
    tareKg: 5.5,
    netKg: 80.0,
    contamination: [],
    createdAt: '2025-01-02T13:20:00.000Z',
    createdBy: 'gate-user'
  }
];



let packs: Pack[] = [
  {
    id: '1',
    code: 'Carton-2501-0001',
    sku: 'REW-MEN',
    materialId: '1',
    lotId: '1',
    kg: 15.0,
    location: 'R1-A1',
    createdAt: '2025-01-01T13:00:00.000Z'
  },
  {
    id: '2',
    code: 'Carton-2501-0002',
    sku: 'REW-WOM',
    materialId: '1',
    lotId: '1',
    kg: 12.0,
    location: 'R1-A2',
    createdAt: '2025-01-01T13:15:00.000Z'
  },
  {
    id: '3',
    code: 'Carton-2501-0003',
    sku: 'REW-KID',
    materialId: '1',
    lotId: '1',
    kg: 8.0,
    location: 'R1-A3',
    createdAt: '2025-01-01T13:30:00.000Z'
  },
  {
    id: '4',
    code: 'Bale-2501-0001',
    sku: 'RAG-LGSM-WHITE',
    materialId: '1',
    lotId: '1',
    kg: 15.0,
    location: 'R2-B1',
    createdAt: '2025-01-01T14:00:00.000Z'
  },
  {
    id: '5',
    code: 'Bale-2501-0002',
    sku: 'RAG-LGSM-COLOR',
    materialId: '1',
    lotId: '1',
    kg: 10.0,
    location: 'R2-B2',
    createdAt: '2025-01-01T14:15:00.000Z'
  },
  {
    id: '6',
    code: 'Bale-2501-0003',
    sku: 'RAG-HGSM-WHITE',
    materialId: '1',
    lotId: '1',
    kg: 8.0,
    location: 'R2-B3',
    createdAt: '2025-01-01T14:30:00.000Z'
  }
];

let priceList: PriceListItem[] = [
  { id: '1', customerType: 'RESELLER', sku: 'REW-MEN', ratePerKg: 45, effectiveFrom: '2025-01-01' },
  { id: '2', customerType: 'RESELLER', sku: 'REW-WOM', ratePerKg: 50, effectiveFrom: '2025-01-01' },
  { id: '3', customerType: 'RESELLER', sku: 'REW-KID', ratePerKg: 55, effectiveFrom: '2025-01-01' },
  { id: '4', customerType: 'FACTORY', sku: 'RAG-LGSM-WHITE', ratePerKg: 25, effectiveFrom: '2025-01-01' },
  { id: '5', customerType: 'FACTORY', sku: 'RAG-LGSM-COLOR', ratePerKg: 20, effectiveFrom: '2025-01-01' },
  { id: '6', customerType: 'FACTORY', sku: 'RAG-HGSM-WHITE', ratePerKg: 35, effectiveFrom: '2025-01-01' },
  { id: '7', customerType: 'FACTORY', sku: 'RAG-HGSM-COLOR', ratePerKg: 30, effectiveFrom: '2025-01-01' },
  { id: '8', customerType: 'RECYCLER', sku: 'REC-COT-WHITE', ratePerKg: 18, effectiveFrom: '2025-01-01' },
  { id: '9', customerType: 'RECYCLER', sku: 'REC-COT-COLOR', ratePerKg: 15, effectiveFrom: '2025-01-01' },
  { id: '10', customerType: 'CEMENT_PLANT', sku: 'RLF-WTE', ratePerKg: 5, effectiveFrom: '2025-01-01' }
];

let orders: Order[] = [
  {
    id: '1',
    customerName: 'Fashion Forward Pvt Ltd',
    customerType: 'RESELLER',
    status: 'ALLOCATED',
    createdAt: '2025-01-01T16:00:00.000Z',
    items: [
      { sku: 'REW-MEN', qtyKg: 15.0, ratePerKg: 45 },
      { sku: 'REW-WOM', qtyKg: 12.0, ratePerKg: 50 }
    ]
  },
  {
    id: '2',
    customerName: 'GreenTech Recycling',
    customerType: 'RECYCLER',
    status: 'DISPATCHED',
    createdAt: '2025-01-02T09:00:00.000Z',
    items: [
      { sku: 'RAG-LGSM-WHITE', qtyKg: 15.0, ratePerKg: 25 }
    ]
  }
];

let shipments: Shipment[] = [
  {
    id: '1',
    orderId: '2',
    vehicleNo: 'MH-01-AB-1234',
    dispatchedAt: '2025-01-02T14:00:00.000Z',
    challanNo: 'CH-2501-001',
    docs: ['ack-url-1', 'cert-url-1']
  }
];

let settlements: Settlement[] = [
  {
    id: '1',
    sourceId: '1',
    periodMonth: '2024-12',
    totalKg: 450.0,
    rate: 15,
    amount: 6750,
    statementUrl: 'statement-url-1'
  }
];

let packages: Package[] = [
  {
    id: '1',
    code: 'PKG-250101-0001',
    name: 'Export Package A',
    address: '123 Industrial Area, Mumbai',
    wasteCategory: 'POST_CONSUMER',
    productType: 'RAGS',
    grossKg: 1050.5,
    tareKg: 50.5,
    netKg: 1000.0,
    salesRate: 25.50,
    contamination: [],
    createdAt: '2025-01-01T10:00:00.000Z',
    createdBy: 'packaging-user',
    notes: 'Ready for export shipment'
  },
  {
    id: '2',
    code: 'PKG-250101-0002',
    name: 'Domestic Package B',
    address: '456 Warehouse District, Delhi',
    wasteCategory: 'INSTITUTIONAL',
    productType: 'Rewear',
    grossKg: 525.3,
    tareKg: 25.3,
    netKg: 500.0,
    salesRate: 35.75,
    contamination: ['WET'],
    createdAt: '2025-01-01T14:30:00.000Z',
    createdBy: 'packaging-user',
    notes: 'Requires drying before shipment'
  },
  {
    id: '3',
    code: 'PKG-250102-0001',
    name: 'Cotton Blend Mix',
    address: '789 Processing Unit, Bangalore',
    wasteCategory: 'POST_CONSUMER',
    productType: 'UPCYCLING',
    grossKg: 755.8,
    tareKg: 35.8,
    netKg: 720.0,
    salesRate: 42.25,
    contamination: [],
    createdAt: '2025-01-02T09:15:00.000Z',
    createdBy: 'packaging-user',
    notes: 'High quality cotton for upcycling'
  },
  {
    id: '4',
    code: 'PKG-250102-0002',
    name: 'Denim Collection',
    address: '321 Textile Hub, Chennai',
    wasteCategory: 'INDUSTRIAL',
    productType: 'JEANS',
    grossKg: 630.2,
    tareKg: 30.2,
    netKg: 600.0,
    salesRate: 38.90,
    contamination: ['SOILED'],
    createdAt: '2025-01-02T13:45:00.000Z',
    createdBy: 'packaging-user',
    notes: 'Mixed denim grades'
  },
  {
    id: '5',
    code: 'PKG-250103-0001',
    name: 'Polyester Waste',
    address: '654 Recycling Center, Pune',
    wasteCategory: 'POST_CONSUMER',
    productType: 'POLYESTER',
    grossKg: 420.7,
    tareKg: 20.7,
    netKg: 400.0,
    salesRate: 28.50,
    contamination: [],
    createdAt: '2025-01-03T11:20:00.000Z',
    createdBy: 'packaging-user',
    notes: 'Clean polyester for recycling'
  }
];

let partners: Partner[] = [
  {
    id: '1',
    name: 'EcoCollect Solutions',
    type: 'COLLECTION',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@ecocollect.com',
    phone: '+91-9876543210',
    address: '123 Green Street, Mumbai, Maharashtra 400001',
    gstNumber: '27ABCDE1234F1Z5',
    isActive: true,
    createdAt: '2025-01-01T10:00:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'GreenTech Processors',
    type: 'PROCESSOR',
    contactPerson: 'Priya Sharma',
    email: 'priya@greentech.com',
    phone: '+91-9876543211',
    address: '456 Industrial Area, Delhi 110001',
    gstNumber: '07FGHIJ5678K2L9',
    isActive: true,
    createdAt: '2025-01-02T14:30:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '3',
    name: 'Urban Waste Collectors',
    type: 'COLLECTION',
    contactPerson: 'Amit Singh',
    email: 'amit@urbanwaste.com',
    phone: '+91-9876543212',
    address: '789 Collection Hub, Bangalore, Karnataka 560001',
    gstNumber: '29KLMNO9012P3Q4',
    isActive: true,
    createdAt: '2025-01-03T09:15:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '4',
    name: 'Textile Recycling Co.',
    type: 'PROCESSOR',
    contactPerson: 'Sunita Patel',
    email: 'sunita@textilerecycling.com',
    phone: '+91-9876543213',
    address: '321 Processing Zone, Ahmedabad, Gujarat 380001',
    gstNumber: '24RSTUV3456W7X8',
    isActive: true,
    createdAt: '2025-01-04T11:45:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '5',
    name: 'Metro Collection Services',
    type: 'COLLECTION',
    contactPerson: 'Vikram Reddy',
    email: 'vikram@metrocollection.com',
    phone: '+91-9876543214',
    address: '654 Metro Plaza, Hyderabad, Telangana 500001',
    gstNumber: '36YZABC7890D1E2',
    isActive: false,
    createdAt: '2025-01-05T16:20:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '6',
    name: 'Fiber Processing Industries',
    type: 'PROCESSOR',
    contactPerson: 'Meera Joshi',
    email: 'meera@fiberprocessing.com',
    phone: '+91-9876543215',
    address: '987 Industrial Estate, Pune, Maharashtra 411001',
    gstNumber: '27FGHIJ4567K8L9',
    isActive: true,
    createdAt: '2025-01-06T13:10:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '7',
    name: 'Sustainable Collectors Ltd',
    type: 'COLLECTION',
    contactPerson: 'Arjun Nair',
    email: 'arjun@sustainablecollectors.com',
    phone: '+91-9876543216',
    address: '432 Eco Park, Kochi, Kerala 682001',
    gstNumber: '32MNOPQ8901R2S3',
    isActive: true,
    createdAt: '2025-01-07T08:30:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '8',
    name: 'Advanced Textile Mills',
    type: 'PROCESSOR',
    contactPerson: 'Kavita Agarwal',
    email: 'kavita@advancedtextile.com',
    phone: '+91-9876543217',
    address: '876 Mill Complex, Coimbatore, Tamil Nadu 641001',
    gstNumber: '33TUVWX5678Y9Z0',
    isActive: true,
    createdAt: '2025-01-08T12:45:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '9',
    name: 'City Waste Management',
    type: 'COLLECTION',
    contactPerson: 'Rohit Gupta',
    email: 'rohit@citywaste.com',
    phone: '+91-9876543218',
    address: '543 Municipal Area, Jaipur, Rajasthan 302001',
    gstNumber: '08ABCDE2345F6G7',
    isActive: false,
    createdAt: '2025-01-09T15:20:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '10',
    name: 'Eco Fiber Solutions',
    type: 'PROCESSOR',
    contactPerson: 'Deepika Rao',
    email: 'deepika@ecofiber.com',
    phone: '+91-9876543219',
    address: '765 Green Zone, Indore, Madhya Pradesh 452001',
    gstNumber: '23HIJKL6789M0N1',
    isActive: true,
    createdAt: '2025-01-10T10:15:00.000Z',
    createdBy: 'admin'
  },
  {
    id: '11',
    name: 'Regional Collection Network',
    type: 'COLLECTION',
    contactPerson: 'Sanjay Verma',
    email: 'sanjay@regionalcollection.com',
    phone: '+91-9876543220',
    address: '234 Network Hub, Lucknow, Uttar Pradesh 226001',
    gstNumber: '09OPQRS3456T7U8',
    isActive: true,
    createdAt: '2025-01-11T14:00:00.000Z',
    createdBy: 'admin'
  }
];

let facilities: Facility[] = [
  {
    id: '1',
    partnerId: '1',
    name: 'Mumbai Collection Center',
    address: '789 Collection Hub, Mumbai 400002',
    contactPerson: 'Amit Patel',
    phone: '+91-9876543212',
    email: 'amit@ecocollect.com',
    capacity: 1000,
    specialization: ['POST_CONSUMER', 'INSTITUTIONAL'],
    isActive: true,
    createdAt: '2025-01-01T11:00:00.000Z',
    createdBy: 'admin'
  }
];

let config: Config = {
  id: '1',
  gsmThreshold: 180,
  cottonDominantPct: 60,
  polyDominantPct: 60,
  impact: { co2ePerKg: 0, waterSavedPerKg: 0 },
  settlementDefaultRate: 15
};

// Export data access functions
export const mockData = {
  // Sites
  getSites: () => sites,
  getSite: (id: string) => sites.find(s => s.id === id),
  
  // Sources
  getSources: () => sources,
  getSource: (id: string) => sources.find(s => s.id === id),
  createSource: (source: Omit<Source, 'id'>) => {
    const newSource = { ...source, id: Date.now().toString() };
    sources.push(newSource);
    return newSource;
  },
  
  // Materials
  getMaterials: () => materials,
  getMaterial: (id: string) => materials.find(m => m.id === id),
  createMaterial: (material: Omit<Material, 'id' | 'code' | 'createdAt'>) => {
    const date = new Date();
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
    const dailyCount = materials.filter(m => m.code.includes(dateStr)).length + 1;
    const code = `MAT-${dateStr}-${dailyCount.toString().padStart(4, '0')}`;
    
    const newMaterial = {
      ...material,
      id: Date.now().toString(),
      code,
      createdAt: date.toISOString()
    };
    materials.push(newMaterial);
    return newMaterial;
  },
  updateMaterial: (id: string, updates: Partial<Material>) => {
    const index = materials.findIndex(m => m.id === id);
    if (index !== -1) {
      materials[index] = { ...materials[index], ...updates };
      return materials[index];
    }
    return null;
  },
  
  // Lots (backward compatibility)
  getLots: () => materials,
  getLot: (id: string) => materials.find(m => m.id === id),
  createLot: (lot: Omit<Lot, 'id' | 'code' | 'createdAt'>) => {
    return mockData.createMaterial(lot);
  },
  updateLot: (id: string, updates: Partial<Lot>) => {
    return mockData.updateMaterial(id, updates);
  },
  

  
  // Packs
  getPacks: () => packs,
  getPack: (id: string) => packs.find(p => p.id === id),
  createPack: (pack: Omit<Pack, 'id' | 'code' | 'createdAt'>) => {
    const date = new Date();
    const monthStr = date.toISOString().slice(2, 7).replace('-', '');
    const monthlyCount = packs.filter(p => p.code.includes(monthStr)).length + 1;
    const unitType = pack.sku.startsWith('REW') ? 'Carton' : 'Bale';
    const code = `${unitType}-${monthStr}-${monthlyCount.toString().padStart(4, '0')}`;
    
    const newPack = {
      ...pack,
      id: Date.now().toString(),
      code,
      createdAt: date.toISOString()
    };
    packs.push(newPack);
    return newPack;
  },
  
  // Price List
  getPriceList: () => priceList,
  updatePriceList: (item: PriceListItem) => {
    const index = priceList.findIndex(p => p.id === item.id);
    if (index !== -1) {
      priceList[index] = item;
    } else {
      priceList.push(item);
    }
    return item;
  },
  
  // Orders
  getOrders: () => orders,
  getOrder: (id: string) => orders.find(o => o.id === id),
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    return newOrder;
  },
  updateOrder: (id: string, updates: Partial<Order>) => {
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      return orders[index];
    }
    return null;
  },
  
  // Shipments
  getShipments: () => shipments,
  createShipment: (shipment: Omit<Shipment, 'id'>) => {
    const newShipment = { ...shipment, id: Date.now().toString() };
    shipments.push(newShipment);
    return newShipment;
  },
  
  // Settlements
  getSettlements: () => settlements,
  createSettlement: (settlement: Omit<Settlement, 'id'>) => {
    const newSettlement = { ...settlement, id: Date.now().toString() };
    settlements.push(newSettlement);
    return newSettlement;
  },
  
  // Packages
  getPackages: () => packages,
  getPackage: (id: string) => packages.find(p => p.id === id),
  createPackage: (pkg: Omit<Package, 'id' | 'code' | 'createdAt'>) => {
    const date = new Date();
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
    const dailyCount = packages.filter(p => p.code.includes(dateStr)).length + 1;
    const code = `PKG-${dateStr}-${dailyCount.toString().padStart(4, '0')}`;
    
    const newPackage = {
      ...pkg,
      id: Date.now().toString(),
      code,
      createdAt: date.toISOString()
    };
    packages.push(newPackage);
    return newPackage;
  },
  
  // Partners
  getPartners: () => partners,
  getPartner: (id: string) => partners.find(p => p.id === id),
  createPartner: (partner: Omit<Partner, 'id' | 'createdAt' | 'isActive'>) => {
    const newPartner = {
      ...partner,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString()
    };
    partners.push(newPartner);
    return newPartner;
  },
  
  // Facilities
  getFacilities: () => facilities,
  getFacility: (id: string) => facilities.find(f => f.id === id),
  getFacilitiesByPartner: (partnerId: string) => facilities.filter(f => f.partnerId === partnerId),
  createFacility: (facility: Omit<Facility, 'id' | 'createdAt' | 'isActive'>) => {
    const newFacility = {
      ...facility,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString()
    };
    facilities.push(newFacility);
    return newFacility;
  },
  
  // Config
  getConfig: () => config,
  updateConfig: (updates: Partial<Config>) => {
    config = { ...config, ...updates };
    return config;
  }
};