import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerType: z.string().min(1),
  items: z.array(
    z.object({
      sku: z.string().min(1),
      qtyKg: z.number().positive(),
      ratePerKg: z.number().optional(),
    })
  ).min(1),
});

export async function GET() {
  const orders = mockData.getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const role = request.cookies.get('trf_role')?.value;
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const json = await request.json();
    const body = createOrderSchema.parse(json);
    const newOrder = mockData.createOrder({
      ...body,
      status: 'DRAFT'
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to create order';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}