import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-session';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const cacheType = searchParams.get('cacheType');
    const gcUsername = searchParams.get('gcUsername');
    const search = searchParams.get('search');

    const where: any = {};

    if (state) where.approxState = state;
    if (cacheType) where.cacheType = cacheType;
    if (gcUsername) where.gcUsername = { contains: gcUsername, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { gcUsername: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { approxSuburb: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pledges = await prisma.pledge.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            gcUsername: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Generate CSV
    const headers = ['ID', 'GC Username', 'Email', 'Title', 'Cache Type', 'Cache Size', 'Suburb', 'State', 'Status', 'Created At'];
    const rows = pledges.map((p) => [
      p.id,
      p.gcUsername,
      p.user?.email || '',
      p.title || '',
      p.cacheType,
      p.cacheSize,
      p.approxSuburb,
      p.approxState,
      p.status,
      new Date(p.createdAt).toISOString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="irc26-pledges-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting pledges:', error);
    return NextResponse.json({ error: error.message || 'Failed to export pledges' }, { status: 500 });
  }
}

