import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/admin-session';

export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Total pledges
    const totalPledges = await prisma.pledge.count();

    // Total caches pledged (sum)
    const totalCachesPledged = await prisma.pledge.aggregate({
      _sum: {
        pledgedCount: true,
      },
    });

    // Total confirmations
    const totalConfirmations = await prisma.confirmation.count();

    // Total pledgers
    const totalPledgers = await prisma.user.count({
      where: {
        OR: [
          { pledges: { some: {} } },
          { confirmations: { some: {} } },
        ],
      },
    });

    // States breakdown
    const pledgeStates = await prisma.pledge.findMany({
      select: { states: true },
    });
    const confirmationStates = await prisma.confirmation.findMany({
      select: { state: true },
    });

    const stateBreakdown: Record<string, { pledges: number; confirmations: number }> = {};
    
    pledgeStates.forEach((p) => {
      p.states.forEach((state) => {
        if (!stateBreakdown[state]) {
          stateBreakdown[state] = { pledges: 0, confirmations: 0 };
        }
        stateBreakdown[state].pledges += 1;
      });
    });

    confirmationStates.forEach((c) => {
      if (!stateBreakdown[c.state]) {
        stateBreakdown[c.state] = { pledges: 0, confirmations: 0 };
      }
      stateBreakdown[c.state].confirmations += 1;
    });

    // Cache type breakdown
    const typeBreakdown: Record<string, { pledged: number; confirmed: number }> = {};
    
    pledgeStates.forEach((p) => {
      // We need to get cache types from pledges
      // This is a simplified version - you might want to aggregate differently
    });

    const allPledges = await prisma.pledge.findMany({
      select: { cacheTypes: true },
    });

    allPledges.forEach((p) => {
      p.cacheTypes.forEach((type) => {
        if (!typeBreakdown[type]) {
          typeBreakdown[type] = { pledged: 0, confirmed: 0 };
        }
        typeBreakdown[type].pledged += 1;
      });
    });

    const allConfirmations = await prisma.confirmation.findMany({
      select: { type: true },
    });

    allConfirmations.forEach((c) => {
      if (!typeBreakdown[c.type]) {
        typeBreakdown[c.type] = { pledged: 0, confirmed: 0 };
      }
      typeBreakdown[c.type].confirmed += 1;
    });

    // Cache size breakdown
    const sizeBreakdown: Record<string, { pledged: number; confirmed: number }> = {};
    
    const allPledgesWithSizes = await prisma.pledge.findMany({
      select: { cacheSizes: true },
    });

    allPledgesWithSizes.forEach((p) => {
      p.cacheSizes.forEach((size) => {
        if (!sizeBreakdown[size]) {
          sizeBreakdown[size] = { pledged: 0, confirmed: 0 };
        }
        sizeBreakdown[size].pledged += 1;
      });
    });

    const allConfirmationsWithSizes = await prisma.confirmation.findMany({
      select: { size: true },
    });

    allConfirmationsWithSizes.forEach((c) => {
      if (!sizeBreakdown[c.size]) {
        sizeBreakdown[c.size] = { pledged: 0, confirmed: 0 };
      }
      sizeBreakdown[c.size].confirmed += 1;
    });

    return NextResponse.json({
      totalPledges,
      totalCachesPledged: totalCachesPledged._sum.pledgedCount || 0,
      totalConfirmations,
      totalPledgers,
      stateBreakdown,
      typeBreakdown,
      sizeBreakdown,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}





