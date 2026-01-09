"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { DataTable } from '@/components/data-table';
import { CreateCollectionPartnerModal } from '@/components/create-collection-partner-modal';
import { formatDate } from '@/lib/utils';
import { Partner } from '@/lib/types';
import { Plus, Search, Users, Building } from 'lucide-react';

export default function CollectionPartnersPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: partners, isLoading, refetch } = useQuery({
    queryKey: ['partners', 'collection'],
    queryFn: async () => {
      const res = await fetch('/api/partners?type=COLLECTION');
      if (!res.ok) throw new Error('Failed to fetch partners');
      return res.json() as Promise<Partner[]>;
    }
  });

  const filteredPartners = partners?.filter((partner) => {
    const matchesSearch = !search || 
      partner.name.toLowerCase().includes(search.toLowerCase()) ||
      partner.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      partner.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleModalSuccess = () => {
    refetch(); // Refresh the partners list
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Partner Name',
      cell: ({ row }: any) => (
        <Link href={`/partners/collection/${row.original.id}`} className="text-gray-900 hover:text-gray-700 font-medium">
          {row.original.name}
        </Link>
      )
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }: any) => formatDate(row.original.createdAt)
    }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Partners', href: '/partners' },
        { label: 'Collection Partners' }
      ]} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Collection Partners</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage material suppliers and collection partners</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Collection Partner
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners?.filter(p => p.isActive).length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {partners?.filter(p => {
                const created = new Date(p.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partners List</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredPartners}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <CreateCollectionPartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}