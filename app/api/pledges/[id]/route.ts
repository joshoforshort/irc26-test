import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { updatePledgeSchema } from '@/lib/validation';
import { isAdmin } from '@/lib/auth-config';
import { verifyAdminSession } from '@/lib/admin-session';
import { deleteUploadThingFiles } from '@/lib/uploadthing-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const isAdminSession = await verifyAdminSession();
    const pledgeId = params.id;

    if (!session?.user && !isAdminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pledge = await prisma.pledge.findUnique({
      where: { id: pledgeId },
    });

    if (!pledge) {
      return NextResponse.json({ error: 'Pledge not found' }, { status: 404 });
    }

    const userIsAdmin = isAdminSession || (session?.user?.email && isAdmin(session.user.email));
    if (!userIsAdmin && pledge.userId !== session?.user?.id) {
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
    const session = await getSession();
    const isAdminSession = await verifyAdminSession();
    const body = await request.json();
    const pledgeId = params.id;

    if (!session?.user && !isAdminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPledge = await prisma.pledge.findUnique({
      where: { id: pledgeId },
    });

    if (!existingPledge) {
      return NextResponse.json({ error: 'Pledge not found' }, { status: 404 });
    }

    const userIsAdmin = isAdminSession || (session?.user?.email && isAdmin(session.user.email));
    if (!userIsAdmin && existingPledge.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const validated = updatePledgeSchema.parse(body);

    const updateData: any = {
      ...validated,
      gcUsername: validated.gcUsername || existingPledge.gcUsername,
    };

    if ('images' in validated && validated.images !== undefined) {
      updateData.images = validated.images;
    }

    const pledge = await prisma.pledge.update({
      where: { id: pledgeId },
      data: updateData,
    });

    if (userIsAdmin && session?.user) {
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
    const session = await getSession();
    const isAdminSession = await verifyAdminSession();
    const pledgeId = params.id;

    if (!session?.user && !isAdminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingPledge = await prisma.pledge.findUnique({
      where: { id: pledgeId },
    });

    if (!existingPledge) {
      return NextResponse.json({ error: 'Pledge not found' }, { status: 404 });
    }

    const userIsAdmin = isAdminSession || (session?.user?.email && isAdmin(session.user.email));
    if (!userIsAdmin && existingPledge.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (userIsAdmin && session?.user) {
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

    // Delete images from UploadThing before deleting the pledge
    if (existingPledge.images) {
      await deleteUploadThingFiles(existingPledge.images as any[]);
    }

    // Also delete any associated submission images
    const associatedSubmission = await prisma.submission.findFirst({
      where: { pledgeId },
    });
    if (associatedSubmission?.images) {
      await deleteUploadThingFiles(associatedSubmission.images as any[]);
    }

    await prisma.pledge.delete({
      where: { id: pledgeId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting pledge:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete pledge' }, { status: 500 });
  }
}
