import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/visitors-repo';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || undefined;
    const stats = getDashboardStats(period);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/stats/dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
