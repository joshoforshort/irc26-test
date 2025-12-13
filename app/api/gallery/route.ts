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
        images: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const allImages: { url: string; key: string; createdAt: Date }[] = [];

    for (const pledge of pledges) {
      if (pledge.images && Array.isArray(pledge.images)) {
        for (const img of pledge.images as { url: string; key: string }[]) {
          allImages.push({
            url: img.url,
            key: img.key,
            createdAt: pledge.createdAt,
          });
        }
      }
    }

    // Sort by createdAt descending and take the latest 9
    const latestImages = allImages
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 9)
      .map(({ url, key }) => ({ url, key }));

    return NextResponse.json({ images: latestImages });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ images: [] });
  }
}
