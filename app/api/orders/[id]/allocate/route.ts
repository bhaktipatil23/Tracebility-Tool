import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const allocationSchema = z.object({
  allocations: z.array(
    z.object({
      sku: z.string().min(1),
      packIds: z.array(z.string().min(1)).min(1)
    })
  ).min(1)
});

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
    const { allocations } = allocationSchema.parse(json);
    const order = mockData.getOrder(params.id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    // Validate allocations against available packs
    const packs = mockData.getPacks();
    for (const allocation of allocations) {
      for (const packId of allocation.packIds) {
        const pack = packs.find(p => p.id === packId && p.sku === allocation.sku);
        if (!pack) {
          return NextResponse.json(
            { error: `Pack ${packId} not found or SKU mismatch` },
            { status: 400 }
          );
        }
      }
    }
    const updatedOrder = mockData.updateOrder(params.id, {
      status: 'ALLOCATED',
    });
    return NextResponse.json(updatedOrder);
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to allocate order';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}