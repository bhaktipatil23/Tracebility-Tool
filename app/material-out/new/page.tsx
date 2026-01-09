"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  wasteCategory: z.string().min(1, 'Waste category is required'),
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
  const [selectedWasteCategory, setSelectedWasteCategory] = useState<string>('');
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  
  // File upload states
  const [weighbridgeDoc, setWeighbridgeDoc] = useState<FileUpload>({ file: null, preview: null });
  const [salesBillDoc, setSalesBillDoc] = useState<FileUpload>({ file: null, preview: null });
  const [materialPicWithGeo, setMaterialPicWithGeo] = useState<FileUpload>({ file: null, preview: null });
  const [vehicleImage, setVehicleImage] = useState<FileUpload>({ file: null, preview: null });

  const { data: processors } = useQuery({
    queryKey: ['partners', 'processors'],
    queryFn: async () => {
      const res = await fetch('/api/partners?type=PROCESSOR');
      if (!res.ok) throw new Error('Failed to fetch processors');
      return res.json();
    }
  });

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

      const res = await fetch('/api/material-out', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to create package');
      return res.json();
    },
    onSuccess: (pkg) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success(`Package ${pkg.code} created successfully`);
      router.push('/material-out');
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

  const contaminationFlags: ContaminationFlag[] = [];

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
        { label: 'Material Out', href: '/material-out' },
        { label: 'New Package' }
      ]} />
      
      <div className="flex items-center space-x-4">
        <Link href="/material-out">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Material Out</h1>
          <p className="text-gray-600 dark:text-gray-300">Create a material out entry</p>
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
                <Label htmlFor="name">Processor *</Label>
                <Select onValueChange={(value) => setValue('name', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select processor" />
                  </SelectTrigger>
                  <SelectContent>
                    {processors?.filter(p => p.isActive).map((processor) => (
                      <SelectItem key={processor.id} value={processor.name}>
                        {processor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="wasteCategory">Waste Category *</Label>
                <Select onValueChange={(value) => {
                  setValue('wasteCategory', value);
                  setSelectedWasteCategory(value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST_CONSUMER">Post Consumer Textile Waste</SelectItem>
                    <SelectItem value="INDUSTRIAL">Industrial Textile Waste</SelectItem>
                  </SelectContent>
                </Select>
                {errors.wasteCategory && (
                  <p className="text-sm text-red-600">{errors.wasteCategory.message}</p>
                )}
              </div>

              {selectedWasteCategory && (
                <div className="space-y-2">
                  <Label htmlFor="subCategory">Sub Category *</Label>
                  <Select onValueChange={(value) => {
                    setValue('productType', value);
                    setSelectedProductType(value);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedWasteCategory === 'POST_CONSUMER' ? (
                        <>
                          <SelectItem value="MIXED_CHINDI">Mixed Chindi</SelectItem>
                          <SelectItem value="PCTW_MIXED_REWEAR">PCTW (Mixed+Rewear)</SelectItem>
                        </>
                      ) : selectedWasteCategory === 'INDUSTRIAL' ? (
                        <>
                          <SelectItem value="COTTON">Cotton</SelectItem>
                          <SelectItem value="POLYESTER">Polyester</SelectItem>
                          <SelectItem value="DENIM">Denim</SelectItem>
                          <SelectItem value="RELIFE">Relife</SelectItem>
                        </>
                      ) : null}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedProductType === 'PCTW_MIXED_REWEAR' && (
                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type *</Label>
                  <Select onValueChange={(value) => setValue('subProductType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MIXED">Mixed</SelectItem>
                      <SelectItem value="REWEAR">Rewear</SelectItem>
                      <SelectItem value="RELIFE">Relife</SelectItem>
                      <SelectItem value="RECYCLE">Recycle</SelectItem>
                      <SelectItem value="REVAMP">Revamp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

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