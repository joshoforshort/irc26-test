import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function getWeekEnd(weekStart: string): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6);
  return d.toISOString().split('T')[0];
}

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

    const pledgesByWeek: Record<string, number> = {};
    
    pledges.forEach((pledge) => {
      const weekStart = getWeekStart(pledge.createdAt);
      pledgesByWeek[weekStart] = (pledgesByWeek[weekStart] || 0) + 1;
    });

    const data = Object.entries(pledgesByWeek).map(([weekStart, count]) => ({
      weekStart,
      weekEnd: getWeekEnd(weekStart),
      count,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching pledges by week:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pledges by week' },
      { status: 500 }
    );
  }
}
