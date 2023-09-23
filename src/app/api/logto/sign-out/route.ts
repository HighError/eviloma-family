// app/api/logto/sign-out/route.ts
import { type NextRequest } from 'next/server';

import { logtoClient } from '@/lib/logto';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return logtoClient.handleSignOut(`${process.env.BASE_URL}`)(request);
}
