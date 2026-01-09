import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const createMaterialSchema = z.object({
  name: z.string().min(1),
  siteId: z.string().min(1),
  sourceId: z.string().optional(),
  sourceType: z.string().min(1),
  grossKg: z.number().positive(),
  tareKg: z.number().min(0),
  netKg: z.number().positive(),
  contamination: z.array(z.string()).default([]),
  createdBy: z.string().min(1),
  notes: z.string().optional(),
  payoutRatePerKg: z.number().optional(),
  weighbridgeDoc: z.string().optional(),
  purchaseBillDoc: z.string().optional(),
  materialPicWithGeo: z.string().optional(),
  vehicleImageLoaded: z.string().optional(),
});

export async function GET() {
  const materials = mockData.getMaterials();
  return NextResponse.json(materials);
}

export async function POST(request: NextRequest) {
  const role = request.cookies.get('trf_role')?.value;
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const formData = await request.formData();
    const dataString = formData.get('data') as string;
    const data = JSON.parse(dataString);
    
    // In a real application, you would handle file uploads here
    // For now, we'll just simulate file URLs
    const fileUrls: any = {};
    
    if (formData.get('weighbridgeDoc')) {
      fileUrls.weighbridgeDoc = `/uploads/weighbridge-${Date.now()}.pdf`;
    }
    if (formData.get('purchaseBillDoc')) {
      fileUrls.purchaseBillDoc = `/uploads/purchase-bill-${Date.now()}.pdf`;
    }
    if (formData.get('materialPicWithGeo')) {
      fileUrls.materialPicWithGeo = `/uploads/material-pic-${Date.now()}.jpg`;
    }
    if (formData.get('vehicleImageLoaded')) {
      fileUrls.vehicleImageLoaded = `/uploads/vehicle-${Date.now()}.jpg`;
    }
    
    const materialData = { ...data, ...fileUrls };
    const body = createMaterialSchema.parse(materialData);
    const newMaterial = mockData.createMaterial(body);
    
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to create material';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}