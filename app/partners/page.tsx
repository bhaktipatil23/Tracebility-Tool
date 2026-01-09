"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CreateCollectionPartnerModal } from '@/components/create-collection-partner-modal';
import { CreateProcessorModal } from '@/components/create-processor-modal';
import { Users, Building, Plus, ArrowRight } from 'lucide-react';

export default function PartnersPage() {
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isProcessorModalOpen, setIsProcessorModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Partners</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-gray-900">Collection Partners</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Manage partners who supply materials to your facility. Track their performance, manage contracts, and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/partners/collection" className="flex-1">
                <Button className="w-full group">
                  <Building className="mr-2 h-4 w-4" />
                  View Partners
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setIsCollectionModalOpen(true)} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-gray-900">Processors</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Manage processors who purchase materials from your facility. Monitor orders, track shipments, and maintain relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/partners/processors" className="flex-1">
                <Button className="w-full group">
                  <Building className="mr-2 h-4 w-4" />
                  View Processors
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setIsProcessorModalOpen(true)} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Processor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateCollectionPartnerModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
      />
      
      <CreateProcessorModal
        isOpen={isProcessorModalOpen}
        onClose={() => setIsProcessorModalOpen(false)}
      />
    </div>
  );
}