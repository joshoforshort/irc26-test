import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { visitorId } = await request.json();
    const postId = params.id;

    if (!visitorId) {
      return NextResponse.json({ error: 'Visitor ID required' }, { status: 400 });
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_visitorId: { postId, visitorId }
      }
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: { id: existingLike.id }
      });
      const count = await prisma.postLike.count({ where: { postId } });
      return NextResponse.json({ liked: false, count });
    } else {
      await prisma.postLike.create({
        data: { postId, visitorId }
      });
      const count = await prisma.postLike.count({ where: { postId } });
      return NextResponse.json({ liked: true, count });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visitorId = request.nextUrl.searchParams.get('visitorId');
    const postId = params.id;

    const count = await prisma.postLike.count({ where: { postId } });
    
    let liked = false;
    if (visitorId) {
      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_visitorId: { postId, visitorId }
        }
      });
      liked = !!existingLike;
    }

    return NextResponse.json({ liked, count });
  } catch (error) {
    console.error('Error getting like status:', error);
    return NextResponse.json({ error: 'Failed to get like status' }, { status: 500 });
  }
}
