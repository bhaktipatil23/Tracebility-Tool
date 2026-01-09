import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const role = request.cookies.get('trf_role')?.value;
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sources = mockData.getSources();
  return NextResponse.json(sources);
}