import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { z } from 'zod';

const generateSchema = z.object({
  periodMonth: z.string().regex(/^\d{4}-\d{2}$/),
});

export async function POST(request: NextRequest) {
  const role = request.cookies.get('trf_role')?.value;
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const json = await request.json();
    const { periodMonth } = generateSchema.parse(json);
    const lots = mockData.getLots();
    const config = mockData.getConfig();
    const sources = mockData.getSources();
    
    // Filter lots for the period
    const periodLots = lots.filter(lot => {
      const lotMonth = lot.createdAt.slice(0, 7); // YYYY-MM
      return lotMonth === periodMonth;
    });
    
    // Group by source
    const sourceSettlements = new Map<string, { sourceId?: string; totalKg: number; rate: number; }>();
    
    for (const lot of periodLots) {
      const key = lot.sourceId || `${lot.sourceType}-unknown`;
      const existing = sourceSettlements.get(key) || { sourceId: lot.sourceId, totalKg: 0, rate: lot.payoutRatePerKg || config.settlementDefaultRate };
      
      existing.totalKg += lot.netKg;
      sourceSettlements.set(key, existing);
    }
    
    const newSettlements = [];
    for (const [key, data] of sourceSettlements) {
      const settlement = mockData.createSettlement({
        sourceId: data.sourceId,
        periodMonth,
        totalKg: data.totalKg,
        rate: data.rate,
        amount: data.totalKg * data.rate
      });
      newSettlements.push(settlement);
    }
    
    return NextResponse.json(newSettlements, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to generate settlements';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}