import { NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';

export async function GET() {
  try {
    const materials = mockData.getMaterials();
    const packages = mockData.getPackages();
    
    // Calculate inventory by category and product type
    const inventory = new Map();
    
    // Process packages (outbound) for inventory calculation
    packages.forEach(pkg => {
      if (!inventory.has(pkg.wasteCategory)) {
        inventory.set(pkg.wasteCategory, new Map());
      }
      const categoryMap = inventory.get(pkg.wasteCategory);
      if (!categoryMap.has(pkg.productType)) {
        categoryMap.set(pkg.productType, { weight: 0, amount: 0 });
      }
      const item = categoryMap.get(pkg.productType);
      item.weight += pkg.netKg;
      item.amount += pkg.netKg * pkg.salesRate;
    });
    
    // Convert to response format
    const inventoryByCategory = [];
    
    ['POST_CONSUMER', 'INDUSTRIAL', 'INSTITUTIONAL'].forEach(category => {
      const categoryData = inventory.get(category) || new Map();
      
      const items = Array.from(categoryData.entries()).map(([productType, data]) => ({
        wasteCategory: category,
        productType,
        totalWeight: data.weight,
        totalAmount: data.amount
      }));
      
      const totalWeight = items.reduce((sum, item) => sum + item.totalWeight, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);
      
      inventoryByCategory.push({
        category,
        totalWeight,
        totalAmount,
        items
      });
    });
    
    return NextResponse.json({
      materials,
      packages,
      inventoryByCategory
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
