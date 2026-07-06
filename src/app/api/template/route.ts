import { NextResponse } from 'next/server';
import { getTemplatePage } from '@/lib/pages-repo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const template = getTemplatePage();
    if (!template) {
      return NextResponse.json({ error: 'No template found' }, { status: 404 });
    }
    return NextResponse.json(template);
  } catch (error) {
    console.error('GET /api/template error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}
