import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEditToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const userId = await validateEditToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pledges: {
          orderBy: { createdAt: 'desc' },
        },
        confirmations: {
          orderBy: { createdAt: 'desc' },
          include: {
            pledge: {
              select: {
                id: true,
                pledgedCount: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      pledges: user.pledges,
      confirmations: user.confirmations,
      token, // Return token for use in subsequent requests
    });
  } catch (error) {
    console.error('Error fetching manage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}





