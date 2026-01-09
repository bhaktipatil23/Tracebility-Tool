import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { validateMassBalance } from '@/lib/utils';
import { z } from 'zod';

const recycleSchema = z.object({
  lotId: z.string().min(1),
  inputKg: z.number().positive(),
  outputs: z.record(z.number().nonnegative()),
  byUser: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const role = request.cookies.get('trf_role')?.value;
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { lotId, inputKg, outputs, byUser } = recycleSchema.parse(await request.json());
    // Validate mass balance
    const totalOutput = Object.values(outputs).reduce((sum: number, kg: number) => sum + kg, 0);
    if (!validateMassBalance(inputKg, totalOutput)) {
      return NextResponse.json(
        { error: 'Mass balance validation failed' },
        { status: 400 }
      );
    }
    
    // Validate output categories for recycle
    const validCategories = ['REC-COT-WHITE', 'REC-COT-COLOR', 'REC-POLY-WHITE', 'REC-POLY-COLOR', 'REC-MIX'];
    const invalidCategories = Object.keys(outputs).filter(cat => !validCategories.includes(cat));
    if (invalidCategories.length > 0) {
      return NextResponse.json(
        { error: `Invalid recycle categories: ${invalidCategories.join(', ')}` },
        { status: 400 }
      );
    }
    
    const newSegOp = mockData.createSegOp({
      lotId,
      phase: 'RECYCLE',
      inputKg,
      outputs,
      byUser
    });
    
    return NextResponse.json(newSegOp, { status: 201 });
  } catch (error) {
    const message = error instanceof z.ZodError ? error.flatten() : 'Failed to create recycle segregation operation';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}