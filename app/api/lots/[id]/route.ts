import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const updateLotSchema = z.object({
  grossKg: z.number().nonnegative().optional(),
  tareKg: z.number().nonnegative().optional(),
  netKg: z.number().nonnegative().optional(),
  contamination: z.array(z.string()).optional(),
  notes: z.string().optional(),
  payoutRatePerKg: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const lot = mockData.getLot(params.id);
  
  if (!lot) {
    return NextResponse.json(
      { error: 'Lot not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(lot);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = request.cookies.get('trf_role')?.value;
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const json = await request.json();
    const body = updateLotSchema.parse(json);
    const updatedLot = mockData.updateLot(params.id, body);
    if (!updatedLot) {
      return NextResponse.json(
        { error: 'Lot not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedLot);
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to update lot';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}