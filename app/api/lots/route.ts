import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const createLotSchema = z.object({
  siteId: z.string().min(1),
  sourceId: z.string().optional(),
  sourceType: z.string().min(1),
  grossKg: z.number().positive(),
  tareKg: z.number().min(0),
  netKg: z.number().positive(),
  contamination: z.array(z.string()).default([]),
  photos: z.array(z.string()).optional(),
  createdBy: z.string().min(1),
  notes: z.string().optional(),
  payoutRatePerKg: z.number().optional(),
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
    const json = await request.json();
    const body = createLotSchema.parse(json);
    const newMaterial = mockData.createMaterial(body);
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to create lot';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}