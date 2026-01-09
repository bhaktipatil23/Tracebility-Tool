"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
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
                  <CardContent className="pt-0 bg-gradient-to-br from-gray-50/50 to-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                      {subCategories[category.category]?.map((subCat) => {
                        const totalAmount = subCat.weight * 15;
                        const subCategoryKey = `${category.category}-${subCat.value}`;
                        const isSubExpanded = expandedSubCategories.has(subCategoryKey);
                        
                        return (
                          <div key={subCategoryKey} className="space-y-2">
                            <div
                              className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                              onClick={() => {
                                if (subCat.subItems && subCat.subItems.length > 0) {
                                  setSelectedSubCategory(subCat);
                                } else {
                                  toggleSubCategory(subCategoryKey);
                                }
                              }}
                            >
                              {/* Header with icon and title */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                    {subCat.symbol}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                                      {subCat.label}
                                    </h4>
                                    <div className="flex items-center gap-1 text-gray-500">
                                      <span className="text-xs">
                                        {subCat.subItems && subCat.subItems.length > 0 ? 'Click to view details' : 'Click to expand'}
                                      </span>
                                      {isSubExpanded ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Main metrics */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                  <div className="text-center flex-1">
                                    <div className="text-lg font-bold text-gray-900">{formatWeight(subCat.weight)}</div>
                                    <div className="text-xs text-gray-600 font-medium">Weight</div>
                                  </div>
                                  <div className="w-px h-8 bg-gray-300 mx-3"></div>
                                  <div className="text-center flex-1">
                                    <div className="text-lg font-bold text-green-600">₹{totalAmount.toLocaleString()}</div>
                                    <div className="text-xs text-gray-600 font-medium">Value</div>
                                  </div>
                                </div>
                                
                                {/* Rate section */}
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded border border-blue-200 w-fit">
                                  <span className="text-xs font-semibold text-blue-800">Rate:</span>
                                  <span className="text-xs font-bold text-blue-900">₹15.00/kg</span>
                                </div>
                              </div>
                            </div>
                            
                            {isSubExpanded && subCat.subItems && (
                              <div className="ml-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50/50 rounded-lg">
                                {subCat.subItems.map((subItem) => {
                                  const subItemAmount = subItem.weight * 15;
                                  return (
                                    <div
                                      key={`${subCategoryKey}-${subItem.value}`}
                                      className="bg-white rounded-md border border-gray-200 p-3 hover:shadow-sm transition-all duration-200 hover:border-blue-300"
                                    >
                                      <div className="flex flex-col h-full">
                                        {/* Icon and title */}
                                        <div className="flex items-center gap-2 mb-3">
                                          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                                            {subItem.symbol}
                                          </div>
                                          <h5 className="text-xs font-bold text-gray-900 truncate">
                                            {subItem.label}
                                          </h5>
                                        </div>
                                        
                                        {/* Metrics */}
                                        <div className="space-y-2 flex-1">
                                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                            <div className="text-center flex-1">
                                              <div className="text-sm font-bold text-gray-900">{formatWeight(subItem.weight)}</div>
                                              <div className="text-xs text-gray-600 font-medium">Weight</div>
                                            </div>
                                            <div className="w-px h-6 bg-gray-300 mx-2"></div>
                                            <div className="text-center flex-1">
                                              <div className="text-sm font-bold text-green-600">₹{subItemAmount.toLocaleString()}</div>
                                              <div className="text-xs text-gray-600 font-medium">Value</div>
                                            </div>
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

      {/* Popup Modal for Sub-Items */}
      <Dialog open={!!selectedSubCategory} onOpenChange={() => setSelectedSubCategory(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center text-white text-sm font-bold">
                {selectedSubCategory?.symbol}
              </div>
              {selectedSubCategory?.label} Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedSubCategory?.subItems && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {selectedSubCategory.subItems.map((subItem: any) => {
                const subItemAmount = subItem.weight * 15;
                return (
                  <div
                    key={subItem.value}
                    className="bg-white rounded-md border border-gray-200 p-3 hover:shadow-sm transition-all duration-200 hover:border-blue-300"
                  >
                    <div className="flex flex-col h-full">
                      {/* Icon and title */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                          {subItem.symbol}
                        </div>
                        <h5 className="text-xs font-bold text-gray-900 truncate">
                          {subItem.label}
                        </h5>
                      </div>
                      
                      {/* Metrics */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="text-center flex-1">
                            <div className="text-sm font-bold text-gray-900">{formatWeight(subItem.weight)}</div>
                            <div className="text-xs text-gray-600 font-medium">Weight</div>
                          </div>
                          <div className="w-px h-6 bg-gray-300 mx-2"></div>
                          <div className="text-center flex-1">
                            <div className="text-sm font-bold text-green-600">₹{subItemAmount.toLocaleString()}</div>
                            <div className="text-xs text-gray-600 font-medium">Value</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}