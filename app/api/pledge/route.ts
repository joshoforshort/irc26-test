import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pledgeSchema } from '@/lib/validation';
import { createEditToken } from '@/lib/auth';
import { sendMagicLink } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = pledgeSchema.parse(body);

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
      // Update username if different
      user = await prisma.user.update({
        where: { id: user.id },
        data: { username: validated.username },
      });
    }

    // Create pledge
    const pledge = await prisma.pledge.create({
      data: {
        userId: user.id,
        pledgedCount: validated.pledgedCount,
        cacheTypes: validated.cacheTypes,
        cacheSizes: validated.cacheSizes,
        states: validated.states,
        approxLocations: validated.approxLocations || [],
        ideaNotes: validated.ideaNotes || null,
        photoUrls: validated.photoUrls || [],
      },
    });

    // Generate edit token and send magic link
    const token = await createEditToken(user.id);
    await sendMagicLink(user.email, token);

    return NextResponse.json({
      success: true,
      pledgeId: pledge.id,
      message: 'Pledge created successfully',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating pledge:', error);
    return NextResponse.json(
      { error: 'Failed to create pledge' },
      { status: 500 }
    );
  }
}





