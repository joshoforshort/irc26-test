import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total pledges and submissions
    const [totalPledged, totalSubmissions, allPledges, allSubmissions, latestPledge] = await Promise.all([
      prisma.pledge.count(),
      prisma.submission.count(),
      prisma.pledge.findMany({
        select: { gcUsername: true, approxState: true, cacheType: true },
      }),
      prisma.submission.findMany({
        select: { gcUsername: true, state: true, type: true },
      }),
      prisma.pledge.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { gcUsername: true, title: true, approxState: true },
      }),
    ]);

    // Calculate unique rainmakers (distinct gcUsername from pledges and submissions)
    const rainmakersSet = new Set<string>();
    allPledges.forEach((p) => rainmakersSet.add(p.gcUsername));
    allSubmissions.forEach((s) => rainmakersSet.add(s.gcUsername));
    const rainmakers = rainmakersSet.size;

    // Breakdown by state (from pledges and submissions)
    const byState: Record<string, number> = {};
    allPledges.forEach((p) => {
      byState[p.approxState] = (byState[p.approxState] || 0) + 1;
    });
    allSubmissions.forEach((s) => {
      byState[s.state] = (byState[s.state] || 0) + 1;
    });

    // Breakdown by type (from pledges and submissions)
    const byType: Record<string, number> = {};
    allPledges.forEach((p) => {
      byType[p.cacheType] = (byType[p.cacheType] || 0) + 1;
    });
    allSubmissions.forEach((s) => {
      byType[s.type] = (byType[s.type] || 0) + 1;
    });

    return NextResponse.json({
      totalPledged,
      totalSubmissions,
      rainmakers,
      byState,
      byType,
      latestPledge: latestPledge ? {
        gcUsername: latestPledge.gcUsername,
        title: latestPledge.title,
        state: latestPledge.approxState,
      } : null,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
