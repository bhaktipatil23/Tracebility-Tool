import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const createPartnerSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['COLLECTION', 'PROCESSOR']),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  bankDetails: z.object({
    accountNumber: z.string(),
    ifscCode: z.string(),
    bankName: z.string()
  }).optional(),
  createdBy: z.string().min(1)
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  const partners = mockData.getPartners();
  const filteredPartners = type ? partners.filter(p => p.type === type) : partners;
  
  return NextResponse.json(filteredPartners);
}

export async function POST(request: NextRequest) {
  const role = request.cookies.get('trf_role')?.value;
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const json = await request.json();
    const body = createPartnerSchema.parse(json);
    const newPartner = mockData.createPartner(body);
    
    return NextResponse.json(newPartner, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to create partner';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}