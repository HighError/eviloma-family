// app/api/logto/sign-in-callback/route.ts
import { type NextRequest } from 'next/server';

import { logtoClient } from '@/lib/logto';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return logtoClient.handleSignInCallback('/dashboard')(request);
}
