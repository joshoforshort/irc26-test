import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await requireAuth();

    const pledges = await prisma.pledge.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        submission: true,
      },
    });

    return NextResponse.json({ pledges });
  } catch (error: any) {
    console.error('Error fetching pledges:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch pledges' }, { status: 500 });
  }
}



