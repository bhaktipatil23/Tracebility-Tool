"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/data-table';
import { formatWeight, formatDate, getSourceTypeLabel, getContaminationLabel, exportToCSV } from '@/lib/utils';
import { Plus, Search, Download } from 'lucide-react';
import { Material, SourceType } from '@/lib/types';

export default function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<SourceType | 'ALL'>('ALL');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [dateRange, setDateRange] = useState<string>('CUSTOM');

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    const now = new Date();
    let from: Date | undefined;
    let to: Date | undefined = now;
    
    switch (range) {
      case 'THIS_MONTH':
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'LAST_MONTH':
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        to = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'THIS_QUARTER':
        from = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'LAST_QUARTER':
        from = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1);
        to = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0);
        break;
      case 'LAST_6_MONTHS':
        from = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'THIS_YEAR':
        from = new Date(now.getFullYear(), 0, 1);
        break;
      case 'LAST_YEAR':
        from = new Date(now.getFullYear() - 1, 0, 1);
        to = new Date(now.getFullYear() - 1, 11, 31);
        break;
      case 'CUSTOM':
        return;
    }
    
    setDateFrom(from);
    setDateTo(to);
  };

  const { data: materials, isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const res = await fetch('/api/material-in');
      if (!res.ok) throw new Error('Failed to fetch materials');
      return res.json() as Promise<Material[]>;
    }
  });

  const filteredMaterials = materials?.filter((material) => {
    const matchesSearch = !search || 
      material.code.toLowerCase().includes(search.toLowerCase()) ||
      material.name.toLowerCase().includes(search.toLowerCase()) ||
      material.sourceType.toLowerCase().includes(search.toLowerCase()) ||
      (material.notes && material.notes.toLowerCase().includes(search.toLowerCase()));
    
    const matchesSourceType = sourceTypeFilter === 'ALL' || material.sourceType === sourceTypeFilter;
    
    const materialDate = new Date(material.createdAt);
    const matchesDateFrom = !dateFrom || materialDate >= dateFrom;
    const matchesDateTo = !dateTo || materialDate <= dateTo;
    
    return matchesSearch && matchesSourceType && matchesDateFrom && matchesDateTo;
  }) || [];

  const handleExportCSV = () => {
    if (filteredMaterials.length === 0) return;
    
    const exportData = filteredMaterials.map(material => ({
      'Material Code': material.code,
      'Name': material.name,
      'Source Type': material.sourceType,
      'Gross (kg)': material.grossKg,
      'Tare (kg)': material.tareKg,
      'Net (kg)': material.netKg,
      'Contamination': material.contamination.join(', '),
      'Payout Rate': material.payoutRatePerKg || 15,
      'Created At': formatDate(material.createdAt),
      'Notes': material.notes || ''
    }));
    
    exportToCSV(exportData, `materials-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Material',
      cell: ({ row }: any) => (
        <span className="text-sm font-medium text-gray-900">{row.original.name}</span>
      )
    },
    {
      accessorKey: 'sourceType',
      header: 'Source Type',
      cell: ({ row }: any) => {
        const sourceType = row.original.sourceType.toLowerCase();
        const badgeClass = sourceType === 'brand' ? 'admin' : sourceType === 'ngo' ? 'plant' : 'cp';
        return (
          <span className={`role-badge ${badgeClass} text-xs`}>
            {getSourceTypeLabel(row.original.sourceType)}
          </span>
        );
      }
    },
    {
      accessorKey: 'netKg',
      header: 'Net Weight',
      cell: ({ row }: any) => (
        <span className="text-sm font-medium text-gray-900">{formatWeight(row.original.netKg)}</span>
      )
    },
    {
      accessorKey: 'contamination',
      header: 'Status',
      cell: ({ row }: any) => {
        const isClean = row.original.contamination.length === 0;
        return (
          <span className={`status-badge ${isClean ? 'active' : 'inactive'} text-xs`}>
            <span className={`w-2 h-2 rounded-full ${isClean ? 'bg-[#f7f1ee]' : 'bg-red-500'}`}></span>
            {isClean ? 'Clean' : 'Contaminated'}
          </span>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">{formatDate(row.original.createdAt)}</span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <a href={`/materials/${row.original.id}`} className="text-sm text-blue-600 hover:underline">
          view
        </a>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Material Collection</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage material intake</p>
        </div>
        <Link href="/material-in/new">
          <Button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Material Collection
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material Management</CardTitle>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-32"
              />
            </div>
            <Select value={sourceTypeFilter} onValueChange={(value: SourceType | 'ALL') => setSourceTypeFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sources</SelectItem>
                <SelectItem value="BRAND">Brand</SelectItem>
                <SelectItem value="NGO">NGO</SelectItem>
                <SelectItem value="WAGHRI">Waghri</SelectItem>
                <SelectItem value="CONSUMER">Consumer</SelectItem>
                <SelectItem value="SCHOOL">School</SelectItem>
                <SelectItem value="HOTEL">Hotel</SelectItem>
                <SelectItem value="OFFICE">Office</SelectItem>
                <SelectItem value="AGGREGATOR">Aggregator</SelectItem>
                <SelectItem value="IMPORTED">Imported</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOM">Custom Range</SelectItem>
                <SelectItem value="THIS_MONTH">This Month</SelectItem>
                <SelectItem value="LAST_MONTH">Last Month</SelectItem>
                <SelectItem value="THIS_QUARTER">This Quarter</SelectItem>
                <SelectItem value="LAST_QUARTER">Last Quarter</SelectItem>
                <SelectItem value="LAST_6_MONTHS">Last 6 Months</SelectItem>
                <SelectItem value="THIS_YEAR">This Year</SelectItem>
                <SelectItem value="LAST_YEAR">Last Year</SelectItem>
              </SelectContent>
            </Select>
            {dateRange === 'CUSTOM' && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-40 justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-40 justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                  </PopoverContent>
                </Popover>
              </>
            )}
            <Button variant="outline" onClick={handleExportCSV} disabled={filteredMaterials.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredMaterials}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}