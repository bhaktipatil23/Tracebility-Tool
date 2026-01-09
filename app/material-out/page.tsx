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
import { formatWeight, formatDate, getContaminationLabel, exportToCSV } from '@/lib/utils';
import { Plus, Search, Download } from 'lucide-react';
import { Package } from '@/lib/types';

export default function PackagingPage() {
  const [search, setSearch] = useState('');
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

  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const res = await fetch('/api/material-out');
      if (!res.ok) throw new Error('Failed to fetch packages');
      return res.json() as Promise<Package[]>;
    }
  });

  const filteredPackages = packages?.filter((pkg) => {
    const matchesSearch = !search || 
      pkg.code.toLowerCase().includes(search.toLowerCase()) ||
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.productType.toLowerCase().includes(search.toLowerCase()) ||
      (pkg.notes && pkg.notes.toLowerCase().includes(search.toLowerCase()));
    
    const packageDate = new Date(pkg.createdAt);
    const matchesDateFrom = !dateFrom || packageDate >= dateFrom;
    const matchesDateTo = !dateTo || packageDate <= dateTo;
    
    return matchesSearch && matchesDateFrom && matchesDateTo;
  }) || [];

  const handleExportCSV = () => {
    if (filteredPackages.length === 0) return;
    
    const exportData = filteredPackages.map(pkg => ({
      'Package Code': pkg.code,
      'Name': pkg.name,
      'Address': pkg.address,
      'Product Type': pkg.productType,
      'Gross (kg)': pkg.grossKg,
      'Tare (kg)': pkg.tareKg,
      'Net (kg)': pkg.netKg,
      'Sales Rate': pkg.salesRate,
      'Contamination': pkg.contamination.join(', '),
      'Created At': formatDate(pkg.createdAt),
      'Notes': pkg.notes || ''
    }));
    
    exportToCSV(exportData, `packages-${new Date().toISOString().split('T')[0]}.csv`);
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
      accessorKey: 'productType',
      header: 'Source Type',
      cell: ({ row }: any) => {
        const productType = row.original.productType.toLowerCase();
        const badgeClass = productType === 'rags' ? 'admin' : productType === 'rewear' ? 'plant' : 'cp';
        return (
          <span className={`role-badge ${badgeClass} text-xs`}>
            {row.original.productType}
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
      accessorKey: 'materialIn',
      header: 'In',
      cell: ({ row }: any) => (
        <span className="text-sm font-medium text-gray-900">{formatWeight(row.original.netKg * 0.8)}</span>
      )
    },
    {
      accessorKey: 'materialOut',
      header: 'Out',
      cell: ({ row }: any) => (
        <span className="text-sm font-medium text-gray-900">{formatWeight(row.original.netKg * 0.6)}</span>
      )
    },
    {
      accessorKey: 'soldOut',
      header: 'SoldOut',
      cell: ({ row }: any) => (
        <span className="text-sm font-medium text-gray-900">{formatWeight(row.original.netKg * 0.4)}</span>
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
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Material Out</h1>
        </div>
        <Link href="/material-out/new">
          <Button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Material Out
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Management</CardTitle>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
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
            <Button variant="outline" onClick={handleExportCSV} disabled={filteredPackages.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredPackages}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}