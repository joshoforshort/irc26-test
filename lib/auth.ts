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

  await prisma.editToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function validateEditToken(token: string): Promise<string | null> {
  const editToken = await prisma.editToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!editToken) {
    return null;
  }

  if (editToken.expiresAt < new Date()) {
    // Token expired, delete it
    await prisma.editToken.delete({
      where: { id: editToken.id },
    });
    return null;
  }

  return editToken.userId;
}

export async function deleteEditToken(token: string): Promise<void> {
  await prisma.editToken.deleteMany({
    where: { token },
  });
}





