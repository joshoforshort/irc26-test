import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { updatePledgeSchema } from '@/lib/validation';
import { isAdmin } from '@/lib/auth-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const pledgeId = params.id;

    const pledge = await prisma.pledge.findUnique({
      where: { id: pledgeId },
    });

    if (!pledge) {
      return NextResponse.json({ error: 'Pledge not found' }, { status: 404 });
    }

    // Check ownership or admin
    const userIsAdmin = isAdmin(session.user.email);
    if (!userIsAdmin && pledge.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ pledge });
  } catch (error: any) {
    console.error('Error fetching pledge:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch pledge' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const pledgeId = params.id;

    // Get existing pledge
    const existingPledge = await prisma.pledge.findUnique({
      where: { id: pledgeId },
    });

    if (!existingPledge) {
      return NextResponse.json({ error: 'Pledge not found' }, { status: 404 });
    }

    // Check ownership or admin
    const userIsAdmin = isAdmin(session.user.email);
    if (!userIsAdmin && existingPledge.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Validate input
    const validated = updatePledgeSchema.parse(body);

    // Prepare update data
    const updateData: any = {
      ...validated,
      gcUsername: validated.gcUsername || existingPledge.gcUsername,
    };

    // Handle images - if provided, use it; otherwise preserve existing
    if ('images' in validated && validated.images !== undefined) {
      updateData.images = validated.images;
    }

    // Update pledge
    const pledge = await prisma.pledge.update({
      where: { id: pledgeId },
      data: updateData,
    });

    // If admin, log the change
    if (userIsAdmin) {
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          actorEmail: session.user.email || undefined,
          action: 'UPDATE_PLEDGE',
          targetId: pledgeId,
          targetKind: 'PLEDGE',
          before: existingPledge as any,
          after: pledge as any,
        },
      });
    }

    return NextResponse.json({ success: true, pledge });
  } catch (error: any) {
    console.error('Error updating pledge:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update pledge' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const pledgeId = params.id;

    // Get existing pledge
    const existingPledge = await prisma.pledge.findUnique({
      where: { id: pledgeId },
    });

    if (!existingPledge) {
      return NextResponse.json({ error: 'Pledge not found' }, { status: 404 });
    }

    // Check ownership or admin
    const userIsAdmin = isAdmin(session.user.email);
    if (!userIsAdmin && existingPledge.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // If admin, log the deletion
    if (userIsAdmin) {
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          actorEmail: session.user.email || undefined,
          action: 'DELETE_PLEDGE',
          targetId: pledgeId,
          targetKind: 'PLEDGE',
          before: existingPledge as any,
        },
      });
    }

    // Delete pledge (cascade will handle submission)
    await prisma.pledge.delete({
      where: { id: pledgeId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting pledge:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete pledge' }, { status: 500 });
  }
}
