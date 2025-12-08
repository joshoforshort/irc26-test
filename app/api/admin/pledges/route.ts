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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};

    if (state) {
      where.approxState = state;
    }

    if (cacheType) {
      where.cacheType = cacheType;
    }

    if (gcUsername) {
      where.gcUsername = { contains: gcUsername, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { gcUsername: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { approxSuburb: { contains: search, mode: 'insensitive' } },
        { conceptNotes: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const pledges = await prisma.pledge.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            gcUsername: true,
          },
        },
        submission: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ pledges });
  } catch (error: any) {
    console.error('Error fetching admin pledges:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch pledges' }, { status: 500 });
  }
}
