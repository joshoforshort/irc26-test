import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { updateSubmissionSchema } from '@/lib/validation';
import { isAdmin } from '@/lib/auth-config';
import { verifyAdminSession } from '@/lib/admin-session';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const isAdminSession = await verifyAdminSession();
    const submissionId = params.id;

    if (!session?.user && !isAdminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const userIsAdmin = isAdminSession || (session?.user?.email && isAdmin(session.user.email));
    if (!userIsAdmin && submission.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ submission });
  } catch (error: any) {
    console.error('Error fetching submission:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch submission' }, { status: 500 });
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
    const submissionId = params.id;

    if (!session?.user && !isAdminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const userIsAdmin = isAdminSession || (session?.user?.email && isAdmin(session.user.email));
    if (!userIsAdmin && existingSubmission.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const validated = updateSubmissionSchema.parse(body);

    const updateData: any = { ...validated };
    if (validated.hiddenDate) {
      updateData.hiddenDate = typeof validated.hiddenDate === 'string' 
        ? new Date(validated.hiddenDate) 
        : validated.hiddenDate;
    }

    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: updateData,
    });

    if (userIsAdmin && session?.user) {
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          actorEmail: session.user.email || undefined,
          action: 'UPDATE_SUBMISSION',
          targetId: submissionId,
          targetKind: 'SUBMISSION',
          before: existingSubmission as any,
          after: submission as any,
        },
      });
    }

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error('Error updating submission:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const isAdminSession = await verifyAdminSession();
    const submissionId = params.id;

    if (!session?.user && !isAdminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const userIsAdmin = isAdminSession || (session?.user?.email && isAdmin(session.user.email));
    if (!userIsAdmin && existingSubmission.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (userIsAdmin && session?.user) {
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          actorEmail: session.user.email || undefined,
          action: 'DELETE_SUBMISSION',
          targetId: submissionId,
          targetKind: 'SUBMISSION',
          before: existingSubmission as any,
        },
      });
    }

    await prisma.$transaction([
      prisma.submission.delete({
        where: { id: submissionId },
      }),
      prisma.pledge.update({
        where: { id: existingSubmission.pledgeId },
        data: { status: 'CONCEPT' },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete submission' }, { status: 500 });
  }
}
