import { NextRequest, NextResponse } from 'next/server';
import { getAllPages, createPage, getPageCount, setTemplatePage } from '@/lib/pages-repo';
import { getDefaultContent } from '@/lib/defaults';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pages = getAllPages();
    return NextResponse.json(pages);
  } catch (error) {
    console.error('GET /api/pages error:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, description, cloneFromTemplate } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const allPages = getAllPages();
    if (allPages.find((p) => p.slug === slug)) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 409 }
      );
    }

    let content;
    if (cloneFromTemplate) {
      // Try to clone from template
      const { getTemplatePage } = await import('@/lib/pages-repo');
      const template = getTemplatePage();
      content = template ? template.content : getDefaultContent();
    } else if (body.content) {
      content = body.content;
    } else {
      content = getDefaultContent();
    }

    const page = createPage({ slug, title, description, content });

    // Auto-set as template if this is the first page
    const pageCount = getPageCount();
    if (pageCount === 1) {
      setTemplatePage(page.id);
      page.is_template = 1;
    }

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('POST /api/pages error:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
