import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { generateChallanNo } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { vehicleNo } = body;
  
  try {
    const order = mockData.getOrder(params.id);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    if (order.status !== 'ALLOCATED') {
      return NextResponse.json(
        { error: 'Order must be allocated before dispatch' },
        { status: 400 }
      );
    }
    
    const challanNo = generateChallanNo();
    
    const shipment = mockData.createShipment({
      orderId: params.id,
      vehicleNo,
      dispatchedAt: new Date().toISOString(),
      challanNo
    });
    
    const updatedOrder = mockData.updateOrder(params.id, {
      status: 'DISPATCHED'
    });
    
    return NextResponse.json({
      order: updatedOrder,
      shipment
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to dispatch order' },
      { status: 400 }
    );
  }
}