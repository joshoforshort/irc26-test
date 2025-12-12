import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEditToken, deleteEditToken } from '@/lib/auth';
import { editPledgeSchema } from '@/lib/validation';
import { verifyAdminSession } from '@/lib/admin-session';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await verifyAdminSession();
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    let userId: string | null = null;

    if (!isAdmin) {
      if (!token) {
        return NextResponse.json(
          { error: 'Token is required' },
          { status: 400 }
        );
      }

      userId = await validateEditToken(token);

      if (!userId) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const validated = editPledgeSchema.parse(body);

    const pledge = await prisma.pledge.findUnique({
      where: { id: params.id },
    });

    if (!pledge) {
      return NextResponse.json(
        { error: 'Pledge not found' },
        { status: 404 }
      );
    }

    if (!isAdmin && pledge.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const updated = await prisma.pledge.update({
      where: { id: params.id },
      data: {
        ...(validated.gcUsername && { gcUsername: validated.gcUsername }),
        ...(validated.title !== undefined && { title: validated.title }),
        ...(validated.cacheType && { cacheType: validated.cacheType }),
        ...(validated.cacheSize && { cacheSize: validated.cacheSize }),
        ...(validated.approxSuburb && { approxSuburb: validated.approxSuburb }),
        ...(validated.approxState && { approxState: validated.approxState }),
        ...(validated.conceptNotes !== undefined && { conceptNotes: validated.conceptNotes }),
        ...(validated.images !== undefined && { images: validated.images }),
      },
    });

    return NextResponse.json({
      success: true,
      pledge: updated,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating pledge:', error);
    return NextResponse.json(
      { error: 'Failed to update pledge' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await verifyAdminSession();
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    let userId: string | null = null;

    if (!isAdmin) {
      if (!token) {
        return NextResponse.json(
          { error: 'Token is required' },
          { status: 400 }
        );
      }

      userId = await validateEditToken(token);

      if (!userId) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    }

    const pledge = await prisma.pledge.findUnique({
      where: { id: params.id },
    });

    if (!pledge) {
      return NextResponse.json(
        { error: 'Pledge not found' },
        { status: 404 }
      );
    }

    if (!isAdmin && pledge.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    await prisma.pledge.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Pledge deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting pledge:', error);
    return NextResponse.json(
      { error: 'Failed to delete pledge' },
      { status: 500 }
    );
  }
}
