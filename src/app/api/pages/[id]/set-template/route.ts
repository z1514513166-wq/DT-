import { NextRequest, NextResponse } from 'next/server';
import { setTemplatePage } from '@/lib/pages-repo';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pageId = parseInt(id, 10);
    if (isNaN(pageId)) {
      return NextResponse.json({ error: 'Invalid page ID' }, { status: 400 });
    }

    const updated = setTemplatePage(pageId);
    if (!updated) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, template: updated });
  } catch (error) {
    console.error('POST /api/pages/[id]/set-template error:', error);
    return NextResponse.json(
      { error: 'Failed to set template' },
      { status: 500 }
    );
  }
}
