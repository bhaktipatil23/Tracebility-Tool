import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const createPackageSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  productType: z.string().min(1),
  grossKg: z.number().positive(),
  tareKg: z.number().min(0),
  netKg: z.number().positive(),
  salesRate: z.number().min(0),
  contamination: z.array(z.string()).default([]),
  createdBy: z.string().min(1),
  notes: z.string().optional(),
  weighbridgeDoc: z.string().optional(),
  salesBillDoc: z.string().optional(),
  materialPicWithGeo: z.string().optional(),
  vehicleImage: z.string().optional(),
});

export async function GET() {
  const packages = mockData.getPackages();
  return NextResponse.json(packages);
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
    const fileUrls: any = {};
    
    if (formData.get('weighbridgeDoc')) {
      fileUrls.weighbridgeDoc = `/uploads/weighbridge-${Date.now()}.pdf`;
    }
    if (formData.get('salesBillDoc')) {
      fileUrls.salesBillDoc = `/uploads/sales-bill-${Date.now()}.pdf`;
    }
    if (formData.get('materialPicWithGeo')) {
      fileUrls.materialPicWithGeo = `/uploads/material-pic-${Date.now()}.jpg`;
    }
    if (formData.get('vehicleImage')) {
      fileUrls.vehicleImage = `/uploads/vehicle-${Date.now()}.jpg`;
    }
    
    const packageData = { ...data, ...fileUrls };
    const body = createPackageSchema.parse(packageData);
    const newPackage = mockData.createPackage(body);
    
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to create package';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}