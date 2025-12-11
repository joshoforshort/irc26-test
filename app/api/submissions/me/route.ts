import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await requireAuth();

    const submissions = await prisma.submission.findMany({
      where: { userId: session.user.id },
      include: {
        pledge: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch submissions' }, { status: 500 });
  }
}



