import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { gcUsernameSchema } from '@/lib/validation';

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        gcUsername: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const validated = gcUsernameSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        gcUsername: validated.gcUsername,
      },
      select: {
        id: true,
        email: true,
        gcUsername: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}
