import { NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { WasteCategory, ProductType, InventoryByCategory } from '@/lib/types';

export async function GET() {
  const materials = mockData.getMaterials();
  const packages = mockData.getPackages();
  
  // Calculate inventory by waste category and product type
  const inventory = new Map<WasteCategory, Map<ProductType, { weight: number; amount: number }>>();
  
  // Process materials (inbound)
  materials.forEach(material => {
    if (!inventory.has(material.wasteCategory)) {
      inventory.set(material.wasteCategory, new Map());
    }
    // Materials don't have product type, so we'll track them separately
  });
  
  // Process packages (outbound) - subtract from inventory
  packages.forEach(pkg => {
    if (!inventory.has(pkg.wasteCategory)) {
      inventory.set(pkg.wasteCategory, new Map());
    }
    const categoryMap = inventory.get(pkg.wasteCategory)!;
    if (!categoryMap.has(pkg.productType)) {
      categoryMap.set(pkg.productType, { weight: 0, amount: 0 });
    }
    const item = categoryMap.get(pkg.productType)!;
    item.weight += pkg.netKg;
    item.amount += pkg.netKg * pkg.salesRate;
  });
  
  // Convert to response format
  const inventoryByCategory: InventoryByCategory[] = [];
  
  ['POST_CONSUMER', 'INDUSTRIAL', 'INSTITUTIONAL'].forEach(category => {
    const wasteCategory = category as WasteCategory;
    const categoryData = inventory.get(wasteCategory) || new Map();
    
    const items = Array.from(categoryData.entries()).map(([productType, data]) => ({
      wasteCategory,
      productType,
      totalWeight: data.weight,
      totalAmount: data.amount
    }));
    
    const totalWeight = items.reduce((sum, item) => sum + item.totalWeight, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);
    
    inventoryByCategory.push({
      category: wasteCategory,
      totalWeight,
      totalAmount,
      items
    });
  });
  
  return NextResponse.json({ inventoryByCategory });
}