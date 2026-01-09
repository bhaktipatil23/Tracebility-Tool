"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatWeight, cn } from '@/lib/utils';
import { InventoryByCategory, WasteCategory, ProductType } from '@/lib/types';
import { Package, TrendingUp, IndianRupee, Search, ChevronDown, ChevronRight, Filter, Shirt, Factory, Building2, Scissors, Recycle, RefreshCw, RotateCcw, Zap } from 'lucide-react';

const wasteCategoryLabels: Record<WasteCategory, string> = {
  POST_CONSUMER: 'Post Consumer Textile Waste',
  INDUSTRIAL: 'Industrial Textile Waste'
};

const wasteCategoryIcons: Record<WasteCategory, any> = {
  POST_CONSUMER: Shirt,
  INDUSTRIAL: Factory
};

const wasteCategoryColors: Record<WasteCategory, string> = {
  POST_CONSUMER: 'from-blue-500 to-blue-600',
  INDUSTRIAL: 'from-blue-500 to-blue-600'
};

const wasteCategoryImages: Record<WasteCategory, string> = {
  POST_CONSUMER: '/textile-post-consumer.svg',
  INDUSTRIAL: '/textile-industrial.svg'
};

// Hierarchical subcategories with sub-subcategories and icons
const subCategories = {
  POST_CONSUMER: [
    { 
      value: 'MIXED_CHINDI', 
      label: 'Mixed Chindi', 
      weight: 5000,
      symbol: '🧵'
    },
    { 
      value: 'PCTW_REWEAR_MIX', 
      label: 'PCTW (Rewear+Mix)', 
      weight: 4000,
      symbol: '♻️',
      subItems: [
        { value: 'MIXED', label: 'Mixed', weight: 800, symbol: '🔄' },
        { value: 'REWEAR', label: 'Rewear', weight: 800, symbol: '👕' },
        { value: 'REVAMP', label: 'Revamp', weight: 800, symbol: '✨' },
        { value: 'RECYCLE', label: 'Recycle', weight: 800, symbol: '♻️' },
        { value: 'RELIFE', label: 'Relife', weight: 800, symbol: '🌱' }
      ]
    }
  ],
  INDUSTRIAL: [
    { 
      value: 'COTTON', 
      label: 'Cotton', 
      weight: 3500,
      symbol: '🌿'
    },
    { 
      value: 'POLYESTER', 
      label: 'Polyester', 
      weight: 4500,
      symbol: '⚡'
    },
    { 
      value: 'DENIM', 
      label: 'Denim', 
      weight: 3000,
      symbol: '👖'
    },
    { 
      value: 'RELIFE', 
      label: 'Relife', 
      weight: 2500,
      symbol: '🔄'
    }
  ]
};

const productTypeLabels: Record<ProductType, string> = {
  RAGS: 'Rags',
  Rewear: 'rewear',
  UPCYCLING: 'Upcycling',
  JEANS: 'Jeans',
  WASTE: 'Waste',
  POLYESTER: 'Polyester'
};

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | 'ALL'>('ALL');
  const [expandedCategories, setExpandedCategories] = useState<Set<WasteCategory>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<string>('THIS_MONTH');

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // This would trigger a refetch with the new date range
    // For now, we'll just update the state
  };

  const { data, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      // Mock data with hierarchical structure
      const mockData = {
        inventoryByCategory: [
          {
            category: 'POST_CONSUMER' as WasteCategory,
            totalWeight: 9000,
            totalAmount: 135000,
            items: [] // Items will be generated from subcategories
          },
          {
            category: 'INDUSTRIAL' as WasteCategory,
            totalWeight: 13500,
            totalAmount: 202500,
            items: [] // Items will be generated from subcategories
          }
        ]
      };
      return mockData;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Inventory' }]} />
        <div className="text-center py-8">Loading inventory...</div>
      </div>
    );
  }

  const inventoryData = data?.inventoryByCategory || [];
  
  const filteredInventoryData = inventoryData.filter(category => {
    const matchesCategory = selectedCategory === 'ALL' || category.category === selectedCategory;
    const matchesSearch = !search || 
      wasteCategoryLabels[category.category].toLowerCase().includes(search.toLowerCase()) ||
      category.items.some(item => 
        productTypeLabels[item.productType].toLowerCase().includes(search.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });
  
  const totalWeight = filteredInventoryData.reduce((sum, cat) => {
    return sum + subCategories[cat.category]?.reduce((catSum, subCat) => catSum + subCat.weight, 0) || 0;
  }, 0);
  const totalAmount = filteredInventoryData.reduce((sum, cat) => {
    return sum + subCategories[cat.category]?.reduce((catSum, subCat) => catSum + (subCat.weight * 15), 0) || 0;
  }, 0);
  
  const toggleCategory = (category: WasteCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubCategory = (subCategoryKey: string) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(subCategoryKey)) {
      newExpanded.delete(subCategoryKey);
    } else {
      newExpanded.add(subCategoryKey);
    }
    setExpandedSubCategories(newExpanded);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories or products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={(value: WasteCategory | 'ALL') => setSelectedCategory(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="POST_CONSUMER">Post Consumer</SelectItem>
                <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="THIS_MONTH">This Month</SelectItem>
                <SelectItem value="LAST_MONTH">Last Month</SelectItem>
                <SelectItem value="THIS_QUARTER">This Quarter</SelectItem>
                <SelectItem value="LAST_QUARTER">Last Quarter</SelectItem>
                <SelectItem value="LAST_6_MONTHS">Last 6 Months</SelectItem>
                <SelectItem value="THIS_YEAR">This Year</SelectItem>
                <SelectItem value="LAST_YEAR">Last Year</SelectItem>
                <SelectItem value="ALL_TIME">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                if (expandedCategories.size === filteredInventoryData.length) {
                  setExpandedCategories(new Set());
                } else {
                  setExpandedCategories(new Set(filteredInventoryData.map(cat => cat.category)));
                }
              }}
            >
              {expandedCategories.size === filteredInventoryData.length ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">Total Weight</CardTitle>
            <Package className="h-3 w-3" style={{ color: '#01298a' }} />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatWeight(totalWeight)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">Total Value</CardTitle>
            <IndianRupee className="h-3 w-3" style={{ color: '#01298a' }} />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">₹{totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">Categories</CardTitle>
            <TrendingUp className="h-3 w-3" style={{ color: '#01298a' }} />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">10</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory by Category */}
      <div className="space-y-4">
        {filteredInventoryData.map((category) => {
          const isExpanded = expandedCategories.has(category.category);
          const IconComponent = wasteCategoryIcons[category.category];
          const colorClass = wasteCategoryColors[category.category];
          
          return (
            <Card key={category.category} className="inventory-category-card">
              <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(category.category)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Category Icon */}
                        <div className="relative">
                          <img 
                            src={wasteCategoryImages[category.category]} 
                            alt={wasteCategoryLabels[category.category]}
                            className="w-10 h-10 rounded-lg shadow-md"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5" style={{ color: '#01298a' }} />
                          ) : (
                            <ChevronRight className="h-5 w-5" style={{ color: '#01298a' }} />
                          )}
                          <div>
                            <CardTitle className="text-lg text-gray-900 font-bold">
                              {wasteCategoryLabels[category.category]}
                            </CardTitle>
                            <p className="text-xs text-gray-500 mt-1">
                              {subCategories[category.category]?.length || 0} {(subCategories[category.category]?.length || 0) === 1 ? 'subcategory' : 'subcategories'} available
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Stats Display */}
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Package className="h-4 w-4" style={{ color: '#01298a' }} />
                            <span className="text-base font-bold" style={{ color: '#01298a' }}>
                              {formatWeight(subCategories[category.category]?.reduce((sum, subCat) => sum + subCat.weight, 0) || 0)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="h-4 w-4" style={{ color: '#01298a' }} />
                            <span className="text-base font-bold" style={{ color: '#01298a' }}>
                              ₹{(subCategories[category.category]?.reduce((sum, subCat) => sum + (subCat.weight * 15), 0) || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 bg-gradient-to-br from-blue-50/30 to-blue-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      {subCategories[category.category]?.map((subCat) => {
                        const totalAmount = subCat.weight * 15;
                        const subCategoryKey = `${category.category}-${subCat.value}`;
                        const isSubExpanded = expandedSubCategories.has(subCategoryKey);
                        
                        return (
                          <div key={subCategoryKey} className="space-y-2">
                            <div
                              className="inventory-item-card cursor-pointer hover:shadow-lg transition-all duration-200"
                              onClick={() => toggleSubCategory(subCategoryKey)}
                            >
                              <div className="item-header">
                                <div>
                                  <h4 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#01298a' }}>
                                    <span className="text-lg">{subCat.symbol}</span>
                                    {subCat.label}
                                    {isSubExpanded ? (
                                      <ChevronDown className="h-4 w-4" style={{ color: '#01298a' }} />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" style={{ color: '#01298a' }} />
                                    )}
                                  </h4>
                                </div>
                              </div>
                              
                              <div className="item-metrics mt-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#e6f0ff', border: '1px solid #b3d1ff' }}>
                                    <div className="text-lg font-bold" style={{ color: '#01298a' }}>{formatWeight(subCat.weight)}</div>
                                    <div className="text-xs font-semibold" style={{ color: '#01298a' }}>Weight</div>
                                  </div>
                                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#e6f0ff', border: '1px solid #b3d1ff' }}>
                                    <div className="text-lg font-bold" style={{ color: '#01298a' }}>₹{totalAmount.toLocaleString()}</div>
                                    <div className="text-xs font-semibold" style={{ color: '#01298a' }}>Value</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-2 p-2 rounded-xl" style={{ backgroundColor: '#e6f0ff', border: '1px solid #b3d1ff' }}>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold" style={{ color: '#01298a' }}>Rate:</span>
                                  <span className="text-sm font-bold" style={{ color: '#01298a' }}>₹15.00/kg</span>
                                </div>
                              </div>
                            </div>
                            
                            {isSubExpanded && subCat.subItems && (
                              <div className="ml-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {subCat.subItems.map((subItem) => {
                                  const subItemAmount = subItem.weight * 15;
                                  return (
                                    <div
                                      key={`${subCategoryKey}-${subItem.value}`}
                                      className="p-4 rounded-lg border" 
                                      style={{ backgroundColor: '#e6f0ff', borderColor: '#b3d1ff', minHeight: '140px' }}
                                    >
                                      <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-center mb-3">
                                          <span className="text-3xl">{subItem.symbol}</span>
                                        </div>
                                        <div className="text-center mb-3">
                                          <h5 className="text-sm font-bold truncate" style={{ color: '#01298a' }}>
                                            {subItem.label}
                                          </h5>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-center">
                                          <div className="p-2 rounded" style={{ backgroundColor: '#ffffff', border: '1px solid #b3d1ff' }}>
                                            <div className="text-sm font-bold" style={{ color: '#01298a' }}>{formatWeight(subItem.weight)}</div>
                                            <div className="text-xs font-semibold" style={{ color: '#01298a' }}>Weight</div>
                                          </div>
                                          <div className="p-2 rounded" style={{ backgroundColor: '#ffffff', border: '1px solid #b3d1ff' }}>
                                            <div className="text-sm font-bold" style={{ color: '#01298a' }}>₹{subItemAmount.toLocaleString()}</div>
                                            <div className="text-xs font-semibold" style={{ color: '#01298a' }}>Value</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
        {filteredInventoryData.length === 0 && (
          <Card className="border-2 border-dashed border-blue-200">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No inventory data found</h3>
              <p className="text-gray-500">No inventory data matches your current filters</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria or date range</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}