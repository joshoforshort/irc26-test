import { compare, hash } from 'bcryptjs';
import { prisma } from './prisma';
import { randomBytes } from 'crypto';

/**
 * Admin authentication
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin) {
    return false;
  }

  return compare(password, admin.password);
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

/**
 * Edit token management
 */
export async function createEditToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  console.log('[createEditToken] Creating token for userId:', userId);
  console.log('[createEditToken] Token expires at:', expiresAt);

  try {
    const created = await prisma.editToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
    console.log('[createEditToken] Token created successfully:', created.id);
    return token;
  } catch (error) {
    console.error('[createEditToken] Error creating token:', error);
    throw error;
  }
}

export async function validateEditToken(token: string): Promise<string | null> {
  console.log('[validateEditToken] Validating token:', token.substring(0, 10) + '...');
  
  try {
    const editToken = await prisma.editToken.findUnique({
      where: { token },
      include: { user: true },
    });

    console.log('[validateEditToken] Token lookup result:', editToken ? 'found' : 'not found');

    if (!editToken) {
      console.log('[validateEditToken] Token not found in database');
      return null;
    }

    const now = new Date();
    console.log('[validateEditToken] Token expires at:', editToken.expiresAt);
    console.log('[validateEditToken] Current time:', now);
    console.log('[validateEditToken] Is expired?', editToken.expiresAt < now);

    if (editToken.expiresAt < now) {
      // Token expired, delete it
      console.log('[validateEditToken] Token expired, deleting...');
      await prisma.editToken.delete({
        where: { id: editToken.id },
      });
      return null;
    }

    console.log('[validateEditToken] Token valid, returning userId:', editToken.userId);
    return editToken.userId;
  } catch (error) {
    console.error('[validateEditToken] Error validating token:', error);
    return null;
  }
}

export async function deleteEditToken(token: string): Promise<void> {
  await prisma.editToken.deleteMany({
    where: { token },
  });
}





