import { NextRequest, NextResponse } from 'next/server';
import { getPageBySlug } from '@/lib/pages-repo';
import { trackVisit } from '@/lib/visitors-repo';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const page = getPageBySlug(slug);
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;

    trackVisit(page.id, ipAddress, userAgent, referer);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('POST /api/track error:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}
