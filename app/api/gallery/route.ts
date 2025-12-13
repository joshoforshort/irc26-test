import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const pledges = await prisma.pledge.findMany({
      where: {
        images: {
          not: Prisma.DbNull,
        },
      },
      select: {
        id: true,
        title: true,
        gcUsername: true,
        images: true,
        createdAt: true,
        approxState: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const allImages: { 
      url: string; 
      key: string; 
      title: string | null;
      gcUsername: string;
      createdAt: Date;
      state: string;
    }[] = [];

    for (const pledge of pledges) {
      if (pledge.images && Array.isArray(pledge.images)) {
        for (const img of pledge.images as { url: string; key: string }[]) {
          allImages.push({
            url: img.url,
            key: img.key,
            title: pledge.title,
            gcUsername: pledge.gcUsername,
            createdAt: pledge.createdAt,
            state: pledge.approxState,
          });
        }
      }
    }

    // Sort by createdAt descending and take the latest 9
    const latestImages = allImages
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 9);

    return NextResponse.json({ images: latestImages });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ images: [] });
  }
}
