import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';
import { validateMassBalance } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lotId, inputKg, outputs, relifeReasons, byUser } = body;
  
  try {
    // Validate mass balance
    const totalOutput = Object.values(outputs).reduce((sum: number, kg: number) => sum + kg, 0);
    if (!validateMassBalance(inputKg, totalOutput)) {
      return NextResponse.json(
        { error: 'Mass balance validation failed' },
        { status: 400 }
      );
    }
    
    // Validate relife reasons if relife output exists
    if (outputs.RELIFE > 0 && (!relifeReasons || relifeReasons.length === 0)) {
      return NextResponse.json(
        { error: 'Relife reasons required when relife output > 0' },
        { status: 400 }
      );
    }
    
    // Validate output categories
    const validCategories = ['REWEAR', 'REVAMP', 'RECYCLE', 'RELIFE'];
    const invalidCategories = Object.keys(outputs).filter(cat => !validCategories.includes(cat));
    if (invalidCategories.length > 0) {
      return NextResponse.json(
        { error: `Invalid output categories: ${invalidCategories.join(', ')}` },
        { status: 400 }
      );
    }
    
    const newSegOp = mockData.createSegOp({
      lotId,
      phase: 'PRIMARY',
      inputKg,
      outputs,
      relifeReasons,
      byUser
    });
    
    return NextResponse.json(newSegOp, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create segregation operation' },
      { status: 400 }
    );
  }
}