import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const createPackSchema = z.object({
  sku: z.string().min(1),
  lotId: z.string().optional(),
  kg: z.number().positive(),
  location: z.string().min(1),
});

export async function GET() {
  const packs = mockData.getPacks();
  return NextResponse.json(packs);
}

export async function POST(request: NextRequest) {
  const role = request.cookies.get('trf_role')?.value;
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const json = await request.json();
    const body = createPackSchema.parse(json);
    const newPack = mockData.createPack(body);
    return NextResponse.json(newPack, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to create pack';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}