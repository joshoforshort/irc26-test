import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEditToken } from '@/lib/auth';
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

    const confirmation = await prisma.confirmation.findUnique({
      where: { id: params.id },
    });

    if (!confirmation) {
      return NextResponse.json(
        { error: 'Confirmation not found' },
        { status: 404 }
      );
    }

    if (!isAdmin && confirmation.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const updated = await prisma.confirmation.update({
      where: { id: params.id },
      data: {
        gcCode: body.gcCode,
        cacheName: body.cacheName,
        type: body.type,
        size: body.size,
        difficulty: body.difficulty,
        terrain: body.terrain,
        suburb: body.suburb,
        state: body.state,
        notes: body.notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      confirmation: updated,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to update confirmation' },
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

    const confirmation = await prisma.confirmation.findUnique({
      where: { id: params.id },
    });

    if (!confirmation) {
      return NextResponse.json(
        { error: 'Confirmation not found' },
        { status: 404 }
      );
    }

    if (!isAdmin && confirmation.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    await prisma.confirmation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Confirmation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to delete confirmation' },
      { status: 500 }
    );
  }
}
