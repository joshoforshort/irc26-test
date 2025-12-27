import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [pledges, submissions] = await Promise.all([
      prisma.pledge.findMany({
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
      }),
      prisma.submission.findMany({
        where: {
          images: {
            not: Prisma.DbNull,
          },
        },
        select: {
          id: true,
          cacheName: true,
          gcUsername: true,
          images: true,
          createdAt: true,
          state: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

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

    for (const submission of submissions) {
      if (submission.images && Array.isArray(submission.images)) {
        for (const img of submission.images as { url: string; key: string }[]) {
          allImages.push({
            url: img.url,
            key: img.key,
            title: submission.cacheName,
            gcUsername: submission.gcUsername,
            createdAt: submission.createdAt,
            state: submission.state,
          });
        }
      }
    }

    // Get pledge image URLs to filter out duplicates from submissions
    const pledgeImageUrls = new Set<string>();
    for (const pledge of pledges) {
      if (pledge.images && Array.isArray(pledge.images)) {
        for (const img of pledge.images as { url: string; key: string }[]) {
          pledgeImageUrls.add(img.url);
        }
      }
    }

    // Filter out submission images that are duplicates of pledge images
    const uniqueImages = allImages.filter((img, index) => {
      // Keep all pledge images (they come first in the array)
      const isPledgeImage = index < pledges.reduce((count, p) => {
        return count + (p.images && Array.isArray(p.images) ? (p.images as any[]).length : 0);
      }, 0);
      
      if (isPledgeImage) return true;
      
      // For submission images, only keep if URL is not already in pledges
      return !pledgeImageUrls.has(img.url);
    });

    // Sort by createdAt descending
    const sortedImages = uniqueImages
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ images: sortedImages });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ images: [] });
  }
}
