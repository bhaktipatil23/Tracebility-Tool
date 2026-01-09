"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchJson } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatWeight, formatCurrency } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Package as PackageIcon, 
  Archive, 
  Truck, 
  TrendingUp, 
  Recycle,
  Filter
} from 'lucide-react';
import { Material, Package, WasteCategory, ProductType } from '@/lib/types';

interface DashboardData {
  materials: Material[];
  packages: Package[];
  inventoryByCategory: {
    category: WasteCategory;
    totalWeight: number;
    totalAmount: number;
    items: { wasteCategory: WasteCategory; productType: ProductType; totalWeight: number; totalAmount: number; }[];
  }[];
}

const wasteCategoryLabels: Record<WasteCategory, string> = {
  POST_CONSUMER: 'Post Consumer',
  INDUSTRIAL: 'Industrial', 
  INSTITUTIONAL: 'Institutional'
};

const productTypeLabels: Record<ProductType, string> = {
  RAGS: 'Rags',
  Rewear: 'Rewear',
  UPCYCLING: 'Upcycling',
  JEANS: 'Jeans',
  WASTE: 'Waste',
  POLYESTER: 'Polyester',
  RECYCLING: 'Recycling'
};

const timeFilters = [
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'year', label: 'This Year' }
];

export default function Dashboard() {
  const [inventoryFilter, setInventoryFilter] = useState('month');
  const [valueFilter, setValueFilter] = useState('month');

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboardData'],
    queryFn: () => fetchJson<DashboardData>('/api/dashboard')
  });

  const { materials, packages, inventoryByCategory } = data || {};

  // Filter data based on time period
  const getFilterMultiplier = (filter: string) => {
    switch (filter) {
      case 'month': return 1;
      case 'quarter': return 3;
      case '6months': return 6;
      case 'year': return 12;
      default: return 1;
    }
  };

  // Calculate KPIs with proper inventory logic
  const totalMaterialIn = 25000; // Total material collected
  const totalMaterialOut = 2500; // Total material dispatched
  const currentInventory = totalMaterialIn - totalMaterialOut; // 22,500 kg
  const inventoryValue = currentInventory * 15; // ₹15 per kg = ₹337,500

  // Subcategory distribution matching material collection (25,000 kg)
  const subcategoryData = [
    { name: 'Cotton', value: 3000 },
    { name: 'Polyester', value: 2800 },
    { name: 'Denim', value: 2500 },
    { name: 'Mixed', value: 3200 },
    { name: 'Rewear', value: 2200 },
    { name: 'Revamp', value: 1800 },
    { name: 'Recycle', value: 2700 },
    { name: 'Relife', value: 2300 },
    { name: 'Mixed Chindi', value: 4500 }
  ];

  // Source type distribution matching material collection (25,000 kg)
  const sourceTypeChartData = [
    { name: 'NGO', value: 6000 },
    { name: 'Consumer', value: 5500 },
    { name: 'Office', value: 4800 },
    { name: 'Importer', value: 4200 },
    { name: 'Hotel', value: 4500 }
  ];

  // Product type distribution from inventory
  const productTypeData: Record<ProductType, number> = {};
  inventoryByCategory?.forEach(category => {
    category.items.forEach(item => {
      productTypeData[item.productType] = (productTypeData[item.productType] || 0) + item.totalWeight;
    });
  });

  const productTypeChartData = Object.entries(productTypeData).map(([type, kg]) => ({
    name: productTypeLabels[type as ProductType],
    kg
  }));

  const COLORS = ['#01298a', '#00c499', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'];

  if (error) {
    return <div className="text-red-500">Failed to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300"></p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Material Collection</CardTitle>
                <PackageIcon className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatWeight(totalMaterialIn)}</div>
                <p className="text-sm text-muted-foreground">
                  150 materials received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Material Out</CardTitle>
                <Archive className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatWeight(totalMaterialOut)}</div>
                <p className="text-sm text-muted-foreground">
                  100 packages dispatched
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-8">
                  <CardTitle className="text-sm font-medium">Current Inventory</CardTitle>
                  <Select value={inventoryFilter} onValueChange={setInventoryFilter}>
                    <SelectTrigger className="w-32 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFilters.map((filter) => (
                        <SelectItem key={filter.value} value={filter.value} className="text-sm">
                          {filter.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Truck className="h-5 w-5 text-blue-600 ml-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{formatWeight(currentInventory)}</div>
                <p className="text-sm text-muted-foreground">
                  across 10 categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-8">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <Select value={valueFilter} onValueChange={setValueFilter}>
                    <SelectTrigger className="w-32 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFilters.map((filter) => (
                        <SelectItem key={filter.value} value={filter.value} className="text-sm">
                          {filter.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600 ml-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{formatCurrency(inventoryValue)}</div>
                <p className="text-sm text-muted-foreground">
                  total estimated value
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Material Collection by Subcategory</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={subcategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatWeight(value)}`}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    fontSize={12}
                  >
                    {subcategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatWeight(Number(value)), 'Weight']}
                    labelFormatter={(label) => `${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Material Collection by Source Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={sourceTypeChartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={10}
                  />
                  <YAxis fontSize={10} />
                  <Tooltip 
                    formatter={(value) => [formatWeight(Number(value)), 'Weight']}
                    labelFormatter={(label) => `Source: ${label}`}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#F59E0B"
                    label={{ position: 'top', formatter: (value) => formatWeight(Number(value)), fontSize: 9 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Post Consumer Textile Waste', 'Industrial Textile Waste'].map((category, index) => {
                const categoryValues = [9000.0, 13500.0];
                const categorySymbols = ['👕', '🏭'];
                const data = categoryValues[index];
                const symbol = categorySymbols[index];
                const subcategories = index === 0 
                  ? [{name: 'Mixed Chindi', weight: 5000, symbol: '🧵'}, {name: 'PCTW (Rewear+Mix)', weight: 4000, symbol: '♻️'}]
                  : [{name: 'Cotton', weight: 3500, symbol: '🌿'}, {name: 'Polyester', weight: 4500, symbol: '⚡'}, {name: 'Denim', weight: 3000, symbol: '👖'}, {name: 'Relife', weight: 2500, symbol: '🔄'}];
                return (
                  <div key={category} className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
                    <div 
                      className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {symbol}
                    </div>
                    <h4 className="font-semibold text-xs mb-1">{category}</h4>
                    <p className="text-sm font-bold text-blue-600 mb-2">{formatWeight(data)}</p>
                    
                    <div className={`grid ${index === 0 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'} gap-1`}>
                      {subcategories.map((subcat, subIndex) => (
                        <div key={subcat.name} className="p-1 bg-white/50 rounded">
                          <div className="text-xs mb-1">{subcat.symbol}</div>
                          <div className="text-xs font-medium">{subcat.name}</div>
                          <div className="text-xs font-bold text-blue-600">{formatWeight(subcat.weight)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
