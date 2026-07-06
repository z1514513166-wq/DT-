import { NextRequest, NextResponse } from 'next/server';
import { getStatsForPage } from '@/lib/visitors-repo';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pageId = parseInt(id, 10);
    if (isNaN(pageId)) {
      return NextResponse.json({ error: 'Invalid page ID' }, { status: 400 });
    }

    const stats = getStatsForPage(pageId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/pages/[id]/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
