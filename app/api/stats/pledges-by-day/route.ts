import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const pledges = await prisma.pledge.findMany({
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const pledgesByDay: Record<string, number> = {};
    
    pledges.forEach((pledge) => {
      const dateStr = pledge.createdAt.toISOString().split('T')[0];
      pledgesByDay[dateStr] = (pledgesByDay[dateStr] || 0) + 1;
    });

    const data = Object.entries(pledgesByDay).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching pledges by day:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pledges by day' },
      { status: 500 }
    );
  }
}
