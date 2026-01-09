"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useAuth } from '@/lib/auth';
import { ContaminationFlag } from '@/lib/types';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

const packageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  productType: z.string().min(1, 'Product type is required'),
  grossKg: z.number().min(0.1, 'Gross weight must be greater than 0'),
  tareKg: z.number().min(0, 'Tare weight cannot be negative'),
  salesRate: z.number().min(0, 'Sales rate cannot be negative'),
  contamination: z.array(z.string()).default([]),
  notes: z.string().optional()
});

type PackageFormData = z.infer<typeof packageSchema>;

interface FileUpload {
  file: File | null;
  preview: string | null;
}

export default function NewPackagePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedContamination, setSelectedContamination] = useState<ContaminationFlag[]>([]);
  
  // File upload states
  const [weighbridgeDoc, setWeighbridgeDoc] = useState<FileUpload>({ file: null, preview: null });
  const [salesBillDoc, setSalesBillDoc] = useState<FileUpload>({ file: null, preview: null });
  const [materialPicWithGeo, setMaterialPicWithGeo] = useState<FileUpload>({ file: null, preview: null });
  const [vehicleImage, setVehicleImage] = useState<FileUpload>({ file: null, preview: null });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema)
  });

  const grossKg = watch('grossKg');
  const tareKg = watch('tareKg');
  const netKg = (grossKg || 0) - (tareKg || 0);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<FileUpload>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setter({
          file,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (setter: React.Dispatch<React.SetStateAction<FileUpload>>) => {
    setter({ file: null, preview: null });
  };

  const createPackageMutation = useMutation({
    mutationFn: async (data: PackageFormData) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        ...data,
        netKg,
        contamination: selectedContamination,
        createdBy: user?.name || 'Unknown'
      }));
      
      if (weighbridgeDoc.file) formData.append('weighbridgeDoc', weighbridgeDoc.file);
      if (salesBillDoc.file) formData.append('salesBillDoc', salesBillDoc.file);
      if (materialPicWithGeo.file) formData.append('materialPicWithGeo', materialPicWithGeo.file);
      if (vehicleImage.file) formData.append('vehicleImage', vehicleImage.file);

      const res = await fetch('/api/packaging', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to create package');
      return res.json();
    },
    onSuccess: (pkg) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success(`Package ${pkg.code} created successfully`);
      router.push('/packaging');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create package');
    }
  });

  const onSubmit = (data: PackageFormData) => {
    if (netKg <= 0) {
      toast.error('Net weight must be greater than 0');
      return;
    }
    createPackageMutation.mutate(data);
  };

  const contaminationFlags: ContaminationFlag[] = ['WET', 'SOILED', 'MIXED', 'INFESTED'];

  const FileUploadSection = ({ 
    title, 
    fileState, 
    setter, 
    accept = "image/*,.pdf,.doc,.docx" 
  }: {
    title: string;
    fileState: FileUpload;
    setter: React.Dispatch<React.SetStateAction<FileUpload>>;
    accept?: string;
  }) => (
    <div className="space-y-2">
      <Label>{title}</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {fileState.file ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{fileState.file.name}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeFile(setter)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <div className="mt-2">
              <label className="cursor-pointer">
                <span className="text-sm text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept={accept}
                  onChange={(e) => handleFileUpload(e, setter)}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Packaging', href: '/packaging' },
        { label: 'New Package' }
      ]} />
      
      <div className="flex items-center space-x-4">
        <Link href="/packaging">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Package</h1>
          <p className="text-gray-600 dark:text-gray-300">Create a new package entry</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter package name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Enter address"
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">Product Type *</Label>
                <Select onValueChange={(value) => setValue('productType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RAGS">Rags</SelectItem>
                    <SelectItem value="Rewear">Rewear</SelectItem>
                    <SelectItem value="UPCYCLING">Upcycling</SelectItem>
                    <SelectItem value="JEANS">Jeans</SelectItem>
                    <SelectItem value="WASTE">Waste</SelectItem>
                    <SelectItem value="POLYESTER">Polyester</SelectItem>
                  </SelectContent>
                </Select>
                {errors.productType && (
                  <p className="text-sm text-red-600">{errors.productType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grossKg">Gross Weight (kg) *</Label>
                <Input
                  id="grossKg"
                  type="number"
                  step="0.1"
                  {...register('grossKg', { valueAsNumber: true })}
                />
                {errors.grossKg && (
                  <p className="text-sm text-red-600">{errors.grossKg.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tareKg">Tare Weight (kg) *</Label>
                <Input
                  id="tareKg"
                  type="number"
                  step="0.1"
                  {...register('tareKg', { valueAsNumber: true })}
                />
                {errors.tareKg && (
                  <p className="text-sm text-red-600">{errors.tareKg.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Net Weight (kg)</Label>
                <div className="text-lg font-semibold text-green-600">
                  {netKg.toFixed(1)} kg
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesRate">Sales Rate (₹/kg) *</Label>
                <Input
                  id="salesRate"
                  type="number"
                  step="0.01"
                  {...register('salesRate', { valueAsNumber: true })}
                />
                {errors.salesRate && (
                  <p className="text-sm text-red-600">{errors.salesRate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contamination Flags</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {contaminationFlags.map((flag) => (
                  <div key={flag} className="flex items-center space-x-2">
                    <Checkbox
                      id={flag}
                      checked={selectedContamination.includes(flag)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedContamination([...selectedContamination, flag]);
                        } else {
                          setSelectedContamination(selectedContamination.filter(f => f !== flag));
                        }
                      }}
                    />
                    <Label htmlFor={flag} className="text-sm">
                      {flag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadSection
                title="Weighbridge Document"
                fileState={weighbridgeDoc}
                setter={setWeighbridgeDoc}
              />
              
              <FileUploadSection
                title="Sales Bill"
                fileState={salesBillDoc}
                setter={setSalesBillDoc}
              />
              
              <FileUploadSection
                title="Material Picture with Geo Location"
                fileState={materialPicWithGeo}
                setter={setMaterialPicWithGeo}
                accept="image/*"
              />
              
              <FileUploadSection
                title="Vehicle Image"
                fileState={vehicleImage}
                setter={setVehicleImage}
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes about this package..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPackageMutation.isPending}>
                {createPackageMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Package
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}