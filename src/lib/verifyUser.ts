import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

import { db } from '@/db';
import { usersSchema } from '@/db/schema';

import { logtoClient } from './logto';

export async function verifyAuth(request: NextRequest) {
  const { isAuthenticated, claims } = await logtoClient.getLogtoContext(request);
  return {
    isAuthenticated,
    claims,
  };
}

export async function verifyAdmin(request: NextRequest) {
  const { isAuthenticated, claims } = await verifyAuth(request);
  if (!isAuthenticated || !claims) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      claims,
    };
  }

  const user = await db.query.usersSchema.findFirst({
    where: eq(usersSchema.id, claims.sub),
  });

  return {
    isAuthenticated: true,
    isAdmin: user?.role !== 'default',
    claims,
  };
}
