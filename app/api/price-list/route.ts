import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const priceItemSchema = z.object({
  id: z.string().optional(),
  customerType: z.string().min(1),
  sku: z.string().min(1),
  ratePerKg: z.number().positive(),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET() {
  const priceList = mockData.getPriceList();
  return NextResponse.json(priceList);
}

export async function POST(request: NextRequest) {
  const role = request.cookies.get('trf_role')?.value;
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const json = await request.json();
    const body = priceItemSchema.parse(json);
    const updatedItem = mockData.updatePriceList({ ...body, id: body.id ?? Date.now().toString() } as any);
    return NextResponse.json(updatedItem, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to update price list';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}