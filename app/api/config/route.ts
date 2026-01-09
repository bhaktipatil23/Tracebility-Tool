import { NextRequest, NextResponse } from 'next/server';
import { mockData } from '@/lib/mock-data';

export async function GET() {
  const config = mockData.getConfig();
  return NextResponse.json(config);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  
  try {
    const updatedConfig = mockData.updateConfig(body);
    return NextResponse.json(updatedConfig);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 400 }
    );
  }
}