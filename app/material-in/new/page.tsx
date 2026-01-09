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
import { SourceType, ContaminationFlag } from '@/lib/types';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

const materialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  wasteCategory: z.string().min(1, 'Waste category is required'),
  subCategory: z.string().min(1, 'Sub category is required'),
  siteId: z.string().min(1, 'Site is required'),
  sourceId: z.string().optional(),
  sourceType: z.string().min(1, 'Source type is required'),
  grossKg: z.number().min(0.1, 'Gross weight must be greater than 0'),
  tareKg: z.number().min(0, 'Tare weight cannot be negative'),
  contamination: z.array(z.string()).default([]),
  notes: z.string().optional(),
  payoutRatePerKg: z.number().min(0, 'Payout rate cannot be negative').default(15)
});

type MaterialFormData = z.infer<typeof materialSchema>;

interface FileUpload {
  file: File | null;
  preview: string | null;
}

export default function NewMaterialPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedContamination, setSelectedContamination] = useState<ContaminationFlag[]>([]);
  const [selectedWasteCategory, setSelectedWasteCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  
  // File upload states
  const [weighbridgeDoc, setWeighbridgeDoc] = useState<FileUpload>({ file: null, preview: null });
  const [purchaseBillDoc, setPurchaseBillDoc] = useState<FileUpload>({ file: null, preview: null });
  const [materialPicWithGeo, setMaterialPicWithGeo] = useState<FileUpload>({ file: null, preview: null });
  const [vehicleImageLoaded, setVehicleImageLoaded] = useState<FileUpload>({ file: null, preview: null });

  const { data: sites } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const res = await fetch('/api/sites');
      return res.json();
    }
  });

  const { data: sources } = useQuery({
    queryKey: ['sources'],
    queryFn: async () => {
      const res = await fetch('/api/sources');
      return res.json();
    }
  });

  const { data: collectionPartners } = useQuery({
    queryKey: ['partners', 'collection'],
    queryFn: async () => {
      const res = await fetch('/api/partners?type=COLLECTION');
      if (!res.ok) throw new Error('Failed to fetch collection partners');
      return res.json();
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      siteId: '1',
      payoutRatePerKg: 15
    }
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

  const createMaterialMutation = useMutation({
    mutationFn: async (data: MaterialFormData) => {
      // In a real app, you would upload files to a storage service first
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        ...data,
        netKg,
        contamination: selectedContamination,
        createdBy: user?.name || 'Unknown'
      }));
      
      if (weighbridgeDoc.file) formData.append('weighbridgeDoc', weighbridgeDoc.file);
      if (purchaseBillDoc.file) formData.append('purchaseBillDoc', purchaseBillDoc.file);
      if (materialPicWithGeo.file) formData.append('materialPicWithGeo', materialPicWithGeo.file);
      if (vehicleImageLoaded.file) formData.append('vehicleImageLoaded', vehicleImageLoaded.file);

      const res = await fetch('/api/material-in', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to create material');
      return res.json();
    },
    onSuccess: (material) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success(`Material ${material.code} created successfully`);
      router.push('/material-in');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create material');
    }
  });

  const onSubmit = (data: MaterialFormData) => {
    if (netKg <= 0) {
      toast.error('Net weight must be greater than 0');
      return;
    }
    createMaterialMutation.mutate(data);
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
      
      <div className="flex items-center space-x-4">
        <Link href="/material-in">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Material Collection</h1>
          <p className="text-gray-600 dark:text-gray-300">Create a material entry</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Material Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Partner *</Label>
                <Select onValueChange={(value) => setValue('name', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {collectionPartners?.filter(p => p.isActive).map((partner) => (
                      <SelectItem key={partner.id} value={partner.name}>
                        {partner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="wasteCategory">Waste Category *</Label>
                <Select value={selectedWasteCategory || undefined} onValueChange={(value) => {
                  setSelectedWasteCategory(value);
                  setSelectedSubCategory('');
                  setValue('wasteCategory', value);
                  setValue('subCategory', ''); // Reset subcategory
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
                  <Select value={selectedSubCategory || undefined} onValueChange={(value) => {
                    setSelectedSubCategory(value);
                    setValue('subCategory', value);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedWasteCategory === 'POST_CONSUMER' && (
                        <>
                          <SelectItem value="MIXED_CHINDI">Mixed Chindi</SelectItem>
                          <SelectItem value="PCTW_REWEAR_MIX">PCTW(Rewear+mix)</SelectItem>
                        </>
                      )}
                      {selectedWasteCategory === 'INDUSTRIAL' && (
                        <>
                          <SelectItem value="COTTON">Cotton</SelectItem>
                          <SelectItem value="POLYESTER">Polyester</SelectItem>
                          <SelectItem value="DENIM">Denim</SelectItem>
                          <SelectItem value="RELIFE">Relife</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.subCategory && (
                    <p className="text-sm text-red-600">{errors.subCategory.message}</p>
                  )}
                </div>
              )}

              {selectedSubCategory === 'PCTW_REWEAR_MIX' && (
                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type *</Label>
                  <Select onValueChange={(value) => setValue('productType', value)}>
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
                <Label htmlFor="sourceType">Source Type *</Label>
                <Select onValueChange={(value) => setValue('sourceType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
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
                {errors.sourceType && (
                  <p className="text-sm text-red-600">{errors.sourceType.message}</p>
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
                <div className={`text-lg font-semibold ${
                  netKg < 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'
                }`}>
                  {netKg.toFixed(1)} kg
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payoutRatePerKg">Payout Rate (₹/kg)</Label>
                <Input
                  id="payoutRatePerKg"
                  type="number"
                  step="0.01"
                  {...register('payoutRatePerKg', { valueAsNumber: true })}
                />
                {errors.payoutRatePerKg && (
                  <p className="text-sm text-red-600">{errors.payoutRatePerKg.message}</p>
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
                title="Purchase Bill"
                fileState={purchaseBillDoc}
                setter={setPurchaseBillDoc}
              />
              
              <FileUploadSection
                title="Material Picture with Geo Location"
                fileState={materialPicWithGeo}
                setter={setMaterialPicWithGeo}
                accept="image/*"
              />
              
              <FileUploadSection
                title="Vehicle Image (Loaded)"
                fileState={vehicleImageLoaded}
                setter={setVehicleImageLoaded}
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes about this material..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMaterialMutation.isPending}>
                {createMaterialMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Material
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}