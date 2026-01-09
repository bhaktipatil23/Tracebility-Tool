"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProcessorPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Partners', href: '/partners' },
        { label: 'Processors', href: '/partners/processors' },
        { label: 'New Processor' }
      ]} />
      
      <div className="flex items-center space-x-4">
        <Link href="/partners/processors">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Processor</h1>
          <p className="text-gray-600 dark:text-gray-300">Create a new processor account</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processor Registration Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Processor registration form will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}