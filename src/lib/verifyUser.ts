import { NextRequest } from 'next/server';

import User from '@/models/User';

import dbConnect from './dbConnect';
import { logtoClient } from './logto';

export async function verifyAuth(request: NextRequest) {
  const { isAuthenticated, claims } = await logtoClient.getLogtoContext(request);
  return {
    isAuthenticated,
    claims: claims ?? null,
  };
}

export async function verifyAdmin(request: NextRequest) {
  const { isAuthenticated, claims } = await verifyAuth(request);
  if (!isAuthenticated || !claims) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      claims: null,
    };
  }

  await dbConnect();
  const user = await User.findOne({ sub: claims.sub });
  return {
    isAuthenticated: true,
    isAdmin: user?.isAdmin ?? false,
    claims: claims,
  };
}
