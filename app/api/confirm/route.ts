import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createEditToken } from '@/lib/auth';
import { sendMagicLink } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    //const validated = confirmationSchema.parse(body);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: validated.email,
          username: validated.username,
        },
      });
    } else if (user.username !== validated.username) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { username: validated.username },
      });
    }

    let pledgeId: string | null = null;

    // If no previous pledge, create one
    if (validated.noPreviousPledge) {
      const pledge = await prisma.pledge.create({
        data: {
          userId: user.id,
          pledgedCount: 1,
          cacheTypes: [validated.type],
          cacheSizes: [validated.size],
          states: [validated.state],
          approxLocations: [validated.suburb],
          ideaNotes: null,
          photoUrls: [],
        },
      });
      pledgeId = pledge.id;
    } else {
      // Try to find an existing pledge for this user
      const existingPledge = await prisma.pledge.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
      if (existingPledge) {
        pledgeId = existingPledge.id;
      }
    }

    // Create confirmation
    const confirmation = await prisma.confirmation.create({
      data: {
        userId: user.id,
        pledgeId: pledgeId,
        gcCode: validated.gcCode,
        cacheName: validated.cacheName,
        type: validated.type,
        size: validated.size,
        difficulty: validated.difficulty,
        terrain: validated.terrain,
        suburb: validated.suburb,
        state: validated.state,
        notes: validated.notes || null,
        fromNonPledge: validated.noPreviousPledge,
      },
    });

    // Generate edit token and send magic link
    const token = await createEditToken(user.id);
    await sendMagicLink(user.email, token);

    return NextResponse.json({
      success: true,
      confirmationId: confirmation.id,
      message: 'Confirmation created successfully',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to create confirmation' },
      { status: 500 }
    );
  }
}





